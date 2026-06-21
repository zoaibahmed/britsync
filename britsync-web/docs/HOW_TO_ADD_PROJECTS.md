cmd /c "npm run dev"
# How to Add New Projects to Your Portfolio

This guide explains how to add, edit, or remove projects from your portfolio after deploying to a VPS.

## 📍 Where Projects Are Stored

All portfolio projects are defined in a single file:
```
src/pages/Work.jsx
```

## 🎯 Project Structure

Each project is an object with the following properties:

```javascript
{
    id: 1,                    // Unique number for each project
    title: 'Project Name',    // Display name
    category: 'web',          // Category: 'web', 'app', or 'design'
    image: 'https://...',     // Project thumbnail image URL
    description: 'Brief description of the project',
    challenge: 'What problem did this project solve?',
    solution: 'How did you solve it?',
    client: 'Client Name',
    duration: '4 Months',     // How long it took
    technologies: ['React', 'Node.js', 'AWS'],  // Tech stack array
    stats: { 
        label: 'User Engagement',  // Metric name
        value: '+150%'             // Metric value
    }
}
```

## ✅ Step-by-Step: Adding a New Project

### 1. Access Your VPS
```bash
ssh your-username@your-vps-ip
cd /path/to/britsync-web
```

### 2. Open the Projects File
```bash
nano src/pages/Work.jsx
# or use vim, vi, or any text editor you prefer
```

### 3. Find the `projects` Array
Look for this section (around line 10):
```javascript
export const projects = [
    {
        id: 1,
        title: 'Luxury Estate',
        // ... existing projects
    },
    // Add your new project here
];
```

### 4. Add Your New Project
Add a comma after the last project, then add your new project:

```javascript
export const projects = [
    // ... existing projects ...
    {
        id: 7,  // IMPORTANT: Use the next available number
        title: 'Your New Project',
        category: 'web',  // Choose: 'web', 'app', or 'design'
        image: 'https://images.unsplash.com/photo-xxxxx',
        description: 'What your project does',
        challenge: 'The problem you solved',
        solution: 'How you solved it',
        client: 'Client Name',
        duration: '3 Months',
        technologies: ['React', 'TypeScript', 'Firebase'],
        stats: { 
            label: 'Performance', 
            value: '+200%' 
        }
    }
];
```

### 5. Save and Rebuild
```bash
# Save the file (Ctrl+X, then Y, then Enter in nano)

# Rebuild the project
npm run build

# Restart your web server (example for PM2)
pm2 restart britsync-web
```

## 🖼️ Using Your Own Project Images

