# Team Member Description Update Instructions

This document outlines the changes made to enable editing of Team Member descriptions (Bios) in the Admin Dashboard and how to deploy them to the VPS.
{renderField('Description (Bio)', 'bio', 'textarea')}

## Files Changed

### 1. `britsync-web/src/components/admin/AdminItemForm.jsx`
**Change:** Added the "Description (Bio)" field to the Team Member form section.

```javascript
// ... inside renderFormFields ...
case 'team': // about_team
case 'about_team':
    return (
        <>
            {renderField('Name', 'name')}
            {renderField('Role', 'role')}
            {renderField('Description (Bio)', 'bio', 'textarea')} {/* Added this line */}
            {renderField('Order', 'order', 'number')}
// ...
```

### 2. `britsync-web/src/pages/AdminDashboard.jsx`
**Change:** Updated the initial template for new team members to include an empty `bio` field.

```javascript
// ... inside handleAdd ...
case 'about_team':
    template = { name: '', role: '', order: 0, image: '', bio: '' }; // Added bio: ''
    break;
```

---

## VPS Deployment Instructions

**VPS Path:** `/var/www/britsync/brit/`

Follow these steps to deploy the changes to your VPS:

1.  **Navigate to the project directory:**
    ```bash
    cd /var/www/britsync/brit/
    ```

2.  **Pull the latest changes (if using git) OR upload the modified files manually.**
    *   If uploading manually, replace:
        *   `britsync-web/src/components/admin/AdminItemForm.jsx`
        *   `britsync-web/src/pages/AdminDashboard.jsx`

3.  **Rebuild the Frontend:**
    Navigate to the web directory and build the project.
    ```bash
    cd britsync-web
    npm install
    npm run build
    ```

4.  **Deploy the Build:**
    Copy the built files to the server's public directory.
    ```bash
    # Assuming your server serves from ../britsync-server/public
    # The postbuild script might handle this, but to be safe:
    cp -r dist/* ../britsync-server/public/
    ```

5.  **Restart the Server (Optional but recommended):**
    If you made changes to the backend (none required for this task, but good practice to ensure everything is fresh).
    ```bash
    cd ../britsync-server
    pm2 restart britsync-server
    ```

6.  **Verify:**
    *   Log in to the Admin Dashboard.
    *   Go to the "Team" section.
    *   Edit an existing member or add a new one.
    *   You should now see a "Description (Bio)" text area.
    *   Save changes and check the "About" page on the public site to see the bio in the popup panel.
