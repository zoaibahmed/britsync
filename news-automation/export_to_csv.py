import sqlite3
import csv
import os

def export_to_csv():
    db_path = 'news.db'
    output_file = 'extracted_news.csv'
    
    if not os.path.exists(db_path):
        print(f"Database not found. Run the scheduler first.")
        return

    try:
        print(f"📂 Connecting to database at: {os.path.abspath(db_path)}", flush=True)
        # Connect to the database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Fetch all articles
        cursor.execute("SELECT category, title, link, publish_date, summary, image_url FROM articles ORDER BY publish_date DESC")
        rows = cursor.fetchall()
        
        if not rows:
            print("⚠️  No data found in the database. The export file will be empty.")
            print("   Please ensure the scraper has run successfully.")
            conn.close()
            return

        # Get column names
        column_names = [description[0] for description in cursor.description]
        
        # Write to CSV
        abs_output_path = os.path.abspath(output_file)
        # Use utf-8-sig for Excel compatibility
        with open(output_file, 'w', newline='', encoding='utf-8-sig') as f:
            writer = csv.writer(f)
            writer.writerow(column_names) # Write header
            writer.writerows(rows)
            
        print(f"✅ Successfully exported {len(rows)} articles to:\n   {abs_output_path}")
        
        conn.close()
    except PermissionError:
        print(f"File in use. Close {output_file} and try again.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("🚀 Starting export script...", flush=True)
    export_to_csv()
