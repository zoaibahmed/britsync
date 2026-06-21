
import os
import psycopg2
from dotenv import load_dotenv

# Try different connection strings
project_ref = "cnbzxaqkhdznauooakjj"
password = "Admin1saG00dB0y"
user = f"postgres.{project_ref}"
dbname = "postgres"

test_hosts = [
    f"db.{project_ref}.supabase.co",
    "aws-1-ap-south-1.pooler.supabase.com"
]

test_ports = [5432, 6543]

def test_connection():
    for host in test_hosts:
        for port in test_ports:
            print(f"Testing {host}:{port}...")
            try:
                conn = psycopg2.connect(
                    host=host,
                    database=dbname,
                    user=user,
                    password=password,
                    port=port,
                    connect_timeout=5
                )
                print(f"  SUCCESS: Connected to {host}:{port}!")
                conn.close()
            except Exception as e:
                print(f"  FAILED: {e}")

if __name__ == "__main__":
    test_connection()
