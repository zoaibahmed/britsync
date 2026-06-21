
import sqlite3
import os

db_path = r"e:\britsync\brit\news-automation\news.db"

def check_local():
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return
        
    try:
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        
        print("\n--- LATEST 10 LOCAL ARTICLES ---")
        cur.execute("SELECT title, category, created_at FROM articles ORDER BY created_at DESC LIMIT 10;")
        rows = cur.fetchall()
        for row in rows:
            print(f"Title: {row[0][:50]} | Category: {row[1]} | Created: {row[2]}")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_local()
