# Quick Test Guide — Workflow Intelligence Module

**Time to first view:** ~5 minutes

---

## Step 1: Install & Run (2 minutes)

```bash
cd /Users/bennysbot/.openclaw/workspace/mission-control-app-lovable

# Install if you haven't already
npm install

# Start dev server
npm run dev
```

You'll see:
```
  VITE v4.3.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
```

---

## Step 2: Open in Browser (30 seconds)

Click the link or open: `http://localhost:5173`

You should see the Mission Control dashboard with bottom navigation tabs.

---

## Step 3: Navigate to Workflows (30 seconds)

Look at the bottom navigation:
```
[Home] [Tasks] [Calendar] [🔧 Workflows] [Settings]
```

Click the **Workflows** tab (gear icon).

---

## Step 4: Explore Features (2 minutes)

### View 1: Graph Mode (Default)

You'll see a node-based visualization with 8 colored circles (workflows):
- 🟢 **Green** = Completed (RLM Estimate)
- 🔵 **Blue** = In Progress (Trading, Brief, Video Processing, Sentiment)
- 🟡 **Yellow** = Waiting (Email Campaign, NVCC Website)
- 🔴 **Red** = Blocked (Data Validation Error)

**Try:**
1. Hover over a node → it glows and shows preview
2. Click a node → details appear in right panel
3. Click "Start Replay" → playback modal opens

### View 2: Timeline Mode

Click **Timeline** button (top right). You'll see:
- Horizontal Gantt bars for each workflow
- Time positioning showing when each ran
- Expandable cards for detailed history
- Progress bar for each workflow

**Try:**
1. Scroll through the timeline
2. Click a workflow card to select it
3. Click ▼ arrow to expand and see stage history

### View 3: Search

Type in the search box at the top:
- Type "trading" → filters to Trading Strategy workflow
- Type "agent" → shows workflows with agents
- Clear search → shows all again

### View 4: Filters

Use the status dropdown:
- **All Status** → shows all workflows
- **In Progress** → shows only 🔵 blue workflows
- **Completed** → shows only 🟢 green (1 workflow)
- **Blocked** → shows only 🔴 red (1 workflow)
- **Waiting** → shows only 🟡 yellow (2 workflows)

**Combine:** Search + filter together works smoothly.

### View 5: Optimization Panel

With a workflow selected (right side), you'll see:
- Bottlenecks (if any)
- AI suggestions for improvements
- Cost per hour
- Time remaining estimate
- Performance metrics

**Example:** Blocked workflow shows "Blocked by: Data Validation" with suggestion to fix.

### View 6: Replay Playback

Click any workflow's "Start Replay" button. A modal opens showing:
- Current step highlighted
- Timeline of all stages
- Play/pause controls
- Speed selector (0.5x, 1x, 2x, 4x)
- Progress bar

**Try:**
1. Click play button
2. Watch stages complete one by one
3. Use speed controls to slow down/speed up
4. Jump to different steps with arrow buttons

---

## What You're Testing

| Feature | Location | What to look for |
|---------|----------|------------------|
| **Graph Visualization** | Main area | 8 colored nodes, smooth transitions |
| **Timeline View** | Timeline tab | Horizontal bars with stage history |
| **Search** | Top search box | Filters results in real-time |
| **Status Filter** | Top right dropdown | Shows/hides workflows by status |
| **Workflow Selection** | Click any workflow | Details appear in right panel |
| **Optimization** | Right panel | Suggestions for each workflow |
| **Flow Replay** | "Start Replay" button | Modal with step-by-step playback |
| **System Health** | Top right | Green/yellow status widget |
| **Animations** | Any interaction | Smooth 60fps (should feel buttery) |
| **Responsive** | Resize browser | Layout adapts to window size |

---

## Expected Results

### ✅ All Tests Pass If:

1. ✅ Page loads quickly (<1 second)
2. ✅ Graph view shows 8 colorful workflow nodes
3. ✅ Timeline view shows Gantt bars
4. ✅ Search filters workflows instantly
5. ✅ Status filter works (all 5 options)
6. ✅ Clicking workflows shows details
7. ✅ Optimization panel displays suggestions
8. ✅ Replay modal plays through stages smoothly
9. ✅ Animations are fluid (no stuttering)
10. ✅ No errors in browser console (F12)

### ❌ If Something Breaks:

1. Check browser console (F12 → Console tab)
2. Look for red error messages
3. Check terminal where `npm run dev` is running
4. Try refreshing the page (Cmd+R)
5. Try `npm run build` to catch build errors

---

## Demo Data Highlights

### Most Interesting Workflows

1. **Data Validation (BLOCKED)** 🔴
   - Shows error state
   - Click to see bottleneck analysis
   - Replay shows exact error point

2. **Email Campaign (WAITING)** 🟡
   - Shows dependency blocking
   - Optimization suggests parallelization
   - Needs Benjamin's approval

3. **Trading Strategy (IN PROGRESS)** 🔵
   - 65% complete, multi-agent
   - Complex dependencies
   - Good example of parallelization potential

4. **Bennett's Brief (IN PROGRESS)** 🔵
   - 92% complete, almost done
   - Shows content pipeline
   - Replica of real publication workflow

---

## Performance Expectations

You should observe:
- **Page Load:** <1 second
- **Graph Render:** Instant
- **Hover Effect:** Immediate
- **Animations:** Smooth 60fps
- **Search:** Real-time (<50ms)
- **Replay:** Smooth playback at any speed

---

## Next: Real Data Integration

Once you're happy with the UI:

1. Replace mock data in `src/data/mockWorkflows.js`
2. Connect to real OpenClaw workflows
3. Implement WebSocket for live updates
4. Add revenue metrics (next layer)

See **WORKFLOW_INTELLIGENCE_GUIDE.md** for integration steps.

---

## Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| Page won't load | Ensure `npm run dev` is running |
| No workflows visible | Refresh browser (Cmd+R) |
| Buttons don't work | Check console (F12) for errors |
| Styles look wrong | Make sure `npm install` completed |
| Replay doesn't play | Try different workflow |
| Search doesn't work | Try typing more characters |
| Performance is slow | Check if CPU is maxed (Activity Monitor) |

---

## Questions?

Refer to:
- **WORKFLOW_INTELLIGENCE_GUIDE.md** → Feature documentation
- **INSTALLATION.md** → Setup & troubleshooting
- **WORKFLOW_MODULE_STATUS.md** → Build status & checklist

---

**Estimated test time:** 5-10 minutes
**Difficulty:** Easy (just click around)
**What's expected:** All features work smoothly

Enjoy! 🚀
