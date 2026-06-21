
import os
import psycopg2
from dotenv import load_dotenv

# Load environment variables
dotenv_path = r"e:\britsync\brit\news-automation\.env"
load_dotenv(dotenv_path)

db_url = os.getenv("POSTGRES_URL")

def cleanup():
    if not db_url:
        print("DATABASE_URL not found")
        return
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        # Delete articles with very short content (likely failed rewrites)
        cur.execute('DELETE FROM "Article" WHERE LENGTH(content) < 200;')
        count = cur.rowcount
        conn.commit()
        
        print(f"--- CLEANUP COMPLETE ---")
        print(f"Deleted {count} low-quality (short) articles.")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error during cleanup: {e}")

if __name__ == "__main__":
    cleanup()
