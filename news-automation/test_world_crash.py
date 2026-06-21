
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import scraper, scheduler
from app.database import SessionLocal

def test_world():
    print("Testing World News specifically...")
    db = SessionLocal()
    try:
        # Just fetch, don't publish yet to isolate scraper logic
        articles = scraper.fetch_rss_news("world")
        print(f"SUCCESS: Fetched {len(articles)} world articles.")
        for a in articles:
            print(f" - {a['title'][:50]}")
    except Exception as e:
        print(f"CRASH in scraper: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_world()
