# ml/ct.py
import os
import torch
import pydicom
import numpy as np
from glob import glob
import cv2
from typing import Tuple
from ml.config import CFG

def load_dicom_images_3d(scan_folder: str, img_size: int = 128, depth: int = 64) -> np.ndarray:
    """
    Loads DICOM series into a 3D numpy array with preprocessing.

    Args:
        scan_folder: Path to directory containing DICOM files.
        img_size: Output size for resizing images (square).
        depth: Number of slices to include (front-most).

    Returns:
        3D numpy array shaped (depth, height, width).
    """
    # 1. Load all DICOM files
    slices = []
    for dcm_file in sorted(glob(os.path.join(scan_folder, "*.dcm"))):
        ds = pydicom.dcmread(dcm_file)
        img = ds.pixel_array.astype(np.float32)

        # 2. Resize and normalize
        img = cv2.resize(img, (img_size, img_size))
        img = (img - np.min(img)) / (np.max(img) - np.min(img) + 1e-6)
        slices.append(img)

        if len(slices) >= depth:  # Once we have enough slices
            break

    if not slices:
        raise ValueError(f"No DICOM files found in {scan_folder}")

    # 3. Convert to 3D volume
    volume = np.stack(slices, axis=0)
    return volume

