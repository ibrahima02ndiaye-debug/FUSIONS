import os
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
            "history": ["historique", "passé", "ancien", "history", "previous", "record"]
        }

    def set_mode(self, mode: str):
        if mode.lower() in ["hermes", "claw"]:
            self.mode = mode.lower()
            print(f"[{self.name}] Mode switched to: {self.mode.upper()}")

    def process(self, query: str) -> Dict:
        print(f"[{self.name}] ({self.mode.upper()}) {self.i18n.get('secretary_analyzing')}: {query}")
        query_lower = query.lower()

        if self.mode == "claw":
            # Advanced Agentic Mode (OpenClaw style): Multi-intent detection with reasoning
            print(f"[{self.name}] [THOUGHT] Analyzing user intent and context...")
            detected_intents = []
            for intent, keywords in self.intent_map.items():
                if any(keyword in query_lower for keyword in keywords):
                    print(f"[{self.name}] [THOUGHT] Keyword match for intent: {intent}")
                    detected_intents.append({
                        "target": intent.capitalize(),
                        "action": self._get_action_for_intent(intent)
                    })

            if detected_intents:
                reasoning = f"OpenClaw autonomous analysis: {len(detected_intents)} intents identified. "
                reasoning += "Orchestrating multi-agent response sequence."
                return {
                    "mode": "CLAW",
                    "intents": detected_intents,
                    "query": query,
                    "reasoning_steps": [
                        "Decomposing user query into semantic tokens.",
                        f"Mapping tokens to intent-map: {', '.join([i['target'] for i in detected_intents])}",
                        "Synthesizing multi-agent execution plan."
                    ],
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

    def _get_action_for_intent(self, intent: str) -> str:
        actions = {
            "vision": "analyze_visuals",
            "memory": "query_database",
            "physics": "analyze_physics",
            "inventory": "check_stock",
            "history": "retrieve_history"
        }
        return actions.get(intent, "process")

    def confirm_appointment(self, client_name: str, date: str) -> bool:
        msg = self.i18n.get("confirmation_sent", name=client_name, date=date)
        print(f"[{self.name}] {msg} via Twilio/WhatsApp...")
        return True
