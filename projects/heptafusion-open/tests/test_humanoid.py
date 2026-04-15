import unittest
from ibra_os.agents.humanoid import HumanoidAgent

class TestHumanoidAgent(unittest.TestCase):
    def setUp(self):
        self.agent = HumanoidAgent()

    def test_process_task(self):
        result = self.agent.process("repair engine block")
        self.assertEqual(result["agent"], "Humanoid")
        self.assertEqual(result["status"], "success")
        self.assertIn("repair engine block", result["result"])
        self.assertIn("embodiment_data", result)

    def test_kinematics(self):
        result = self.agent.control_kinematics({"x": 10, "y": 20, "z": 30})
        self.assertEqual(result, "Kinematic adjustment complete.")

    def test_telemetry(self):
        telemetry = self.agent.get_system_telemetry()
        self.assertEqual(telemetry["battery"], 100)
        self.assertEqual(telemetry["status"], "standby")

if __name__ == "__main__":
    unittest.main()
