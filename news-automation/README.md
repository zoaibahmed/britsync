# Free News Automation System

A **fully free, backend-driven** news automation system that runs on a daily schedule and publishes news for [BritSync AI](https://www.britsyncai.com/main) under three categories: **AI**, **Lifestyle**, and **World News**.

## Overview

- **Data source**: Legal RSS feeds (Google News). Only **titles and metadata/summaries** are used—no scraping of full copyrighted articles.
- **Summaries**: Each article gets an **original 120–180 word** summary generated from the RSS snippet (transformative, not copied).
- **Images**: **Copyright-free, non-AI** images from **Unsplash** (primary) and **Pexels** (fallback) via official APIs. Images are **downloaded and stored locally** on the server (never hotlinked).
- **Storage**: SQLite database stores summaries, categories, local image paths, and source URLs. **Previous news is kept** (no deletion).
- **API**: FastAPI backend exposes category endpoints; the website frontend (JavaScript) consumes this API to display daily news. **Styling is handled only on the frontend**; the backend focuses on data, legality, reliability, and automation.

## Compliance

- **No browser scraping**: All automation runs in the backend (RSS + APIs only).
- **No full-article scraping**: Only RSS title and summary are used for generating summaries.
- **Respects robots.txt and API limits**: Polite delays and retries; no full-page scraping.
- **No AI-generated images**: Only real stock photos from Unsplash/Pexels.
- **No external image links**: All images are stored locally; the API returns local paths.

## Tech Stack

- **Python 3.10+**
- **FastAPI** & **Uvicorn** (API)
- **SQLAlchemy** (ORM), **SQLite** (database)
- **Feedparser** (RSS)
- **BeautifulSoup4** (strip HTML from RSS summaries)
- **Google Gemini** (transformative summaries, 120–180 words)
- **Unsplash API** (primary images), **Pexels API** (fallback)
- **Pillow** (image download, resize, WEBP save)
- **schedule** (daily run)

## Setup

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment

Copy `.env.example` to `.env` and set:

- **GEMINI_API_KEY** (required for summaries): [Google AI Studio](https://aistudio.google.com/app/apikey)
- **UNSPLASH_ACCESS_KEY** (optional): [Unsplash Developers](https://unsplash.com/developers)
- **PEXELS_API_KEY** (optional): [Pexels API](https://www.pexels.com/api/)

If image keys are missing, a local fallback image is used.

### 3. Run automation once

```bash
python -m app.scheduler
```

### 4. Run daily automation (e.g. 24-hour schedule)

```bash
python run_daily.py
```

Keep this running for automatic daily updates.

### 5. Start the API server

```bash
uvicorn app.main:app --reload
```

API base: `http://127.0.0.1:8000`

## API Endpoints

- **AI News**: `GET /news/ai`
- **Lifestyle News**: `GET /news/lifestyle`
- **World News**: `GET /news/world`

Responses are JSON lists of articles (title, summary, link, publish_date, category, image_url). `image_url` is a **local path** (e.g. `/public/news-images/2025/02/...webp`) served under `/public`; the frontend should use it as the image `src` from the same origin.

## Project Structure

| Path | Role |
|------|------|
| `app/main.py` | FastAPI app, static mount for `/public`, category endpoints |
| `app/scheduler.py` | Daily automation: fetch RSS → summarize → images → DB |
| `app/scraper.py` | RSS parsing only (no full-article fetch) |
| `app/services/content_rewriter.py` | 120–180 word original summaries (Gemini) |
| `app/services/image_pipeline.py` | Unsplash → Pexels, download & save locally (WEBP) |
| `app/models.py` | Article schema (title, summary, link, publish_date, category, image_url) |
| `app/crud.py` | Create article, check duplicate by link, get by category |
| `app/config.py` | Google News RSS feed URLs per category |
| `news.db` | SQLite database (created automatically) |
| `public/news-images/` | Local image storage (never hotlinked) |
