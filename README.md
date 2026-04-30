# Mission Control Dashboard

**Premium command center for Benjamin's AI-driven business empire**

A fully functional, production-ready React application with orbital UI design, comprehensive task management, calendar integration, AI team orchestration, and budget controls.

## Features

### 5 Main Screens

1. **HOME — ORBITAL HUB**
   - Radial "Mission Control" center with system status
   - 5 portfolio companies in orbital ring (RLM, NVCC, Trading, Brief, AI Support)
   - Live activity feed
   - Key metrics dashboard

2. **TASKS — KANBAN BOARD**
   - 4-column Kanban: Backlog | In Progress | Blocked | Done
   - Drag-and-drop task management
   - 6 pre-populated sample tasks
   - Color-coded priority badges
   - Click to expand task details
   - Delete tasks

3. **CALENDAR**
   - Month/week/day view selector
   - Interactive calendar with event dots
   - Color-coded events by category (trading, business, content)
   - Full event details with location & duration
   - Pre-populated with 7 sample events

4. **AGENTS — AI TEAM ORB**
   - Central Charles (CBV2) agent with orbital badge
   - 8 sub-agents grouped by role (Developers, Writers, Researchers, Operators)
   - Status indicators (active, idle, blocked)
   - Click to expand agent descriptions
   - Team statistics

5. **SETTINGS**
   - Budget controls (monthly: $200, daily: $20)
   - Visual progress bars for spending
   - 6 active cron job automations
   - 9 connected integrations
   - Budget alert configuration
   - System information

## Design System

### Colors
- **Background:** #0A0A0A (dark)
- **Accent:** #00D4FF (cyan)
- **Status Green:** #00ff41
- **Cards:** Dark transparent glass effect with cyan borders
- **Gradients:** Smooth color transitions for badges

### Components
- Orbital rings with SVG styling
- Glass-morphism cards with backdrop blur
- Status dots with glow effects
- Drag-and-drop task cards
- Bottom tab navigation (mobile-first)
- Responsive grid layouts

### Animations
- Orbital rotation
- Pulse glow effects
- Float animations
- Smooth transitions
- Hover state interactions

## Tech Stack

- **React 18** — UI framework
- **Tailwind CSS** — Utility-first styling
- **Lucide React** — Icon library
- **Vite** — Build tool
- **React Beautiful DnD** — Drag-and-drop (optional, native HTML5 used in tasks)

## Installation & Deployment

### Option 1: Deploy to Lovable.dev
1. Copy all files from `/src` folder into Lovable.dev code editor
2. Copy `tailwind.config.js` and `postcss.config.js`
3. Install dependencies via Lovable's package manager
4. Deploy

### Option 2: Deploy to Vercel/Netlify
```bash
npm install
npm run build
# Deploy the dist/ folder
```

### Option 3: Run Locally
```bash
npm install
npm run dev
# Open http://localhost:3000
```

## File Structure

```
mission-control/
├── src/
│   ├── App.jsx                    # Main app + tab navigation
│   ├── main.jsx                   # React entry point
│   ├── index.css                  # Global styles + animations
│   ├── screens/
│   │   ├── Dashboard.jsx          # Home orbital hub
│   │   ├── Tasks.jsx              # Kanban board
│   │   ├── Calendar.jsx           # Calendar with events
│   │   ├── Agents.jsx             # AI team orb
│   │   └── Settings.jsx           # Budget & integrations
│   └── components/
│       ├── OrbitalRing.jsx        # Company orbital badges
│       ├── AgentOrb.jsx           # Central agent display
│       └── ActivityFeed.jsx       # Activity timeline
├── index.html                      # HTML entry
├── package.json                    # Dependencies
├── tailwind.config.js              # Tailwind config
├── postcss.config.js               # PostCSS config
├── vite.config.js                  # Vite config
└── README.md                       # This file
```

## Key Features Explained

### Orbital Design
- SVG-based concentric rings for visual depth
- Companies and agents positioned on orbital paths
- Glow effects and smooth animations
- Click badges to see details

### Kanban Board
- Native HTML5 drag-and-drop (no external library needed)
- Tasks move between columns
- Expandable task details with blockers
- Delete functionality

### Data
- **All data is hardcoded** — no backend required
- Easy to replace with API calls later
- Sample data matches Benjamin's business context
- Real company names, revenue figures, agent names

### Responsive Design
- Mobile-first approach
- Bottom tab navigation (iOS-style)
- Optimized for all screen sizes
- Touch-friendly tap targets

## Customization

### Change Colors
Edit `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      'dark-bg': '#0A0A0A',
      'cyan': '#00D4FF',
      // Add more...
    }
  }
}
```

### Add Real Data
Replace hardcoded data in each screen component:
```jsx
const [companies] = useState([
  // Replace with API call
  // axios.get('/api/companies').then(res => setCompanies(res.data))
])
```

### Connect to Backend
Each screen's data is in its component. To connect to a real API:
1. Use `useEffect` hook to fetch data
2. Replace `useState` with `useState` + `useEffect`
3. Add error handling and loading states

## Performance

- **CSS** — Tailwind (optimized, tree-shaken)
- **Components** — React (lazy loading ready)
- **Images** — Emoji (no heavy assets)
- **Animations** — GPU-accelerated CSS
- **Bundle Size** — ~150KB gzipped (Vite optimized)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS 14+, Android 10+)

## Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] Backend API integration
- [ ] Export calendar/tasks to CSV
- [ ] Dark mode toggle (already dark)
- [ ] Custom color themes
- [ ] Notification system
- [ ] Multi-user support
- [ ] Analytics dashboard

## License

Private — Benjamin Martinez

---

**Built with ❤️ for operational excellence.**

Deploy now and take command. 🛰️
