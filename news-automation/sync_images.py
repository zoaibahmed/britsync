import os
import psycopg2
from app.services.image_pipeline import ImagePipeline
from dotenv import load_dotenv

# Load environment
load_dotenv()

def sync_missing_images():
    db_url = os.getenv("POSTGRES_URL")
    if not db_url:
        print("Error: POSTGRES_URL not found.")
        return

    pipeline = ImagePipeline()
    print(f"Checking for missing images in: {pipeline.image_dir}")

    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        # Get recent articles with thumbnails
        cur.execute("SELECT title, section, thumbnail FROM \"Article\" WHERE thumbnail LIKE '/news-images/%' ORDER BY \"createdAt\" DESC LIMIT 50")
        articles = cur.fetchall()
        
        fixed_count = 0
        for title, section, thumbnail in articles:
            # Convert web path to local path
            # thumbnail is /news-images/2026/04/name.webp
            # we need to check if it exists in pipeline.image_dir/2026/04/name.webp
            
            parts = thumbnail.strip('/').split('/')
            if len(parts) < 4: continue
            
            # parts: ['news-images', '2026', '04', 'name.webp']
            local_rel_path = os.path.join(*parts[1:]) # '2026', '04', 'name.webp'
            abs_path = os.path.join(pipeline.image_dir, local_rel_path)
            
            if not os.path.exists(abs_path):
                print(f"Missing: {thumbnail}")
                print(f"  Attempting to regenerate for: {title[:50]}...")
                # process_news will download and save it to the correct path
                pipeline.process_news(title, section)
                fixed_count += 1
            else:
                # print(f"Exists: {thumbnail}")
                pass
                
        print(f"\nDone! Regenerated {fixed_count} missing images.")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    sync_missing_images()
