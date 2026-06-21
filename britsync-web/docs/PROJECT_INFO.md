# BritSync Project Information

## Project Overview
**Project Name:** BritSync  
**Description:** A full-stack web application for a business website, featuring a public-facing frontend (React-based) for showcasing services, projects, team members, FAQs, and contact forms, plus an admin dashboard for content management. The backend (Node.js/Express) handles API endpoints, database interactions (MongoDB), and file uploads. It's designed for a portfolio/agency site with dynamic sections, animations, and admin CRUD operations.

**Purpose:** To provide a modern, responsive website where visitors can view services, projects, team info, and contact the business, while admins can manage content via a dashboard.

**Key Features:**
- Public pages: Home, About, Services, Work/Projects, Contact.
- Admin dashboard: CRUD for projects, services, team, FAQs, settings, etc.
- File uploads (images for projects/services).
- Email sending via EmailJS.
- Smooth animations (Framer Motion, Lenis).
- Responsive design with custom CSS.
- API-driven content (fetched from MongoDB).

## Tech Stack
- **Frontend:** React 19 (with hooks), Vite (build tool), React Router (routing), Framer Motion (animations), Lucide React (icons), Lenis (smooth scrolling), EmailJS (contact emails).
- **Backend:** Node.js, Express.js, MongoDB (via Mongoose), Multer (secure file uploads), CORS (restricted origins), JWT (authentication), bcryptjs (password hashing), express-validator (input validation), dotenv (env vars).
- **Database:** MongoDB (Atlas recommended for cloud; local for dev).
- **Deployment:** Supports static hosting (e.g., SmarterASP for frontend-only) or full-stack (VPS with PM2/Nginx, or SmarterASP with iisnode).
- **Other:** ESLint (linting), Git (version control).

## Project Structure
Based on the workspace root `c:\Users\NC\Downloads\brit`, here's the full structure (folders/files listed with descriptions):

```
DEPLOYMENT_READY.md          # Deployment notes (likely outdated; use publish.md instead).
generate_tree_md.ps1         # PowerShell script to generate tree structure (MD format).
generate_tree.ps1            # PowerShell script to generate tree structure.
PROJECT_INFO.md              # This file: Complete project documentation.
publish.md                   # Deployment guide for SmarterASP.NET and VPS.
readfoledr.md                # Possibly a typo; maybe "readme" or folder notes.

britsync-server/             # Backend (Node.js API server).
├── index.js                 # Main server file: Express app, routes, middleware, static serving.
├── package.json             # Dependencies: express, mongoose, multer, cors, dotenv; scripts: start, dev, seed.
├── seed.js                  # Script to seed database with initial data.
├── web.config               # IIS config for SmarterASP deployment (added for Windows hosting).
├── .env.example             # Example env file with MONGODB_URI, PORT, NODE_ENV.
├── models/                  # Mongoose schemas for database models.
│   ├── Category.js          # Category model.
│   ├── Client.js            # Client model.
│   ├── CoreValue.js         # Core values model.
│   ├── FAQ.js               # FAQ model.
│   ├── HomeExpertise.js     # Home expertise model.
│   ├── Message.js           # Contact message model.
│   ├── Project.js           # Project model.
│   ├── Section.js           # Dynamic section model.
│   ├── Service.js           # Service model.
│   ├── SiteSetting.js       # Site settings (key-value pairs).
│   ├── Stat.js              # Stats model.
│   ├── TeamMember.js        # Team member model.
│   ├── Tech.js              # Tech stack model.
│   ├── TimelinePhase.js     # Timeline phase model.
│   └── WhyReason.js         # Why choose us reasons model.
└── uploads/                 # Directory for uploaded files (images); served statically.

britsync-web/                # Frontend (React app).
├── eslint.config.js         # ESLint configuration.
├── index.html               # Main HTML entry point.
├── package.json             # Dependencies: react, vite, framer-motion, etc.; scripts: dev, build, lint, preview.
├── README.md                # Frontend README (likely basic).
├── vite.config.js           # Vite configuration.
├── docs/                    # Documentation for frontend.
│   ├── ADMIN_GUIDE.md       # Admin dashboard usage.
│   ├── COMMANDS.md          # Useful commands.
│   └── HOW_TO_ADD_PROJECTS.md # Guide for adding projects.
├── public/                  # Static assets (e.g., favicon, images).
├── src/                     # Source code.
│   ├── App.css              # Global styles.
│   ├── App.jsx              # Main App component (routing).
│   ├── index.css            # Base CSS.
│   ├── main.jsx             # React entry point.
│   ├── assets/              # Static assets (images, fonts).
│   ├── components/          # Reusable UI components.
│   │   ├── about/           # About page components.
│   │   │   ├── TechStack.css/jsx  # Tech stack display.
│   │   │   └── Values.css/jsx     # Core values display.
│   │   ├── admin/           # Admin dashboard components.
│   │   │   ├── AdminItemForm.jsx   # Form for adding/editing items.
│   │   │   ├── AdminSectionList.jsx # List of sections.
│   │   │   ├── AdminSidebar.jsx     # Sidebar navigation.
│   │   │   └── AdminToast.jsx       # Toast notifications.
│   │   ├── home/            # Home page components.
│   │   │   ├── About.css/jsx        # About section.
│   │   │   ├── Clients.css/jsx      # Clients section.
│   │   │   ├── Contact.css/jsx      # Contact section.
│   │   │   ├── DynamicSections.css/jsx # Dynamic sections.
│   │   │   ├── Hero.css/jsx         # Hero banner.
│   │   │   ├── Services.css/jsx     # Services section.
│   │   │   ├── WhyChooseUs.css/jsx  # Why choose us section.
│   │   │   └── Work.css/jsx         # Work/projects section.
│   │   ├── layout/          # Layout components.
│   │   │   ├── Footer.css/jsx       # Footer.
│   │   │   ├── Navbar.css/jsx       # Navigation bar.
│   │   │   ├── PageTransition.jsx   # Page transitions.
│   │   │   └── ScrollToTop.jsx      # Scroll to top button.
│   │   ├── services/        # Services page components.
│   │   │   ├── FAQ.css/jsx          # FAQ section.
│   │   │   ├── Pricing.css/jsx      # Pricing display.
│   │   │   ├── Process.css/jsx      # Process steps.
│   │   │   ├── ServiceCard.jsx      # Service card.
│   │   │   ├── ServiceDetailModal.css/jsx # Modal for service details.
│   │   │   └── ServicePopup.jsx     # Service popup.
│   │   └── ui/              # UI primitives.
│   │       ├── Button.jsx            # Button component.
│   │       ├── CustomCursor.jsx      # Custom cursor.
│   │       ├── ErrorBoundary.jsx     # Error handling.
│   │       └── GlobalBackground.css  # Global background styles.
│   ├── context/             # React contexts.
│   │   └── ThemeContext.jsx # Theme context (if used).
│   ├── hooks/               # Custom React hooks.
│   │   ├── useAboutData.js          # Hook for about data.
│   │   ├── useCategories.js         # Hook for categories.
│   │   ├── useContactPageData.js    # Hook for contact data.
│   │   ├── useHomeData.js           # Hook for home data.
│   │   ├── useLockBodyScroll.js     # Hook to lock body scroll.
│   │   ├── useProjects.js           # Hook for projects.
│   │   ├── useSections.js           # Hook for sections.
│   │   ├── useServices.js           # Hook for services.
│   │   ├── useServicesPageData.js   # Hook for services page data.
│   │   └── useSiteSettings.js       # Hook for site settings.
│   ├── pages/               # Page components.
│   │   ├── About.jsx/css    # About page.
│   │   ├── AdminDashboard.jsx/css # Admin dashboard.
│   │   ├── AdminLogin.jsx    # Admin login.
│   │   ├── Contact.jsx/css   # Contact page.
│   │   ├── Home.jsx/css      # Home page.
│   │   ├── Services.jsx/css  # Services page.
│   │   ├── Spiral.jsx/css    # Spiral page (possibly a demo).
│   │   └── Work.jsx/css      # Work/projects page.
│   └── utils/               # Utilities.
│       └── api.js           # API utility functions.
```

