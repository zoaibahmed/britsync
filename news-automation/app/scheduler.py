import sys
import os
# Add the project directory to the python path so we can import 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import scraper, crud, database, models
from app.database import SessionLocal, engine
from app.config import FEEDS
from app.services.publisher import Publisher

def run_automation():
    print("Starting news automation...")
    db = SessionLocal()
    publisher = Publisher()

    models.Base.metadata.create_all(bind=engine)

    for category in FEEDS.keys():
        articles = scraper.fetch_rss_news(category)
        new_count = 0
        for article_data in articles:
            if not crud.article_exists(db, article_data["link"]):
                # Save to local DB
                crud.create_article(db, article_data)
                
                # Publish to website DB (Supabase)
                print(f"    - Syncing to Website...", end="", flush=True)
                success = publisher.publish(article_data)
                if success:
                    print(" Success.")
                else:
                    print(" Failed (see error above).")
                
                new_count += 1
        print(f"  {category}: {len(articles)} fetched, {new_count} new and synced")

    db.close()
    print("Done.")

if __name__ == "__main__":
    run_automation()
