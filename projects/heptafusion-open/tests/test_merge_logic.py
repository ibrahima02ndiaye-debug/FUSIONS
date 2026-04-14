import torch
from heptafusion.merge import weighted_average, slerp, dare_linear

def test_weighted_average():
    t1 = torch.tensor([1.0, 2.0])
    t2 = torch.tensor([3.0, 4.0])
    weights = [0.5, 0.5]
    res = weighted_average([t1, t2], weights)
    expected = torch.tensor([2.0, 3.0])
    assert torch.allclose(res, expected), f"Expected {expected}, got {res}"
    print("test_weighted_average passed!")

def test_slerp():
    t1 = torch.tensor([1.0, 0.0])
    t2 = torch.tensor([0.0, 1.0])
    res = slerp(t1, t2, 0.5)
    # At 0.5, it should be at 45 degrees: (cos(45), sin(45)) = (0.7071, 0.7071)
    val = 1.0 / (2**0.5)
    expected = torch.tensor([val, val])
    assert torch.allclose(res, expected, atol=1e-4), f"Expected {expected}, got {res}"
    print("test_slerp passed!")

def test_dare_linear():
    t1 = torch.tensor([1.0, 1.0, 1.0, 1.0], dtype=torch.float32)
    t2 = torch.tensor([2.0, 2.0, 2.0, 2.0], dtype=torch.float32)
    # dare_linear(tensors, weights, density=0.9)
    # with density=1.0, it should be like linear merge
    res = dare_linear([t1, t2], [0.0, 1.0], density=1.0)
    expected = torch.tensor([2.0, 2.0, 2.0, 2.0])
    assert torch.allclose(res, expected), f"Expected {expected}, got {res}"
    print("test_dare_linear passed!")

if __name__ == "__main__":
    test_weighted_average()
    test_slerp()
    test_dare_linear()
