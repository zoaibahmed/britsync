# BritSync Web Experience - Technical Specification

This document serves as the **master specification** for the BritSync agency portfolio platform. It details the architecture, data models, and integration points for developers (AI or human) to build the backend.

---

## 1. Project Overview
**BritSync** is a high-performance digital agency portfolio built with **React 19, Vite, and Framer Motion**.
It features a premium "Dark Mode" aesthetic (luxury/cyberpunk fusion), complex animations, and interactive data-driven components.

### Tech Stack
-   **Frontend:** React 19, Vite, React Router v6
-   **Styling:** Native CSS Variables (No Tailwind), Glassmorphism, Responsive Grid
-   **Animation:** Framer Motion (Scroll triggers, page transitions, hover effects)
-   **State Management:** React Context + Custom Hooks (`useProjects`, `useHomeData`, etc.)
-   **Email:** EmailJS (Client-side sending)

---

## 2. Site Architecture & Pages

### **1. Home Page (`/`)**
*   **Hero Section:** Large typographic animation ("Crafting Digital Realities") with magnetic buttons.
*   **Ticker:** Infinite scrolling text ("AI Integration", "Digital Strategy").
*   **Expertise Grid:** 3 Cards (Development, Design, Marketing) with hover-3D effects.
*   **Why Choose Us:** Statistical breakdown and value props.
*   **Featured Work:** A selected subset of the "Projects" data.

### **2. Services Page (`/services`)**
*   **Main Services:** 3 Core Cards (Web/App, Automation, Social Media) that link to Work filters.
*   **Secondary Services:** innovative "Sticky Stacking" list for other services (SEO, Cloud, etc.) visible on click.
*   **Process Timeline:** Vertical interactive timeline ("How We Deliver") with hover-reveal details.
*   **Pricing & FAQ:** Informational sections with accordions.

### **3. Work Page (`/work`)**
*   **Project Gallery:** complete grid of portfolio items.
*   **Filtering:** Filter by category (Web, App, Automation, Design).
*   **Project Detail:** Modal/Page showing detailed case studies (Challenge, Solution, Tech Stack).

### **4. About Page (`/about`)**
*   **Mission & Values:** Text-heavy section with icon grids.
*   **Team Section:** Grid of team member profiles.
*   **Tech Stack:** Grid of technologies used.

### **5. Contact Page (`/contact`)**
*   **Form:** Name, Email, Message inputs.
*   **Map:** Abstract animated map visualization.

---

## 3. Data Models & Schemas (Backend Specification)

If you are building a backend (Supabase, MongoDB, Firebase), **USE EXACTLY THESE FIELD NAMES**.

### **A. Projects Collection (`projects`)**
*Used in: Work Page, Home Featured Section*

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String/ObjectId | Unique Identifier |
| `title` | String | Project Name (e.g., "Luxury Estate") |
| `category` | String | Filter Key (e.g., "web", "app", "automation") |
| `image` | String (URL) | Main cover image |
| `description` | String | Short summary for cards |
| `challenge` | String | "The Problem" text for detail view |
| `solution` | String | "Our Solution" text for detail view |
| `client` | String | Client Name |
| `duration` | String | e.g., "4 Months" |
| `technologies` | Array[String] | e.g., `["React", "Node.js"]` |
| `stats` | Object | `{ label: "Growth", value: "+150%" }` |
| `featured` | Boolean | If true, show on Home Page |

### **B. Services Collection (`services`)**
*Used in: Services Page (Secondary List)*

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String/ObjectId | Unique Identifier |
| `title` | String | Service Name (e.g., "SEO Optimization") |
| `icon` | String | Icon Name (mapped to Lucide icons on frontend) |
| `description` | String | Short description |
| `features` | Array[String] | Bullet points of what is included |
| `is_primary` | Boolean | true = Main Card, false = Secondary List |

### **C. Testimonials Collection (`reviews`)**
*Used in: Home Page Trust Section*

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String/ObjectId | Unique Identifier |
| `name` | String | Client Name (e.g., "Sarah Connor") |
| `role` | String | Job Title (e.g., "CMO, TechGlobal") |
| `quote` | String | The testimonial text |
| `avatar` | String (URL) | Optional user image |

### **D. Messages Collection (`messages`)**
*Used in: Contact Form (Incoming)*

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String/ObjectId | Unique Identifier |
| `name` | String | Sender Name |
| `email` | String | Sender Email |
| `message` | String | The message body |
| `created_at` | Date | Timestamp |
| `status` | String | "read" or "unread" |

---

## 4. MongoDB Integration Guide (For AI Prompts)

If moving to MongoDB, use the MERN stack approach.

**Step 1: Create Schemas (Mongoose)**
Use the schemas defined in Section 3 above. Ensure `timestamps: true` is enabled for all models.

**Step 2: API Endpoints**
Create a Node/Express server with these routes:

*   `GET /api/projects` - specific query param `?category=` for filtering.
*   `GET /api/services` - returns all services.
*   `POST /api/messages` - for the Contact form submission.
*   `GET /api/content/home` - returns dynamic text implementation (Hero title, etc.).

**Step 3: Frontend Integration**
Replace the local hooks (e.g., `src/hooks/useProjects.js`) with API calls:

```javascript
// Example Replacement for useProjects.js
useEffect(() => {
  axios.get('https://your-api.com/api/projects')
    .then(res => setProjects(res.data))
    .catch(err => console.error(err));
}, []);
```

---

## 5. Development Instructions

1.  **Run Locally:** `npm run dev`
2.  **Build for Production:** `npm run build`
3.  **Lint Code:** `npm run lint`

*Maintain the "Premium Dark Mode" aesthetic in all future components. Use `var(--color-blue)` for accents and `var(--bg-card)` for containers.*
