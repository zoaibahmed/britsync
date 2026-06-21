
import os
import psycopg2
from dotenv import load_dotenv

# Load environment variables
dotenv_path = r"e:\britsync\brit\news-automation\.env"
load_dotenv(dotenv_path)

db_url = os.getenv("POSTGRES_URL")

def diag():
    if not db_url:
        print("DATABASE_URL not found")
        return
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        print("\n--- SECTION COUNTS ---")
        cur.execute('SELECT section, COUNT(*) FROM "Article" GROUP BY section;')
        for row in cur.fetchall():
            print(f"Section: {row[0]} | Count: {row[1]}")
            
        print("\n--- LATEST AI ARTICLES ---")
        cur.execute('SELECT title FROM "Article" WHERE section = \'AI\' ORDER BY "createdAt" DESC LIMIT 5;')
        for row in cur.fetchall():
            print(f"- {row[0][:60]}...")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    diag()
