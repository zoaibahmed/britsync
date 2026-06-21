import os
import psycopg2
import re
from datetime import datetime
from app.config import SECTION_MAPPING

class Publisher:
    def __init__(self):
        self.db_url = os.getenv("POSTGRES_URL")
        if not self.db_url:
            print("[WARNING] POSTGRES_URL not found in environment. Publishing disabled.")
            self.enabled = False
        else:
            self.enabled = True
            # Print masked host for verification
            host_match = re.search(r'@([^:/]+)', self.db_url)
            if host_match:
                print(f"[DEBUG] Publisher using host: {host_match.group(1)}")

    def _get_connection(self):
        return psycopg2.connect(self.db_url)

    def _generate_slug(self, title):
        # Basic slugify
        slug = re.sub(r'[^a-zA-Z0-9]', '-', title.lower()).strip('-')
        # Ensure it's not too long for the database
        if len(slug) > 100:
            slug = slug[:100].rstrip('-')
        # Add a unique suffix to avoid collisions if necessary (simplified for now)
        return slug

    def article_exists(self, cursor, title):
        """Checks if an article with the same title already exists in the website DB."""
        cursor.execute("SELECT id FROM \"Article\" WHERE title = %s", (title,))
        return cursor.fetchone() is not None

    def publish(self, article_data):
        if not self.enabled:
            return False

        category = article_data.get("category")
        section = SECTION_MAPPING.get(category, "WORLD_NEWS")
        
        title = article_data.get("title")
        summary = article_data.get("summary")
        # Ensure the summary matches the 'content' field requirements (HTML/JSON)
        # For now, we'll wrap it in basic HTML paragraphs
        content = f"<p>{summary}</p>"
        
        slug = self._generate_slug(title)
        thumbnail = article_data.get("image_url")
        
        conn = None
        try:
            conn = self._get_connection()
            with conn.cursor() as cur:
                # Check for duplicates by title
                if self.article_exists(cur, title):
                    print(f"  [SKIP] Article '{title[:40]}...' already exists on website.")
                    return False

                # Handle slug collisions (simple retry with timestamp)
                cur.execute("SELECT id FROM \"Article\" WHERE slug = %s", (slug,))
                if cur.fetchone():
                    slug = f"{slug}-{int(datetime.now().timestamp())}"

                insert_query = """
                    INSERT INTO "Article" (id, title, slug, content, section, thumbnail, "createdAt", "updatedAt")
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """
                
                # generate a cuid-like ID (simple random string or just let DB handle if it was serial, 
                # but Prisma uses cuid/uuid usually. Since we can't easily generate cuid in python without lib, 
                # we'll use a prefix + timestamp)
                article_id = f"cl-{int(datetime.now().timestamp())}-{os.urandom(4).hex()}"
                
                now = datetime.now()
                
                cur.execute(insert_query, (
                    article_id,
                    title,
                    slug,
                    content,
                    section,
                    thumbnail,
                    now,
                    now
                ))
                
            conn.commit()
            print(f"  [SUCCESS] Published to website: {title[:40]}...")
            return True
        except Exception as e:
            print(f"  [ERROR] Failed to publish to website: {e}")
            if conn:
                conn.rollback()
            return False
        finally:
            if conn:
                conn.close()
