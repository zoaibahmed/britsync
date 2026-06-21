
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
        
        print("\n--- ARTICLE CONTENT ANALYSIS ---")
        cur.execute('SELECT section, title, LENGTH(content) as content_len FROM "Article" ORDER BY "createdAt" DESC LIMIT 15;')
        rows = cur.fetchall()
        for row in rows:
            print(f"[{row[0]}] {row[1][:40]}... | Length: {row[2]} chars")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    diag()
