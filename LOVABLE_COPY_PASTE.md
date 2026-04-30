# Lovable.dev Copy-Paste Setup (2 Minutes)

**Follow these exact steps to deploy Mission Control on Lovable.dev**

---

## Step 1: Create New Project (30 seconds)

1. Go to **lovable.dev**
2. Click **"Create New Project"**
3. Select **React** template
4. Name it: `mission-control`
5. Click **Create**

You now have a blank React project in the editor.

---

## Step 2: Replace Files (90 seconds)

### File 1: `package.json`
1. Find `package.json` in the file tree (left sidebar)
2. Open it
3. Select ALL (Ctrl+A / Cmd+A)
4. Delete
5. Paste entire contents of `/package.json`
6. Save

### File 2: `tailwind.config.js`
1. Create new file: Right-click file tree → "New File"
2. Name: `tailwind.config.js`
3. Paste entire contents
4. Save

### File 3: `postcss.config.js`
1. Create new file → `postcss.config.js`
2. Paste entire contents
3. Save

### File 4: `index.html`
1. Find `index.html`
2. Open it
3. Select ALL
4. Delete
5. Paste entire contents of `/index.html`
6. Save

---

## Step 3: Create src/index.css (20 seconds)

1. In file tree, find/create `src/` folder
2. Create new file: `src/index.css`
3. Paste entire contents of `/src/index.css`
4. Save

---

## Step 4: Create src/main.jsx (10 seconds)

1. Create new file: `src/main.jsx`
2. Paste entire contents of `/src/main.jsx`
3. Save

---

## Step 5: Create src/App.jsx (20 seconds)

1. Create new file: `src/App.jsx`
2. Paste entire contents of `/src/App.jsx`
3. Save

---

## Step 6: Create Screens Folder & Files (1 minute)

1. In `src/`, create new folder: `screens`
2. Inside `screens/`, create 5 files:
   - `Dashboard.jsx` → paste from `/src/screens/Dashboard.jsx`
   - `Tasks.jsx` → paste from `/src/screens/Tasks.jsx`
   - `Calendar.jsx` → paste from `/src/screens/Calendar.jsx`
   - `Agents.jsx` → paste from `/src/screens/Agents.jsx`
   - `Settings.jsx` → paste from `/src/screens/Settings.jsx`

Save each one.

---

## Step 7: Create Components Folder & Files (30 seconds)

1. In `src/`, create new folder: `components`
2. Inside `components/`, create 3 files:
   - `OrbitalRing.jsx` → paste from `/src/components/OrbitalRing.jsx`
   - `AgentOrb.jsx` → paste from `/src/components/AgentOrb.jsx`
   - `ActivityFeed.jsx` → paste from `/src/components/ActivityFeed.jsx`

Save each one.

---

## Step 8: Install Dependencies (30 seconds)

1. In Lovable, open terminal (bottom of editor)
2. Run:
```bash
npm install
```

Wait for it to finish. You should see:
```
added XXX packages
```

---

## Step 9: Deploy (10 seconds)

1. Click **Deploy** button (top right of editor)
2. Select **Publish**
3. Wait for build to complete (30-60 seconds)

You'll see:
```
✅ Deployment successful!
Live URL: https://lovable.dev/share/[project-id]
```

---

## Done! 🎉

Your Mission Control dashboard is now live.

**Test it:**
- Open the live URL
- Try all 5 tabs: Home, Tasks, Calendar, Agents, Settings
- Test drag-and-drop on Tasks
- Click around the orbital rings
- Check responsive design (shrink browser window)

---

## File Checklist

Make sure you have all these files in Lovable:

```
✅ package.json
✅ tailwind.config.js
✅ postcss.config.js
✅ index.html
✅ src/main.jsx
✅ src/App.jsx
✅ src/index.css
✅ src/screens/Dashboard.jsx
✅ src/screens/Tasks.jsx
✅ src/screens/Calendar.jsx
✅ src/screens/Agents.jsx
✅ src/screens/Settings.jsx
✅ src/components/OrbitalRing.jsx
✅ src/components/AgentOrb.jsx
✅ src/components/ActivityFeed.jsx
```

Total: 15 files

---

## If Something Goes Wrong

### "Module not found" errors
- Make sure all files are in the right folders
- Check spelling (case-sensitive)
- Run `npm install` again

### Styles not showing (no colors/dark background)
- Check `src/index.css` is imported in `src/main.jsx`
- Delete entire `node_modules/` in Lovable terminal
- Run `npm install` again
- Refresh page

### Nothing loads/blank page
- Check browser console for errors (F12 → Console)
- Make sure all imports use correct paths
- Verify `package.json` has all dependencies

### Drag-drop not working
- Make sure you're using latest Chrome/Firefox
- Clear browser cache
- Check console for JavaScript errors

---

## Sharing Your App

Once deployed, you get a Lovable.dev URL like:
```
https://lovable.dev/share/abc123def456
```

Share this URL with Benjamin. It's permanent and always live.

---

## What's Next?

### Customize for Benjamin:
1. In `Dashboard.jsx`, change company names/stats
2. In `Calendar.jsx`, update event dates
3. In `Settings.jsx`, update budget amounts
4. In `Agents.jsx`, add/remove team members
5. In `App.jsx`, change colors

Each change deploys automatically to the live URL.

---

## Pro Tips

💡 **Save after every change** — Lovable auto-deploys
💡 **Use browser console (F12)** to debug issues
💡 **Test on mobile** — Use responsive design mode (F12)
💡 **Share the live URL** — No installation needed
💡 **Keep backups** — Lovable has version history

---

## Support

- Full documentation: `README.md`
- Deployment guides: `DEPLOYMENT.md`
- Project overview: `PROJECT_MANIFEST.md`
- Quick reference: `QUICK_START.md`

All files are in the `/tmp/mission-control/` directory.

---

**That's it. You now have a premium command center live on Lovable.dev.**

Ready to take command? 🛰️
