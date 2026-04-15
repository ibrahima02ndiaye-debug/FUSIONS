from ibra_os.agents.secretary import BaseAgent
from typing import Dict, List

class FleetAgent(BaseAgent):
    """
    Agent responsible for fleet management, GPS tracking, and real-time localization.
    """
    def __init__(self):
        super().__init__(name="Fleet")
        self.units = {
            "ROBOT-01": {"lat": 45.5017, "lng": -73.5673, "status": "active", "health": 98},
            "ROBOT-02": {"lat": 45.5088, "lng": -73.5540, "status": "idle", "health": 100},
            "DRONE-A": {"lat": 45.5333, "lng": -73.6000, "status": "charging", "health": 85}
        }

    def process(self, task: str) -> Dict:
        print(f"[{self.name}] Processing fleet task: {task}")
        if "localisation" in task.lower() or "gps" in task.lower():
            return {
                "agent": self.name,
                "status": "success",
                "data": self.get_all_locations()
            }
        return {
            "agent": self.name,
            "status": "success",
            "result": f"Fleet management action: {task}"
        }

    def get_all_locations(self) -> Dict:
        return self.units

    def track_unit(self, unit_id: str) -> Dict:
        return self.units.get(unit_id, {"error": "Unit not found"})

    def update_gps(self, unit_id: str, lat: float, lng: float):
        if unit_id in self.units:
            self.units[unit_id]["lat"] = lat
            self.units[unit_id]["lng"] = lng
            return True
        return False

    def get_fleet_diagnostic(self) -> Dict:
        return {
            "total_units": len(self.units),
            "online_units": sum(1 for u in self.units.values() if u["status"] != "offline"),
            "average_health": sum(u["health"] for u in self.units.values()) / len(self.units)
        }
