
import os
import psycopg2
from dotenv import load_dotenv

# Load environment variables
dotenv_path = r"e:\britsync\brit\news-automation\.env"
load_dotenv(dotenv_path)

db_url = os.getenv("POSTGRES_URL")

def check_recent():
    if not db_url:
        print("DATABASE_URL not found")
        return
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        print("\n--- SINGLE RAW ARTICLE ---")
        cur.execute('SELECT * FROM "Article" LIMIT 1;')
        row = cur.fetchone()
        if row:
            colnames = [desc[0] for desc in cur.description]
            for i, val in enumerate(row):
                print(f"{colnames[i]}: {val}")
        else:
            print("No articles found at all!")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_recent()
