# Installation & Setup

## Prerequisites

- Node.js v18+ (LTS recommended)
- npm or yarn
- macOS, Linux, or Windows

## Installation Steps

### 1. Install Dependencies

```bash
cd /Users/bennysbot/.openclaw/workspace/mission-control-app-lovable
npm install
```

This installs:
- react & react-dom
- zustand (state management)
- lucide-react (icons)
- tailwindcss (styling)
- vite (build tool)

### 2. Development Server

```bash
npm run dev
```

Open browser at: `http://localhost:5173`

The app auto-reloads on file changes.

### 3. Production Build

```bash
npm run build
```

Creates optimized build in `dist/` folder.

Preview production build:
```bash
npm run preview
```

---

## Project Structure

```
mission-control-app-lovable/
├── src/
│   ├── App.jsx                          Main app component
│   ├── main.jsx                         Vite entry point
│   ├── index.css                        Global styles + animations
│   ├── screens/
│   │   ├── Dashboard.jsx                Home screen (companies, metrics)
│   │   ├── Tasks.jsx                    Kanban task board
│   │   ├── Calendar.jsx                 Calendar events
│   │   ├── WorkflowIntelligence.jsx     NEW: Workflow visualization
│   │   └── Settings.jsx                 App settings
│   ├── components/
│   │   ├── ActivityFeed.jsx
│   │   ├── AgentOrb.jsx
│   │   ├── OrbitalRing.jsx
│   │   ├── WorkflowGraph.jsx            NEW: SVG graph visualization
│   │   ├── TimelineView.jsx             NEW: Gantt timeline
│   │   ├── FlowReplay.jsx               NEW: Playback modal
│   │   ├── OptimizationPanel.jsx        NEW: Suggestions panel
│   │   └── SystemHealthWidget.jsx       NEW: Status indicator
│   ├── store/
│   │   └── workflowStore.js             NEW: Zustand state management
│   └── data/
│       └── mockWorkflows.js             NEW: Demo data
├── public/                              Static assets
├── package.json
├── vite.config.js                       Vite config
├── tailwind.config.js                   Tailwind config
├── postcss.config.js
├── WORKFLOW_INTELLIGENCE_GUIDE.md       NEW: Full documentation
└── INSTALLATION.md                      This file

dist/                                    Production build (after npm run build)
node_modules/                            Dependencies
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find and kill process on port 5173
lsof -i :5173
kill -9 <PID>

# Or use different port
npm run dev -- --port 3000
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tailwind Classes Not Working

```bash
# Rebuild Tailwind CSS
npm run build
```

### Zustand Store Errors

Ensure zustand is installed:
```bash
npm list zustand
# Should show: zustand@4.4.1
```

---

## Accessing Workflow Intelligence

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to Workflows tab:**
   - Bottom navigation: `[Home] [Tasks] [Calendar] [Workflows] [Settings]`
   - Click **Workflows** icon (cog icon)

3. **Explore features:**
   - **Graph View** — See all workflows as interconnected nodes
   - **Timeline View** — See Gantt-style timeline with stages
   - **Search** — Find workflows or agents
   - **Filter** — Filter by status (in-progress, completed, etc.)
   - **Click workflow** — See details in right panel
   - **Optimization** — Read AI suggestions for improvements
   - **Replay** — Click "Start Replay" to watch workflow step-by-step

---

## Default Mock Data

The module comes pre-loaded with 8 realistic workflows:

1. **Trading Strategy Deployment** — 65% complete, in-progress
2. **Bennett's Brief Issue #49** — 92% complete, in-progress
3. **RLM: Hyatt Estimate Generation** — 100% complete, finished
4. **Email Campaign: Prospect Outreach** — 80% complete, waiting for approval
5. **Data Validation for Trading Bot** — 35% complete, BLOCKED (error)
6. **Video Processing: Meta Glasses Footage** — 45% complete, in-progress
7. **NVCC: Website Content Update** — 55% complete, waiting for feedback
8. **Sentiment Analysis: Customer Feedback** — 88% complete, in-progress

And 8 agents (Trading Bot, Market Research, Content Agent, etc.)

**Note:** Replace with real data by hooking to OpenClaw API (see WORKFLOW_INTELLIGENCE_GUIDE.md)

---

## Environment Variables

Currently, no env vars required. Future integrations:

```bash
# .env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
VITE_OPENAI_KEY=sk-...
```

---

## Deployment

### GitHub Pages

```bash
# Build
npm run build

# Deploy dist/ folder to GitHub Pages
```

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## Performance Tips

1. **Use Chrome DevTools** — Check Performance tab for frame rate
2. **Monitor bundle size** — `npm run build` shows final size
3. **Lighthouse audit** — Run in Chrome DevTools → Lighthouse
4. **React DevTools** — Install browser extension for component profiling

---

## Next: Connect Real Data

Once running, to connect real OpenClaw workflows:

1. Create API endpoint in `/api/workflows`
2. In `WorkflowIntelligence.jsx`, replace mock data fetch:
   ```javascript
   useEffect(() => {
     fetch('/api/workflows')
       .then(r => r.json())
       .then(workflows => setWorkflows(workflows));
   }, []);
   ```
3. Replace WebSocket stub with actual connection
4. Update Agent list from OpenClaw agent status

See **WORKFLOW_INTELLIGENCE_GUIDE.md** for full integration instructions.

---

## Support

For issues:
1. Check browser console (F12)
2. Check terminal for build errors
3. Review component props & Zustand store
4. Test with mock data first, then real data

---

_Last updated: 2026-04-09_
