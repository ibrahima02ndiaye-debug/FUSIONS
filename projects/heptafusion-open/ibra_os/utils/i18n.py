class I18nManager:
    """
    Handles internationalization for Ibra-OS.
    """
    def __init__(self, default_lang="fr"):
        self.lang = default_lang
        self.translations = {
            "fr": {
                "welcome": "Bienvenue sur Ibra-OS HUD",
                "agent_status": "Statut des Agents",
                "appointments": "Rendez-vous en cours",
                "stock": "Stocks & Pièces",
                "logs": "Logs Système",
                "mobile_title": "IBRA SERVICES INC. - Brain IA HUD",
                "mobile_camera": "📸 CAMERA",
                "mobile_vocal": "🎤 VOCAL",
                "secretary_analyzing": "Analyse de la requête",
                "confirmation_sent": "Confirmation envoyée à {name} pour le {date}",
                "mode_hermes": "Mode HERMES (Standard)",
                "mode_claw": "Mode CLAW (Autonome)"
            },
            "en": {
                "welcome": "Welcome to Ibra-OS HUD",
                "agent_status": "Agent Status",
                "appointments": "Live Appointments",
                "stock": "Stock & Parts",
                "logs": "System Logs",
                "mobile_title": "IBRA SERVICES INC. - Mobile HUD",
                "mobile_camera": "📸 CAMERA",
                "mobile_vocal": "🎤 VOCAL",
                "secretary_analyzing": "Analyzing request",
                "confirmation_sent": "Confirmation sent to {name} for {date}",
                "mode_hermes": "HERMES Mode (Standard)",
                "mode_claw": "CLAW Mode (Autonomous)"
            }
        }

    def set_language(self, lang):
        if lang in self.translations:
            self.lang = lang

    def get(self, key, **kwargs):
        text = self.translations.get(self.lang, self.translations["fr"]).get(key, key)
        return text.format(**kwargs)
