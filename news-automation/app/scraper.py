import time
from datetime import datetime
import feedparser
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from bs4 import BeautifulSoup
from dateutil import parser
import re
from .config import FEEDS, MAX_ARTICLES_LIMIT, HEADERS
from .services.image_pipeline import ImagePipeline
from .services.content_rewriter import ContentRewriter

# Initialize services
image_pipeline = ImagePipeline()
content_rewriter = ContentRewriter()


def strip_html(text):
    """Removes HTML tags from text (e.g. RSS summary)."""
    if not text:
        return ""
    soup = BeautifulSoup(text, "html.parser")
    return soup.get_text(separator=" ", strip=True)

def remove_emojis(text: str) -> str:
    """
    Removes emoji characters to enforce plain professional text.
    This is a best-effort filter (covers common emoji ranges).
    """
    if not text:
        return ""
    emoji_pattern = re.compile(
        "["
        "\U0001F300-\U0001F5FF"  # symbols & pictographs
        "\U0001F600-\U0001F64F"  # emoticons
        "\U0001F680-\U0001F6FF"  # transport & map symbols
        "\U0001F700-\U0001F77F"  # alchemical symbols
        "\U0001F780-\U0001F7FF"  # geometric shapes extended
        "\U0001F800-\U0001F8FF"  # supplemental arrows-c
        "\U0001F900-\U0001F9FF"  # supplemental symbols & pictographs
        "\U0001FA00-\U0001FAFF"  # symbols & pictographs extended-a
        "\U00002600-\U000026FF"  # misc symbols
        "\U00002700-\U000027BF"  # dingbats
        "]+",
        flags=re.UNICODE,
    )
    text = emoji_pattern.sub("", text)
    # Remove variation selectors / emoji modifiers leftovers
    text = re.sub(r"[\uFE0E\uFE0F\u200D]", "", text)
    return text.strip()

def fetch_feed_with_retry(url):
    """Fetches feed content with retries and timeout."""
    session = requests.Session()
    retries = Retry(total=3, backoff_factor=1, status_forcelist=[500, 502, 503, 504])
    adapter = HTTPAdapter(max_retries=retries)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    
    try:
        response = session.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()
        return response.content
    except Exception as e:
        print(f"[ERROR] Failed to fetch feed {url}: {e}")
        return None

def fetch_rss_news(category):
    """
    Fetches news from the RSS feed for a specific category.
    Uses only RSS data (titles and metadata/summaries)—no full-article scraping.
    """
    feed_url = FEEDS.get(category)
    if not feed_url:
        return []

    # Use robust fetching
    xml_content = fetch_feed_with_retry(feed_url)
    if not xml_content:
        return []

    feed = feedparser.parse(xml_content)
    articles = []

    # Limit processing to the latest articles to save time (default 5)
    entries_to_process = feed.entries[:MAX_ARTICLES_LIMIT]
    print(f"  Processing latest {len(entries_to_process)} articles from {category}...")

    for i, entry in enumerate(entries_to_process):
        clean_title = remove_emojis(entry.title)
        print(f"  [{i+1}/{len(entries_to_process)}] Processing: {clean_title[:50]}...")
        
        # 1. Image Pipeline
        print(f"    - Fetching image...", end="", flush=True)
        image_path = image_pipeline.process_news(clean_title, category)
        print(" Done.")

        # 2. Content Preparation
        raw_summary = entry.get("summary") or entry.get("description", "")
        clean_content = strip_html(raw_summary)

        # 3. AI Transformation
        print(f"    - Generating AI summary...", end="", flush=True)
        final_summary = content_rewriter.rewrite_summary(clean_title, clean_content)
        
        if not final_summary:
             print(" Failed.")
             # Fallback to original content if AI fails, to avoid skipping everything 429
             if clean_content and len(clean_content.split()) > 5:
                 print(f"    - [FALLBACK] Using original RSS content.")
                 final_summary = clean_content
             else:
                 print(f"    - [FALLBACK] Content too short, using title as summary.")
                 final_summary = clean_title
        else:
             print(" Success.")
        
        # QUALITY CHECK: Enforce higher threshold to ensure professional layout
        if not final_summary or len(final_summary.split()) < 50:
            print(f"    - [REJECT] Content too short for '{clean_title[:30]}...' ({len(final_summary.split()) if final_summary else 0} words). Waiting for AI Quota to reset.")
            continue

        final_summary = remove_emojis(final_summary)

        published_str = getattr(entry, "published", None) or getattr(entry, "updated", None)
        if published_str:
            try:
                publish_date = parser.parse(published_str)
            except Exception:
                publish_date = datetime.now()
        else:
            publish_date = datetime.now()

        article = {
            "title": clean_title,
            "summary": final_summary,
            "link": entry.link,
            "publish_date": publish_date,
            "category": category,
            "image_url": image_path,
        }
        articles.append(article)
        time.sleep(1)

    return articles
