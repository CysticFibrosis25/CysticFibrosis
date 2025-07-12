import torch
class CFG:
    # ======== IMAGE PROCESSING ========
    IMG_SIZE = 128        
    VOLUME_DEPTH = 64     
    # ======== MODEL ARCHITECTURE ========
    MODEL_NAME = "efficientnet_b0"
    TABULAR_FEATURES = ["Age", "Sex", "FVC"]  
    CNN_EMBED_SIZE = 1280  
    TABULAR_EMBED_SIZE = 16  
    # ======== DEVICE SETTINGS ========
    DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
print("Configuration loaded for predictions.")


