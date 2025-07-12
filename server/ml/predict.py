import torch
import numpy as np
from ml.modal.ct import load_dicom_images_3d  
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
    if slope > -5:
        return (f"🌟 Great news! Your lungs are showing only mild changes ({slope:.1f} mL/week). "
                "This suggests your current treatment plan is effective. Keep up with your regular exercise, "
                "hydration, and medications.\n\n"
                "🫁 Tips:\n"
                "- Maintain a balanced diet rich in antioxidants (like fruits and veggies).\n"
                "- Continue regular breathing exercises to support lung capacity.\n"
                "- Attend follow-up appointments as scheduled.\n"
                "- Track symptoms like coughing or fatigue to report to your doctor.\n"
                "- Avoid exposure to air pollutants and secondhand smoke.")

    elif -10 <= slope <= -5:
        return (f"🔄 Your lung function is declining moderately ({slope:.1f} mL/week). "
                "This may indicate early progression. It's a good time to review your care plan.\n\n"
                "🩺 Recommendations:\n"
                "- Discuss medication adjustments or inhalation therapy options with your doctor.\n"
                "- Increase focus on airway clearance techniques (e.g., chest physiotherapy).\n"
                "- Use a peak flow meter regularly to monitor lung strength.\n"
                "- Make sure vaccinations are up-to-date (flu, pneumonia, etc).\n"
                "- Minimize stress and prioritize rest and hydration.")

    else:
        return (f"⚠️ Significant decline detected ({slope:.1f} mL/week). This is a concerning rate of lung function loss. "
                "Please consult your healthcare team urgently to adjust your treatment plan.\n\n"
                "🚨 Urgent Action Plan:\n"
                "- Book a pulmonary function test or CT scan if due.\n"
                "- Ask your doctor about new CFTR modulator therapies or clinical trials.\n"
                "- Limit physical strain but stay lightly active (guided by physiotherapist).\n"
                "- Ensure strict adherence to prescribed medications and airway clearance routines.\n"
                "- Monitor for warning signs: chest tightness, persistent cough, or weight loss.")



# def predict(patient_folder: str, age: int, sex: str, fvc: float):
#     """Predict FVC slope from uploaded DICOMs and clinical data"""   
    
# 1. Load model
def predict(patient_folder: str, age, sex, fvc):
    # Validate inputs
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
    model.eval() 

    # 2. Load DICOMs
    volume = load_dicom_images_3d(patient_folder)
    if volume is None:
        return None, "No DICOM files found"
    print(f" Volume shape: {volume.shape}")

    # 3. Preprocess
    try:
        img_tensor = preprocess_volume(volume)
        print(f"📍 Preprocessing volume shape: {volume.shape}")
        print(f"📍 Preprocessed image tensor shape: {img_tensor.shape}")

    except Exception as e:
        return None, f"Image processing error: {str(e)}"
    
    # 4. Prepare clinical data tensor
    sex_encoded = 0 if sex == "male" else 1
    clinical_tensor = torch.tensor([[age, sex_encoded, fvc]], dtype=torch.float32)

    # 5. Predict
    with torch.no_grad():
        prediction = model(img_tensor.to(CFG.DEVICE), clinical_tensor.to(CFG.DEVICE)).item()  # Get prediction
    
    return prediction, generate_health_message(prediction)
