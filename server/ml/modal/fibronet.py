import torch
import torch.nn as nn
import torchvision.models as models
from ml.modal.tabnet import TabularNet
from ml.config import CFG

class FibroNet(nn.Module):
    def __init__(self):
        super().__init__()

        # ===== IMAGE PROCESSING BRANCH =====
        # Convert grayscale to 3-channel (RGB) for EfficientNet
        self.grayscale_to_rgb = nn.Conv2d(1, 3, kernel_size=1, stride=1, padding=0)

        # Load EfficientNet with modified input channel handling
        self.cnn = models.efficientnet_b0(weights=None)
        self.cnn.features[0][0] = nn.Conv2d(3, 32, kernel_size=3, stride=2, padding=1, bias=False)
        self.cnn.classifier = nn.Identity()  # Remove final classification layer

        # ===== TABULAR PROCESSING BRANCH =====
        self.tabnet = TabularNet(input_dim=len(CFG.TABULAR_FEATURES))

        # ===== FUSION LAYERS =====
        self.fusion = nn.Sequential(
            nn.Linear(1280 + 16, 64),  # CNN features + tabular features
            nn.ReLU(),
            nn.Linear(64, 1)  # Final prediction (FVC slope)
        )

    def forward(self, img: torch.Tensor, tab: torch.Tensor) -> torch.Tensor:
        # Process CT scan (convert to 3 channels)
        x_img = self.grayscale_to_rgb(img)
        x_img = self.cnn(x_img)

        # Process clinical data
        x_tab = self.tabnet(tab)

        # Combine features
        x = torch.cat([x_img, x_tab], dim=1)
        return self.fusion(x)

