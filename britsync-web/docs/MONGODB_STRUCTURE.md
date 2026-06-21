# MongoDB Structure & Setup Guide

Here is exactly what collections (tables) you need to add to your MongoDB database for the **BritSync** project, and step-by-step instructions on how to do it.

## 1. The Collections

You need **3 Main Collections**.

### Collection 1: `services`
This stores both your "Main 3 Cards" and the "Secondary Services".

**Fields:**
*   `title` (String): e.g., "Web & App Development"
*   `type` (String): "main" or "secondary"
*   `icon` (String): Icon name (e.g., "Code")
*   `description` (String): Short text for the card.
*   `filter_slug` (String): *Main cards only* - e.g., "web" (redirects to /work?filter=web)
*   `features` (Array): *Secondary cards only* - List of bullet points.

### Collection 2: `projects`
This stores all your portfolio items for the Work Page.

**Fields:**
*   `title` (String): e.g., "Luxury Estate"
*   `category` (String): "web", "app", "automation", "design"
*   `image` (String): URL to the cover image.
*   `description` (String): Short summary.
*   `challenge` (String): The "Challenge" text for the popup.
*   `solution` (String): The "Solution" text for the popup.
*   `client` (String): Client name.
*   `technologies` (Array): e.g., `["React", "Node"]`
*   `stats` (Object): e.g., `{ "label": "Growth", "value": "150%" }`

### Collection 3: `messages`
Stores submissions from the Contact Form.

**Fields:**
*   `name` (String)
*   `email` (String)
*   `message` (String)
*   `createdAt` (Date)

---

## 2. How to Add Them (Step-by-Step)

You have two options. **Option B is recommended** because I will write the code to do it for you automatically.

### Option A: Manual (Using MongoDB Compass)
1.  Open **MongoDB Compass**.
2.  Click **Connect** (using your local URL: `mongodb://localhost:27017`).
3.  Click the **+** button next to "Databases" (or "Create Database").
4.  **Database Name:** `britsync`
5.  **Collection Name:** `services`
6.  Click **Create Database**.
7.  Now, inside `britsync`, click **Create Collection** to add the others:
    *   Add `projects`
    *   Add `messages`
8.  To add data, click a collection > **Add Data** > **Insert Document**.

### Option B: Automatic (The "Seed" Script) - RECOMMENDED
I will create a script file (`server/seed.js`) in your project.
1.  You will simply run: `node server/seed.js`
2.  This script will **automatically create the database**, **create the collections**, and **fill them** with the data currently on your website.
3.  You don't need to type anything manually.

**I recommend we proceed with Option B.** It ensures no spelling mistakes and copies your current website data perfectly.
