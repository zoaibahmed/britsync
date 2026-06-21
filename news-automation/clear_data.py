import sqlite3
import os
import csv
import psycopg2
from dotenv import load_dotenv

# Load .env
load_dotenv()

def clear_news_data():
    db_path = 'news.db'
    csv_path = 'extracted_news.csv'
    postgres_url = os.getenv("POSTGRES_URL")
    
    print("Cleaning up...")

    # 1. Clear Local SQLite Database
    if os.path.exists(db_path):
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='articles'")
            if cursor.fetchone():
                cursor.execute("DELETE FROM articles")
                conn.commit()
                print(f"  Local Database cleared.")
            conn.close()
        except Exception as e:
            print(f"  Local Database error: {e}")

    # 2. Clear Remote Supabase Database
    if postgres_url:
        try:
            print("  Connecting to Supabase...")
            conn = psycopg2.connect(postgres_url)
            with conn.cursor() as cur:
                cur.execute("DELETE FROM \"Article\"")
                print(f"  Supabase 'Article' table cleared.")
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"  Supabase error: {e}")
    else:
        print("  Remote DB URL not found, skipping remote clear.")

    # 3. Clear CSV
    if os.path.exists(csv_path):
        try:
            header = ["category", "title", "link", "publish_date", "summary", "image_url"]
            with open(csv_path, 'w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow(header)
            print(f"  CSV cleared.")
        except Exception as e:
            print(f"  CSV error: {e}")

    # 4. Clear Images
    # We clear both local public and the website's public news-images
    image_dirs = [
        os.path.join("public", "news-images"),
        os.getenv("IMAGE_OUTPUT_DIR")
    ]
    
    for image_dir in image_dirs:
        if image_dir and os.path.exists(image_dir):
            try:
                removed_count = 0
                for root, dirs, files in os.walk(image_dir, topdown=False):
                    for name in files:
                        if name != "fallback.webp":
                            file_path = os.path.join(root, name)
                            os.remove(file_path)
                            removed_count += 1
                    for name in dirs:
                        dir_path = os.path.join(root, name)
                        try:
                            os.rmdir(dir_path)
                        except OSError:
                            pass
                print(f"  {removed_count} images deleted from {image_dir}.")
            except Exception as e:
                print(f"  Images error in {image_dir}: {e}")

    print("Done.")

if __name__ == "__main__":
    clear_news_data()
