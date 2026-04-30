# Deployment Guide

## Quick Deploy to Lovable.dev

### Step 1: Prepare Files
1. Go to Lovable.dev and create a new project
2. Select "React" template

### Step 2: Copy Source Files
Copy the entire contents of each file into Lovable's editor:

**Core Files (in order):**
1. `tailwind.config.js` → Settings → Tailwind Config
2. `postcss.config.js` → Settings → PostCSS Config
3. `index.html` → Replace default HTML
4. `package.json` → Update dependencies
5. `src/index.css` → Create new file
6. `src/main.jsx` → Create new file
7. `src/App.jsx` → Main app component

**Screen Components:**
8. `src/screens/Dashboard.jsx`
9. `src/screens/Tasks.jsx`
10. `src/screens/Calendar.jsx`
11. `src/screens/Agents.jsx`
12. `src/screens/Settings.jsx`

**Component Library:**
13. `src/components/OrbitalRing.jsx`
14. `src/components/AgentOrb.jsx`
15. `src/components/ActivityFeed.jsx`

### Step 3: Install Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "lucide-react": "^0.263.1",
  "tailwindcss": "^3.3.0"
}
```

Run `npm install` in Lovable's terminal.

### Step 4: Deploy
Click "Deploy" or "Publish" in Lovable.dev

**Your app is live!** 🎉

---

## Deploy to Vercel (Advanced)

### Prerequisites
- GitHub account with repo
- Vercel account

### Steps

```bash
# 1. Clone/download mission-control folder
cd mission-control

# 2. Initialize git (if not already)
git init
git add .
git commit -m "Initial Mission Control deployment"

# 3. Push to GitHub
git remote add origin https://github.com/YOUR-USERNAME/mission-control
git push -u origin main

# 4. Connect to Vercel
# Option A: CLI
npm i -g vercel
vercel

# Option B: Web dashboard
# 1. Go to vercel.com
# 2. Click "New Project"
# 3. Select your GitHub repo
# 4. Import and deploy
```

**Environment Variables:** None needed (hardcoded data)

**Result:** Live at `mission-control.vercel.app`

---

## Deploy to Netlify

```bash
# 1. Build locally
npm run build

# 2. Deploy to Netlify
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

Or connect GitHub repo:
1. Push to GitHub
2. Go to netlify.com
3. Connect GitHub
4. Select repo
5. Deploy

---

## Deploy to Your Own Server

### Requirements
- Node.js 16+
- npm or yarn

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Build for production
npm run build

# 3. Serve from dist folder
npm install -g serve
serve -s dist -l 3000
```

**Or use Docker:**

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

```bash
docker build -t mission-control .
docker run -p 3000:3000 mission-control
```

---

## Environment Setup for Benjamin

### For Development
```bash
cd mission-control
npm install
npm run dev
# Open http://localhost:3000
```

### For Production
```bash
npm run build
# Upload dist/ folder to hosting
```

---

## Troubleshooting

### "Module not found" errors
- Delete `node_modules/`
- Run `npm install` again

### Tailwind styles not showing
- Ensure `tailwind.config.js` is in root
- Check PostCSS config
- Run `npm install -D tailwindcss postcss autoprefixer`

### Dark mode not working
- Check `dark-bg` color in Tailwind config
- Ensure `body` background is set in `index.css`

### Drag-and-drop not working
- Clear browser cache
- Check browser console for JS errors
- Ensure React version is 18+

---

## Live URLs After Deployment

| Platform | URL Pattern |
|----------|-----------|
| Lovable.dev | lovable.dev/share/[project-id] |
| Vercel | mission-control.vercel.app |
| Netlify | mission-control.netlify.app |
| Custom | yourdomain.com/mission-control |

---

## Post-Deployment Checklist

- [ ] Test all 5 screens
- [ ] Check mobile responsiveness
- [ ] Verify bottom nav works
- [ ] Test drag-and-drop tasks
- [ ] Verify orbital animations load
- [ ] Check calendar functionality
- [ ] Test agent expansion
- [ ] Verify budget bars display correctly
- [ ] Check all colors render correctly
- [ ] Test on multiple browsers

---

## Updates & Maintenance

### To update the app:
1. Edit source files locally
2. Run `npm run build`
3. Deploy new `dist/` folder

### To backup:
- GitHub provides automatic backups
- Vercel/Netlify have built-in version control

---

**Questions?** Check README.md or review the component source files.

Deploy with confidence. You're running NASA-grade mission control. 🛰️
