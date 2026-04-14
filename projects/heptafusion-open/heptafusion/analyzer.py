import torch
import torch.nn.functional as F

class ModelAnalyzer:
    """
    Analyzes model weights and structure to provide insights for merging.
    """
    def __init__(self, model):
        self.model = model
        self.state_dict = model.state_dict()

    def calculate_similarity(self, other_model):
        """
        Calculates the average cosine similarity between two models.
        """
        other_state_dict = other_model.state_dict()
        similarities = []

        keys = set(self.state_dict.keys()) & set(other_state_dict.keys())

        for key in keys:
            t1 = self.state_dict[key].flatten().to(torch.float32)
            t2 = other_state_dict[key].flatten().to(torch.float32)

            if t1.shape == t2.shape and t1.numel() > 0:
                # Cosine similarity
                sim = F.cosine_similarity(t1.unsqueeze(0), t2.unsqueeze(0))
                similarities.append(sim.item())

        if not similarities:
            return 0.0

        return sum(similarities) / len(similarities)

    def get_layer_info(self):
        """
        Returns information about model layers.
        """
        return {k: v.shape for k, v in self.state_dict.items()}
