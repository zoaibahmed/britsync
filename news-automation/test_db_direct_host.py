
import os
import psycopg2
from dotenv import load_dotenv

# Try direct host
project_ref = "cnbzxaqkhdznauooakjj"
direct_host = f"db.{project_ref}.supabase.co"
password = "Admin1saG00dB0y"
user = "postgres"
dbname = "postgres"

def test_direct():
    print(f"Testing direct connection to {direct_host}...")
    try:
        conn = psycopg2.connect(
            host=direct_host,
            database=dbname,
            user=user,
            password=password,
            port=5432
        )
        cur = conn.cursor()
        cur.execute("SELECT 1")
        print("SUCCESS: Direct connection established!")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    test_direct()
