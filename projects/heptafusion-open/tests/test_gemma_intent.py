from ibra_os.agents.secretary import SecretaryAgent

def test_gemma_intent():
    secretary = SecretaryAgent()
    res = secretary.process("Peux-tu utiliser gemma pour analyser cette image?")
    assert res['target'] == "Vision", f"Expected Vision, got {res['target']}"
    print("test_gemma_intent passed!")

if __name__ == "__main__":
    test_gemma_intent()
