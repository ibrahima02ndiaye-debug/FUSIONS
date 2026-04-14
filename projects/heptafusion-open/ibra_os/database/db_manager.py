import sqlite3
import os
from datetime import datetime

def init_db(db_path="ibra_os/database/garage_memory.db"):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Clients table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        vehicle TEXT
    )
    ''')

    # Appointments table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER,
        date TEXT,
        status TEXT,
        FOREIGN KEY (client_id) REFERENCES clients (id)
    )
    ''')

    # Parts orders table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS part_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        part_name TEXT,
        quantity INTEGER,
        status TEXT
    )
    ''')

    # Diagnostic history table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS diagnostic_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER,
        date TEXT,
        diagnosis TEXT,
        AI_score REAL,
        FOREIGN KEY (client_id) REFERENCES clients (id)
    )
    ''')

    conn.commit()
    conn.close()
    print(f"Database initialized at {db_path}")

class DBManager:
    def __init__(self, db_path="ibra_os/database/garage_memory.db"):
        self.db_path = db_path
        db_dir = os.path.dirname(self.db_path)
        if db_dir and not os.path.exists(db_dir):
             os.makedirs(db_dir, exist_ok=True)
        init_db(self.db_path)

    def search_client_history(self, client_name: str):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        query = '''
        SELECT dh.date, dh.diagnosis, dh.AI_score
        FROM diagnostic_history dh
        JOIN clients c ON dh.client_id = c.id
        WHERE c.name LIKE ?
        ORDER BY dh.date DESC
        '''
        cursor.execute(query, (f"%{client_name}%",))
        results = cursor.fetchall()
        conn.close()
        return results

    def add_diagnostic(self, client_id: int, diagnosis: str, score: float):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        date_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute('INSERT INTO diagnostic_history (client_id, date, diagnosis, AI_score) VALUES (?, ?, ?, ?)',
                       (client_id, date_str, diagnosis, score))
        conn.commit()
        conn.close()

if __name__ == "__main__":
    init_db()
