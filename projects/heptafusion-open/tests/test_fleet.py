import unittest
from ibra_os.agents.fleet import FleetAgent

class TestFleetAgent(unittest.TestCase):
    def setUp(self):
        self.agent = FleetAgent()

    def test_get_all_locations(self):
        locations = self.agent.get_all_locations()
        self.assertIn("ROBOT-01", locations)
        self.assertEqual(locations["ROBOT-01"]["lat"], 45.5017)

    def test_update_gps(self):
        self.agent.update_gps("ROBOT-01", 46.0, -74.0)
        loc = self.agent.track_unit("ROBOT-01")
        self.assertEqual(loc["lat"], 46.0)

    def test_fleet_diagnostic(self):
        diag = self.agent.get_fleet_diagnostic()
        self.assertEqual(diag["total_units"], 3)
        self.assertTrue(diag["average_health"] > 0)

if __name__ == "__main__":
    unittest.main()
