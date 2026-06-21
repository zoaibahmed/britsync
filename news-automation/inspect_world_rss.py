
import feedparser
import requests

url = "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

print(f"Fetching {url}")
response = requests.get(url, headers=headers, timeout=15)
feed = feedparser.parse(response.content)

if len(feed.entries) > 0:
    entry = feed.entries[0]
    print("\n--- FIRST ENTRY FIELDS ---")
    for key in entry.keys():
        print(f"{key}: {entry[key][:50] if isinstance(entry[key], str) else entry[key]}")
else:
    print("No entries found.")
