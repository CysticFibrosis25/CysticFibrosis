import torch
class CFG:
    # ======== IMAGE PROCESSING ========
    IMG_SIZE = 128        # All DICOM images will be resized to (128,128)
    VOLUME_DEPTH = 64     # Number of slices to include per patient (if needed)
    # ======== MODEL ARCHITECTURE ========
    MODEL_NAME = "efficientnet_b0"
    TABULAR_FEATURES = ["Age", "Sex", "FVC"]  # Clinical features used
    CNN_EMBED_SIZE = 1280  # Output size from EfficientNet
    TABULAR_EMBED_SIZE = 16  # Output from TabularNet
    # ======== DEVICE SETTINGS ========
    DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
print("Configuration loaded for predictions.")


