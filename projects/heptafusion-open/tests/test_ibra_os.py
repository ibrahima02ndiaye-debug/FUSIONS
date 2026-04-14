import unittest
from ibra_os.agents.secretary import SecretaryAgent
from ibra_os.database.db_manager import init_db
import os
import sqlite3

class TestIbraOS(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.test_db = "tests/test_garage_memory.db"
        init_db(cls.test_db)

    @classmethod
    def tearDownClass(cls):
        if os.path.exists(cls.test_db):
            os.remove(cls.test_db)

    def test_secretary_dispatch(self):
        secretary = SecretaryAgent()
        # Test vision dispatch
        res = secretary.process("Peux-tu regarder cette image de frein?")
        self.assertEqual(res['target'], "Vision")

        # Test memory dispatch
        res = secretary.process("Quels sont les rendez-vous de demain?")
        self.assertEqual(res['target'], "Memory")
        self.assertEqual(res['mode'], "HERMES")

    def test_secretary_modes(self):
        # Default mode (Hermes)
        secretary = SecretaryAgent()
        self.assertEqual(secretary.mode, "hermes")

        # Switch to Claw
        secretary.set_mode("claw")
        self.assertEqual(secretary.mode, "claw")

        # Test Claw multi-intent detection
        query = "Regarde mes freins et prends un rdv."
        res = secretary.process(query)
        self.assertEqual(res['mode'], "CLAW")
        self.assertTrue(len(res['intents']) >= 2)
        targets = [i['target'] for i in res['intents']]
        self.assertIn("Vision", targets)
        self.assertIn("Memory", targets)

        # Switch back to Hermes
        secretary.set_mode("hermes")
        res = secretary.process(query)
        self.assertEqual(res['mode'], "HERMES")
        # Hermes only picks one (the first it finds)
        self.assertIn(res['target'], ["Vision", "Memory"])

    def test_database_schema(self):
        self.assertTrue(os.path.exists(self.test_db))

        conn = sqlite3.connect(self.test_db)
        cursor = conn.cursor()

        # Check tables exist
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [row[0] for row in cursor.fetchall()]
        self.assertIn('clients', tables)
        self.assertIn('appointments', tables)
        self.assertIn('part_orders', tables)

        conn.close()

if __name__ == "__main__":
    unittest.main()
