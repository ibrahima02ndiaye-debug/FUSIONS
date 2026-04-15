import os
import json
from datetime import datetime
from typing import List, Dict, Optional
from ibra_os.utils.i18n import I18nManager

class BaseAgent:
    def __init__(self, name: str):
        self.name = name

    def process(self, task: str) -> Dict:
        raise NotImplementedError

class SecretaryAgent(BaseAgent):
    """
    The Secretary agent is the orchestrator of Ibra-OS.
    """
    def __init__(self, lang="fr", mode="hermes"):
        super().__init__(name="Secretary")
        self.i18n = I18nManager(default_lang=lang)
        self.mode = mode.lower()
        self.specialization = "Orchestration & Communication"

        self.intent_map = {
            "vision": ["voir", "regarde", "image", "photo", "diagnostic", "frein", "brake", "view", "gemma"],
            "memory": ["rendez-vous", "client", "rdv", "horaire", "liste", "appointment", "schedule"],
            "physics": ["moteur", "vibration", "son", "bruit", "engine", "noise"],
            "inventory": ["stock", "pièce", "part", "filtre", "filter", "pneu", "tire"],
            "history": ["historique", "passé", "ancien", "history", "previous", "record"],
            "humanoid": ["robot", "humanoid", "manipuler", "bras", "reparer", "robotics", "arm"],
            "fleet": ["flotte", "gps", "localisation", "position", "unités", "fleet", "tracking"],
            "merger": ["fusion", "brain", "merge", "intelligence", "merge_models", "slerp"],
            "twin": ["simulation", "twin", "jumelage", "jumeau", "predictive", "maintenance"]
        }

    def set_mode(self, mode: str):
        if mode.lower() in ["hermes", "claw"]:
            self.mode = mode.lower()
            print(f"[{self.name}] Mode switched to: {self.mode.upper()}")

    def _log_to_hud(self, sender: str, message: str):
        log_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), "dashboard", "logs.json")
        # Use simple append-only line-delimited JSON or similar to avoid full read-write race
        # But for this platform, we'll use a file lock approach if we want to stick to JSON
        import fcntl

        new_entry = {
            "time": datetime.now().strftime("%H:%M:%S"),
            "sender": sender.upper(),
            "message": message
        }

        try:
            with open(log_file, 'a+') as f:
                fcntl.flock(f, fcntl.LOCK_EX)
                f.seek(0)
                content = f.read()
                if content:
                    logs = json.loads(content)
                else:
                    logs = []

                logs.append(new_entry)
                logs = logs[-50:]

                f.seek(0)
                f.truncate()
                json.dump(logs, f, indent=2)
                fcntl.flock(f, fcntl.LOCK_UN)
        except (IOError, json.JSONDecodeError):
            pass

    def process(self, query: str) -> Dict:
        msg = f"{self.i18n.get('secretary_analyzing')}: {query}"
        print(f"[{self.name}] ({self.mode.upper()}) {msg}")
        self._log_to_hud("SECRETARY", msg)
        query_lower = query.lower()

        if self.mode == "claw":
            # Advanced Agentic Mode (OpenClaw style): Multi-intent detection with reasoning
            thought_msg = "Analyzing user intent and context via autonomous reasoning chain..."
            print(f"[{self.name}] [THOUGHT] {thought_msg}")
            self._log_to_hud("SECRETARY", f"[THOUGHT] {thought_msg}")

            detected_intents = []
            for intent, keywords in self.intent_map.items():
                if any(keyword in query_lower for keyword in keywords):
                    match_msg = f"Potential match identified for specialized domain: {intent}"
                    print(f"[{self.name}] [THOUGHT] {match_msg}")
                    self._log_to_hud("SECRETARY", f"[THOUGHT] {match_msg}")
                    detected_intents.append({
                        "target": intent.capitalize(),
                        "action": self._get_action_for_intent(intent)
                    })

            # Check if we need to simulate a Knowledge Base lookup
            if "history" in query_lower or "ancien" in query_lower or "passé" in query_lower:
                kb_msg = "Initiating DeepSearch on historical garage records..."
                self._log_to_hud("SECRETARY", f"[THOUGHT] {kb_msg}")
                kb_data = self.simulate_knowledge_lookup(query)
                detected_intents.append({
                    "target": "History",
                    "action": "retrieve_history",
                    "data": kb_data
                })

            if detected_intents:
                reasoning = f"OpenClaw autonomous analysis: {len(detected_intents)} action vectors identified. "
                reasoning += "Orchestrating sequential multi-agent delegation."
                self._log_to_hud("SECRETARY", f"[CLAW] {reasoning}")

                return {
                    "mode": "CLAW",
                    "intents": detected_intents,
                    "query": query,
                    "execution_plan": [f"Step {idx+1}: Delegate {i['action']} to {i['target']}Agent" for idx, i in enumerate(detected_intents)],
                    "reasoning": reasoning
                }

        # Default/HERMES Mode: Single intent keyword matching
        for intent, keywords in self.intent_map.items():
            if any(keyword in query_lower for keyword in keywords):
                return {
                    "mode": "HERMES",
                    "target": intent.capitalize(),
                    "action": self._get_action_for_intent(intent),
                    "query": query
                }

        return {"mode": self.mode.upper(), "target": "General", "action": "chat", "query": query}

    def simulate_knowledge_lookup(self, query: str) -> str:
        """
        Simulates long-term memory/knowledge base retrieval.
        """
        lookup_msg = f"Retrieved 3 historical records related to: {query}"
        print(f"[{self.name}] [MEMORY] {lookup_msg}")
        return lookup_msg

    def _get_action_for_intent(self, intent: str) -> str:
        actions = {
            "vision": "analyze_visuals",
            "memory": "query_database",
            "physics": "analyze_physics",
            "inventory": "check_stock",
            "history": "retrieve_history",
            "humanoid": "perform_manipulation",
            "fleet": "get_all_locations",
            "merger": "initiate_dynamic_merge",
            "twin": "simulate_repair"
        }
        return actions.get(intent, "process")

    def confirm_appointment(self, client_name: str, date: str) -> bool:
        msg = self.i18n.get("confirmation_sent", name=client_name, date=date)
        print(f"[{self.name}] {msg} via Twilio/WhatsApp...")
        return True