### Step 1: Prepare Your Images
1. **Optimize your images first**:
   - Recommended size: 800x600px or 1200x800px
   - Format: JPG or WebP (WebP is smaller and faster)
   - File size: Keep under 500KB for fast loading
   - Use tools like [TinyPNG](https://tinypng.com) or [Squoosh](https://squoosh.app) to compress

### Step 2: Upload Images to Your Project

**Option A: Using the `public` folder (Recommended)**

1. Create a folder for project images:
   ```bash
   mkdir -p public/projects
   ```

2. Upload your images to this folder:
   ```bash
   # On your local computer, copy images to:
   britsync-web/public/projects/my-project-image.jpg
   ```

3. In `Work.jsx`, reference the image:
   ```javascript
   {
       id: 7,
       title: 'My Project',
       image: '/projects/my-project-image.jpg',  // ← Use this path
       // ... rest of project
   }
   ```

**Option B: Using Unsplash (Free Stock Photos)**
1. Go to [unsplash.com](https://unsplash.com)
2. Search for relevant images
3. Right-click on an image → "Copy image address"
4. Use the URL in your project's `image` field

### Step 3: Deploy Images to VPS

When deploying to your VPS:

```bash
# Method 1: Using SCP (from your local computer)
scp public/projects/*.jpg your-username@your-vps-ip:/path/to/britsync-web/public/projects/

# Method 2: Using Git (if using version control)
git add public/projects/
git commit -m "Add project images"
git push origin main

# Then on VPS:
git pull origin main
npm run build
pm2 restart britsync-web
```

## 🔗 Adding Live Project Links

Currently, the "View Live Project" button doesn't go anywhere. Here's how to make it functional:

### Step 1: Add URL to Project Object

Update your project structure to include a `liveUrl` field:

```javascript
export const projects = [
    {
        id: 1,
        title: 'Luxury Estate',
        category: 'web',
        image: '/projects/luxury-estate.jpg',
        liveUrl: 'https://luxury-estate.com',  // ← Add this field
        description: 'A premium real estate platform...',
        challenge: 'Create a seamless high-end experience...',
        solution: 'Used WebGL for 3D tours...',
        client: 'Estate Global',
        duration: '4 Months',
        technologies: ['React', 'Next.js', 'Three.js', 'Node.js'],
        stats: { label: 'User Engagement', value: '+150%' }
    },
    // ... more projects
];
```

### Step 2: Update the Button Component

In `src/pages/Work.jsx`, find the "View Live Project" button (around line 239) and update it:

**FIND THIS:**
```javascript
<Button width="100%">View Live Project <ArrowRight size={16} style={{ marginLeft: '8px' }} /></Button>
```

**REPLACE WITH:**
```javascript
{selectedProject.liveUrl ? (
    <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        <Button width="100%">View Live Project <ArrowRight size={16} style={{ marginLeft: '8px' }} /></Button>
    </a>
) : (
    <Button width="100%" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Coming Soon</Button>
)}
```

This will:
- Open the live project in a new tab if `liveUrl` exists
- Show "Coming Soon" if no URL is provided

### Step 3: Example with All Fields

Here's a complete example of a project with local image and live URL:

```javascript
{
    id: 7,
    title: 'My Awesome App',
    category: 'web',
    image: '/projects/my-awesome-app.jpg',        // ← Your local image
    liveUrl: 'https://myawesomeapp.com',          // ← Live project URL
    description: 'A revolutionary app that helps users track their fitness goals',
    challenge: 'Users needed a simple way to track workouts without complexity',
    solution: 'Built an intuitive interface with one-tap logging and AI suggestions',
    client: 'FitLife Inc',
    duration: '3 Months',
    technologies: ['React', 'Firebase', 'TensorFlow.js', 'Tailwind'],
    stats: { 
        label: 'Active Users', 
        value: '10k+' 
    }
}
```

## 📸 Complete Workflow: Adding a Project with Your Own Image

### On Your Local Computer:

1. **Prepare your image**:
   ```bash
   # Place your image in the public folder
   cp ~/Desktop/my-project-screenshot.jpg britsync-web/public/projects/
   ```

2. **Edit Work.jsx**:
   ```bash
   # Open the file
   code src/pages/Work.jsx  # or use your preferred editor
   
   # Add your project to the projects array
   ```

3. **Test locally**:
   ```bash
   npm run dev
   # Visit http://localhost:5173/work to see your project
   ```

### Deploy to VPS:

4. **Upload everything**:
   ```bash
   # If using Git:
   git add .
   git commit -m "Add new project"
   git push origin main
   
   # SSH into VPS
   ssh your-username@your-vps-ip
   cd /path/to/britsync-web
   git pull origin main
   npm run build
   pm2 restart britsync-web
   ```

   ```bash
   # If NOT using Git (manual upload):
   # Upload the image
   scp public/projects/my-project.jpg user@vps:/path/to/britsync-web/public/projects/
   
   # Upload the updated Work.jsx
   scp src/pages/Work.jsx user@vps:/path/to/britsync-web/src/pages/
   
   # SSH and rebuild
   ssh user@vps
   cd /path/to/britsync-web
   npm run build
   pm2 restart britsync-web
   ```

## 🎨 Project Categories

Your portfolio has three filter categories:
- **`web`** - Websites and web applications
- **`app`** - Mobile apps and desktop applications  
- **`design`** - Branding, UI/UX, and design work

Make sure to use exactly these values (lowercase) in the `category` field.

## ✏️ Editing Existing Projects

1. Find the project by its `id` or `title` in `src/pages/Work.jsx`
2. Edit any field you want to update
3. Save and rebuild (see step 5 above)

## 🗑️ Removing a Project

1. Find the project object in the `projects` array
2. Delete the entire object (including the comma)
3. Save and rebuild

**Example:**
```javascript
// BEFORE
export const projects = [
    { id: 1, title: 'Project A', ... },
    { id: 2, title: 'Project B', ... },  // ← Delete this one
    { id: 3, title: 'Project C', ... }
];

// AFTER
export const projects = [
    { id: 1, title: 'Project A', ... },
    { id: 3, title: 'Project C', ... }
];
```

## 🚀 Quick Deployment Workflow

After making changes on your VPS:

```bash
# 1. Navigate to project
cd /path/to/britsync-web

# 2. Pull latest changes (if using Git)
git pull origin main

# 3. Install dependencies (if needed)
npm install

# 4. Build the project
npm run build

# 5. Restart the server
pm2 restart britsync-web
# OR if using nginx + serve
pm2 restart all
```

## 💡 Pro Tips

1. **Keep IDs Unique**: Always use the next available number for new projects
2. **Test Locally First**: Before deploying, test changes on your local machine
3. **Backup**: Keep a backup of `Work.jsx` before making major changes
4. **Image Optimization**: Use optimized images (WebP format, under 500KB)
5. **Consistent Formatting**: Keep the same structure for all projects

## 🔧 Common Issues

### Issue: Project doesn't appear
- **Solution**: Check that the `category` is spelled correctly ('web', 'app', or 'design')
- **Solution**: Ensure you rebuilt the project after changes

### Issue: Images not loading
- **Solution**: Verify the image URL is accessible
- **Solution**: If using local images, ensure they're in the `public` folder

### Issue: Site crashes after adding project
- **Solution**: Check for syntax errors (missing commas, brackets, quotes)
- **Solution**: Validate your JavaScript syntax using an online validator

## 📞 Need Help?

If you encounter issues:
1. Check the browser console for errors (F12 → Console tab)
2. Check server logs: `pm2 logs britsync-web`
3. Verify the build completed successfully: `npm run build`

---

**Last Updated**: December 2025  
**File Location**: `src/pages/Work.jsx`
