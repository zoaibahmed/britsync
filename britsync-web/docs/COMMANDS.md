# Project Commands Guide

This file serves as a reference for all commands needed to run, manage, and debug the BritSync project.

## 🚀 Quick Start (Development)

To run the project, you need to start **both** the backend and frontend servers. It is recommended to use two separate terminal windows.

### 1. Start Backend Server
The backend runs on port `5003` and connects to MongoDB.
```bash
cd server
npm run dev
```

### 2. Start Frontend Server
The frontend runs on port `5173`.
```bash
# In the root directory
npm run dev
```

---

## 🗄️ Database Management

### Seed Database
Populate the database with initial sample data (Services, Projects, etc.).
```bash
cd server
npm run seed
```
*Note: Run this if your website content appears empty.*

---

## 🔗 API Endpoints

Base URL: `http://localhost:5003/api`

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Add a new service
- `PUT /api/services/:id` - Update a service
- `DELETE /api/services/:id` - Delete a service

### Projects
- `GET /api/projects` - Get all projects (supports `?category=WEB` filter)
- `POST /api/projects` - Add a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Site Settings
- `GET /api/settings` - Get site-wide settings
- `POST /api/settings` - Update a specific setting (`{ key, value }`)

### Content Sections
- `GET /api/stats`
- `GET /api/expertise`
- `GET /api/why-reasons`

---

## 🛠️ Troubleshooting

- **Frontend can't connect to Backend**: Ensure backend is running on port 5003. Check `vite.config.js` proxy settings.
- **MongoDB Connection Error**: Ensure MongoDB is running locally (`mongod`).
- **Empty Content**: Run the seed command to populate the database.
