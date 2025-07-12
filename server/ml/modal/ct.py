import os
import torch
import pydicom
import numpy as np
from glob import glob
import cv2
from typing import Tuple
from ml.config import CFG

def load_dicom_images_3d(scan_folder: str, img_size: int = 128, depth: int = 64) -> np.ndarray:

    slices = []
    print(f" Looking for DICOMs in: {scan_folder}")
    for dcm_file in sorted(glob(os.path.join(scan_folder, "*.dcm"))):
        try:
            ds = pydicom.dcmread(dcm_file)
            img = ds.pixel_array.astype(np.float32)
        except Exception as e:
            print(f" Failed to read {dcm_file}: {e}")

        

        # 2. Resize and normalize
        img = cv2.resize(img, (img_size, img_size))
        img = (img - np.min(img)) / (np.max(img) - np.min(img) + 1e-6)
        slices.append(img)

        if len(slices) >= depth: 
            break

    if not slices:
        raise ValueError(f"No DICOM files found in {scan_folder}")

    # 3. Convert to 3D volume
    volume = np.stack(slices, axis=0)
    return volume

