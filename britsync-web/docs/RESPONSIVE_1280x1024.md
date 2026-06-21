# Responsive Adjustments for 1280×1024

## Summary
- Reduced global base font size at ≤1280px.
- Tightened Navbar dimensions and spacing at ≤1280px.
- Scaled down Hero section headings and content at ≤1280px.
- Rebuilt frontend and refreshed server public assets.

## Files Changed
- src/index.css
- src/components/layout/Navbar.css
- src/components/home/Hero.css

## Exact Modifications

### src/index.css
- Added:
  - `html { font-size: 16px; }`
  - `@media (max-width: 1280px) { html { font-size: 14px; } }`

### src/components/layout/Navbar.css
- Added `@media (max-width: 1280px)` overrides:
  - `.navbar { height: 110px; }`
  - `.navbar.scrolled { height: 80px; }`
  - `.logo-img { width: 120px; height: 120px; }`
  - `.navbar.scrolled .logo-img { width: 70px; height: 70px; }`
  - `.nav-container { width: 96%; max-width: 1200px; }`
  - `.nav-menu-desktop { gap: 2rem; }`
  - `.nav-links { gap: 1.25rem; }`
  - `.logo-text { font-size: 1rem; margin-left: -24px; }`
  - `.mobile-link { font-size: 1.8rem; }`

### src/components/home/Hero.css
- Added `@media (max-width: 1280px)` overrides:
  - `.hero-title-main { font-size: clamp(2rem, 7vw, 4rem); }`
  - `.hero-title-sub { font-size: clamp(2rem, 7vw, 4rem); }`
  - `.hero-subtitle { font-size: clamp(0.95rem, 3.2vw, 1.1rem); max-width: 540px; }`
  - `.hero-content { max-width: 760px; }`

## Build and Deployment
- Ran production build to generate updated assets into `britsync-web/dist`.
- Copied built assets into server path `britsync-server/public`.

## VPS Instructions (to apply these changes)
1. Upload your updated `britsync-server` folder to the VPS (ensure `public/` is included).
2. Restart the backend (example with PM2):
   - `pm2 restart britsync-server`
3. Clear browser cache or hard-refresh to see updated styles.

## VPS Path-Specific Steps (your folder: `/var/www/britsync/brit/`)
- Navigate to your project:
  - `cd /var/www/britsync/brit/`
- Ensure Nginx serves the built frontend:
  - Set Nginx root to: `/var/www/britsync/brit/britsync-server/public`
  - Proxy `/api` to backend at port `5003`
  - Reload Nginx:
    - `sudo nginx -t && sudo systemctl reload nginx`
- Deploy updated frontend:
  - Upload local `britsync-server` (including `public/`) to `/var/www/britsync/brit/britsync-server`
  - Optional permissions:
    - `sudo chown -R www-data:www-data /var/www/britsync/brit/britsync-server/public`
- Restart backend:
  - `pm2 restart britsync-server`
  - If not using PM2:
    - `NODE_ENV=production PORT=5003 node /var/www/britsync/brit/britsync-server/index.js`


