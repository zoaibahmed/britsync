# Admin Dashboard - Quick Start Guide

## 🔐 How to Access the Admin Panel

### Step 1: Navigate to Admin URL

Simply visit the admin page in your browser:

```
http://localhost:5173/admin
```

Or on your deployed VPS:

```
https://yourwebsite.com/admin
```

### Step 2: First Time Setup

**On your first visit**, you'll be asked to create a password:

1. Enter a password (minimum 6 characters)
2. Confirm the password
3. Click "Setup & Continue"

> ⚠️ **IMPORTANT**: Remember this password! It's stored in your browser's localStorage. If you forget it, you'll need to clear your browser data to reset.

### Step 3: Login

**On subsequent visits**, simply enter your password to access the dashboard.

## 📝 Adding a New Project

Once logged in to the dashboard:

1. Click the **"Add New Project"** button
2. Fill in all the required fields:
   - **Project Title**: Name of your project
   - **Category**: Choose Web, App, or Design
   - **Image URL**: Link to project image or `/projects/image.jpg`
   - **Live Project URL**: (Optional) Link to the live project
   - **Description**: Brief overview
   - **Challenge**: What problem did it solve?
   - **Solution**: How did you solve it?
   - **Client**: Client name
   - **Duration**: How long it took (e.g., "4 Months")
   - **Technologies**: Comma-separated list (e.g., "React, Node.js, AWS")
   - **Stats Label**: Metric name (e.g., "User Engagement")
   - **Stats Value**: Metric value (e.g., "+150%")

3. Click **"Add Project"**
4. Your project will immediately appear on the `/work` page!

## ✏️ Editing a Project

1. Find the project in the dashboard
2. Click the **Edit** button (pencil icon)
3. Modify any fields
4. Click **"Update Project"**

## 🗑️ Deleting a Project

1. Find the project in the dashboard
2. Click the **Delete** button (trash icon)
3. Confirm the deletion

## 🖼️ Adding Your Own Images

### Option 1: Use External URLs
Use image URLs from Unsplash, Imgur, or any image hosting service:
```
https://images.unsplash.com/photo-xxxxx
```

### Option 2: Upload to Your Project
1. Place images in `public/projects/` folder
2. Reference them as: `/projects/your-image.jpg`
3. When deploying, make sure to upload the images to your VPS

## 🔒 Security Notes

- **Server-side Password**: Admin password is stored **hashed** in the database (SiteSetting key `admin_password`) when changed via the admin UI. If the key is missing, the server falls back to `ADMIN_PASSWORD` in the server `.env`.
- **Session**: The front-end stores a short-lived JWT token in `localStorage` to authenticate admin API requests.
- **Reset / Recovery**: If you lose access, you can either update/remove the `admin_password` document in the database (using your MongoDB client) to revert to the env password, or update `ADMIN_PASSWORD` in `.env` and restart the server.

## 🚀 How to Change Admin Password (new)

1. Open the Admin panel and click **Change Password** in the sidebar
2. Enter your **current password**, **new password**, and **confirm**
3. Click **Change Password** — the new password is saved hashed on the server

> **Note:** The old method (deleting a key in browser localStorage) was used in earlier versions — it is no longer the recommended way for changing the server-side password.

## 💡 Pro Tips

1. **Test Locally First**: Add projects on `localhost` before deploying
2. **Backup Data**: Export your projects by copying localStorage data
3. **Image Optimization**: Keep images under 500KB for fast loading
4. **Consistent Formatting**: Use similar formats for all projects

## 📱 Mobile Access

The admin dashboard is fully responsive! You can add/edit projects from your phone or tablet.

## 🔄 Data Persistence

- Projects are stored in browser **localStorage**
- Data persists across page refreshes
- Clearing browser data will reset everything
- For production, consider upgrading to a backend database (Firebase, Supabase)

## 🆘 Troubleshooting

### Can't Access Admin Panel
- Make sure you're visiting `/admin` not `/admin/dashboard`
- Clear browser cache and try again

### Projects Not Showing
- Check browser console for errors (F12)
- Verify localStorage has data: `localStorage.getItem('britsync_projects')`

### Forgot Password
- Clear localStorage: F12 → Application → Local Storage → Clear
- Refresh and set a new password

---

**Admin Panel URL**: `/admin`  
**Dashboard URL**: `/admin/dashboard` (requires login)
