import torch
import torch.nn as nn
from ml.config import CFG
import torch.nn.functional as F

class TabularNet(nn.Module):
    def __init__(self, input_dim: int = 3):
        """
        Args:
            input_dim: Number of clinical features (default: Age, Sex, FVC)
        """
        super().__init__()

        # Feature normalization layer
        self.norm = nn.BatchNorm1d(input_dim)

        # Core network
        self.fc1 = nn.Linear(input_dim, 32)
        self.fc2 = nn.Linear(32, CFG.TABULAR_EMBED_SIZE)

        # Dropout for regularization
        self.dropout = nn.Dropout(0.2)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # Normalize input
        x = self.norm(x)

        # Forward pass
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)

        return x

# Supporting functions
def preprocess_clinical(df_row):
    """
    Convert raw clinical data into model-ready format
    """
    from config import CFG

    # Convert sex to binary
    sex = 0 if df_row['Sex'] == 'Male' else 1

    # Create feature vector
    features = torch.tensor([
        df_row['Age'],
        sex,
        df_row['FVC']
    ], dtype=torch.float32)

    return features