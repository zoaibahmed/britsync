# RSS Feed URLs for different categories
FEEDS = {
    "ai": "https://news.google.com/rss/search?q=Artificial+Intelligence&hl=en-US&gl=US&ceid=US:en",
    "lifestyle": "https://news.google.com/rss/search?q=Lifestyle&hl=en-US&gl=US&ceid=US:en",
    "world": "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en"
}

# User-Agent for requests to avoid being blocked
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

# Map automation categories to database section names
SECTION_MAPPING = {
    "ai": "AI",
    "lifestyle": "LIFESTYLE",
    "world": "WORLD_NEWS"
}

# Limit the number of articles to fetch per category per run
# This prevents the daily run from taking hours when using slow local AI
MAX_ARTICLES_LIMIT = 5
