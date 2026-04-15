import unittest
from ibra_os.agents.merger import ExpertMergeAgent
from ibra_os.agents.twin import DigitalTwinAgent

class TestInnovationAgents(unittest.TestCase):
    def test_merger(self):
        agent = ExpertMergeAgent()
        res = agent.process("Need a fusion for engine tuning")
        self.assertEqual(res['status'], "success")
        self.assertIn("fusion_id", res)

    def test_twin(self):
        agent = DigitalTwinAgent()
        res = agent.simulate_repair("VIN123", "oil change")
        self.assertEqual(res['outcome'], "Success")
        self.assertEqual(res['post_health_score'], 96)

if __name__ == "__main__":
    unittest.main()
