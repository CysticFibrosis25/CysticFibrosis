import torch
import numpy as np
from ml.modal.ct import load_dicom_images_3d  # Adjusted import path
from ml.modal.fibronet import FibroNet
from ml.config import CFG

def preprocess_volume(volume):
    """Converts DICOM volume to model-ready 2D slice"""
    try:
        # 1. Take middle slice (most representative)
        middle_slice = volume[volume.shape[0] // 2]
        
        # 2. Resize to model's expected dimensions
        if middle_slice.shape != (CFG.IMG_SIZE, CFG.IMG_SIZE):
            middle_slice = np.resize(middle_slice, (CFG.IMG_SIZE, CFG.IMG_SIZE))
            
        # 3. Normalize pixels to [0,1]
        middle_slice = (middle_slice - np.min(middle_slice)) / (np.max(middle_slice) - np.min(middle_slice) + 1e-6)
        
        return torch.tensor(middle_slice, dtype=torch.float32).unsqueeze(0).unsqueeze(0)  # [1,1,128,128]
    except Exception as e:
        raise ValueError(f"Preprocessing failed: {str(e)}")

def generate_health_message(slope):
    """Creates patient-friendly output"""
    if slope > -30:
        return (f"🌟 Great news! Your lungs are showing only mild changes ({slope:.1f} mL/week). "
                "This suggests your current treatment plan is effective. Keep up with your regular "
                "exercise and medications.")
    elif -50 <= slope <= -30:
        return (f"🔄 Your lung function is declining moderately ({slope:.1f} mL/week). "
                "Consider discussing medication adjustments with your doctor. Daily breathing exercises "
                "may help slow progression.")
    else:
        return (f"⚠️ Significant decline detected ({slope:.1f} mL/week). Please schedule an appointment "
                "with your care team immediately. New therapies may help stabilize your function.")

# def predict(patient_folder: str, age: int, sex: str, fvc: float):
#     """Predict FVC slope from uploaded DICOMs and clinical data"""
    # 1. Load model
def predict(patient_folder: str, age, sex, fvc):
    # ✅ Validate inputs
    try:
        age = float(age)
        fvc = float(fvc)
        sex = sex.strip().lower()
        if sex not in ["male", "female"]:
            raise ValueError("Sex must be 'male' or 'female'")
    except Exception as e:
        return None, f"Clinical input error: {str(e)}"

    model = FibroNet().to(CFG.DEVICE)
    model.load_state_dict(torch.load("ml/model.pth", map_location=CFG.DEVICE))
    model.eval()  # Set model to evaluation mode

    # 2. Load DICOMs
    volume = load_dicom_images_3d(patient_folder)
    if volume is None:
        return None, "No DICOM files found"

    # 3. Preprocess
    try:
        img_tensor = preprocess_volume(volume)
    except Exception as e:
        return None, f"Image processing error: {str(e)}"
    
    # 4. Prepare clinical data tensor
    # clinical_tensor = torch.tensor([[age, 0 if sex.lower() == "male" else 1, fvc]], dtype=torch.float32)
    sex_encoded = 0 if sex == "male" else 1
    clinical_tensor = torch.tensor([[age, sex_encoded, fvc]], dtype=torch.float32)


    # 5. Predict
    with torch.no_grad():
        prediction = model(img_tensor.to(CFG.DEVICE), clinical_tensor.to(CFG.DEVICE)).item()  # Get prediction
    
    return prediction, generate_health_message(prediction)