## Key Files and Purposes
- **Frontend Entry:** `britsync-web/src/main.jsx` → Renders React app. `App.jsx` → Defines routes (Home, About, etc.) and layout.
- **Backend Entry:** `britsync-server/index.js` → Sets up Express server, connects to MongoDB, defines API routes (e.g., `/api/projects`, `/api/upload`), serves static files.
- **Models:** Each in `models/` defines MongoDB schemas (e.g., `Project.js` for project data with fields like title, description, images).
- **Hooks:** Custom hooks in `src/hooks/` fetch data from API (e.g., `useProjects.js` calls `/api/projects`).
- **Components:** Modular UI pieces (e.g., `Hero.jsx` for homepage banner).
- **Build Config:** `vite.config.js` for frontend bundling; `package.json` scripts for build/run.

## Build and Run Instructions
- **Frontend (Dev):** `cd britsync-web && npm install && npm run dev` → Starts Vite dev server (http://localhost:5173).
- **Frontend (Build):** `npm run build` → Outputs to `dist/` (static files for production).
- **Backend (Dev):** `cd britsync-server && npm install && npm run dev` → Uses nodemon for auto-restart.
- **Backend (Prod):** `npm start` → Runs `node index.js`.
- **Database:** Requires MongoDB running (local or Atlas). Run `npm run seed` to populate initial data.
- **Full App:** Start backend first (connects DB), then frontend. API calls proxy to backend (configured in Vite or via CORS).

## Environment Variables
- Backend: `.env` with `MONGODB_URI` (MongoDB connection), `PORT` (default 5003), `NODE_ENV`, `JWT_SECRET` (for auth tokens), `ADMIN_PASSWORD` (admin login), `FRONTEND_URL` (for CORS).
- Frontend: No env vars needed; API base URL hardcoded in `utils/api.js` (update for prod).

## Deployment Notes
- **SmarterASP:** See `publish.md` for static frontend or full-stack with `web.config`.
- **VPS:** Use PM2 for Node, Nginx reverse proxy, Certbot for SSL. Build frontend, copy `dist` to server `public/`, start backend.
- **MongoDB:** Use Atlas for cloud; self-host if needed.
- **Security:** JWT authentication for admin routes, CORS restricted to allowed origins, secure file uploads (image types only, 5MB limit), input validation, environment variables for secrets. Never commit `.env`; use HTTPS; rate-limit APIs if needed.

## Additional Notes
- **Linting:** Run `npm run lint` in frontend for code quality.
- **Testing:** No tests defined; add Jest/React Testing Library if needed.
- **Dependencies:** Frontend has ~10 deps (light); backend ~5 (minimal).
- **File Sizes:** Frontend build (~dist/) is small; backend includes models and uploads.
- **Updates:** Recently added JWT auth, secure uploads, input validation, CORS restrictions, `web.config`, `.env.example`, and static serving in `index.js` for deployment.

This file contains everything about the BritSync project, with a focus on the complete structure.