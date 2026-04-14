import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

// Strip all markdown and special characters for clean Substack copy-paste
function cleanText(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '') // Remove markdown headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italics
    .replace(/\[(.*?)\]/g, '$1') // Remove bracket formatting
    .replace(/^[-*]\s+/gm, '') // Remove bullet points
    .replace(/^\d+\.\s+/gm, '') // Remove numbered lists
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\n{3,}/g, '\n\n') // Normalize spacing
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace HTML entities
    .trim();
}

export function ContentCopypaste() {
  const [copied, setCopied] = useState<string | null>(null);

  const rawContent = {
    'systems-over-decisions': {
      title: 'Systems Over Decisions: Why Discipline Matters More Than Intelligence',
      text: `Systems Over Decisions: Why Discipline Matters More Than Intelligence

Issue #8 - April 10, 2026

I've hired plenty of smart people who failed. I've also worked with average guys who built empires. The difference? Systems.

Here's the truth nobody wants to hear: Your IQ doesn't matter if you can't execute consistently. I'd rather have a C+ student with military discipline than a genius who "wings it."

THE 2M LESSON FROM A PAINT JOB

Three years ago, we bid a hospital repaint — a 2.2 million dollar contract. My smartest estimator calculated we needed 18 weeks. My foreman, a guy who barely finished high school, said we needed a system or we'd blow the deadline.

The estimator had spreadsheets. Complex formulas. Risk calculations.

The foreman had a checklist:
Morning crew assignments by 6:45am
Daily footage targets per painter
Photo documentation every 2 hours
End-of-day progress review at 4pm
Next-day prep before leaving site

Guess what? The foreman's simple system beat the estimator's genius-level planning. We finished in 16 weeks because every single day followed the same boring process. No decisions. Just execution.

TRADING TAUGHT ME THE SAME THING

I've blown up trading accounts twice. Not because I couldn't read charts — I was actually pretty good at technical analysis. I blew up because I kept making "smart" decisions in the moment.

"This setup looks even better than my rules."
"I'll hold through the Fed meeting, just this once."
"Double down, the thesis is still valid."

Now? I trade like a robot:
Entry only at 9/20 EMA cross with volume confirmation
Stop loss at 1.5% no matter what
Exit at 3% profit or end of day
Maximum 3 trades per session
If down 2%, screens off

My win rate went from 35% (making "intelligent" decisions) to 64% (following dumb rules). The system removed me from the equation.

WHY SMART PEOPLE HATE SYSTEMS

Intelligent people think they're above process. They believe their judgment in the moment beats predetermined rules. They're usually wrong.

At RLM Enterprises, I've watched brilliant project managers fail because they tried to optimize everything in real-time. Meanwhile, my best PM follows the same 47-point checklist for every job, whether it's a 50K storefront or a 5M hotel.

Smart people see systems as constraints. Successful people see them as leverage.

THE COMPOUND EFFECT NOBODY TALKS ABOUT

Here's what happens when you choose systems over decisions:

Week 1: Feels robotic, restrictive
Month 1: You notice fewer mistakes
Month 3: Your baseline performance rises
Month 6: You're outperforming your "smarter" self
Year 1: People ask what changed

The magic isn't in the system itself. It's in removing decision fatigue. Every choice you don't have to make is mental energy you can deploy elsewhere.

Steve Jobs wore the same outfit. Not because he couldn't afford clothes. Because choosing shirts is a worthless decision.

YOUR EXECUTION FRAMEWORK

Stop theorizing. Here's exactly how to build discipline into any area:

THE NON-NEGOTIABLE SYSTEM BUILDER

1. Define the Outcome (one sentence, measurable)
Bad: "Get better at sales"
Good: "Close 5 deals per month"

2. List Every Micro-Step (stupidly detailed)
Not: "Make sales calls"
But: "Dial from 9:00-9:45am, standing up, using script A"

3. Remove ALL Decisions
When: Set times, not "when I feel ready"
What: Exact actions, not "whatever seems right"
How: Specific methods, not "figure it out"

4. Track ONE Metric (the one that actually matters)
Painters: Square feet per day
Trading: Win rate percentage
Sales: Calls-to-close ratio

5. Review Weekly, Adjust Monthly (not daily)
Systems need time to prove themselves
Tweaking daily is just decision-making in disguise

THE BOTTOM LINE

I run a multi-million dollar painting business. I trade six figures. I don't do it because I'm smarter than you. I do it because I stopped trying to be smart.

My smartest competitor analyzes every job individually. I use the same pricing formula for everything. He's brilliant. I'm profitable.

My genius trader friends study markets 12 hours a day. I trade the same pattern every morning for 45 minutes. They have theories. I have profits.

Intelligence is overrated. Discipline is underpriced.

Build the system. Follow the system. Stop making decisions.

The most successful people you know aren't making better choices. They're making fewer choices.

That's the edge.

Benjamin Martinez runs RLM Enterprises and writes about business execution. No theory. Just what works.

Word Count: 798 words`
    },
    'market-open-5-signals': {
      title: 'Market Open: 5 Signals You Need to See Today',
      text: `Market Open: 5 Signals You Need to See Today

Good morning traders,

The market's setting up for what could be a significant move. I'm watching 5 key levels this morning and I'm already seeing some beautiful setups forming.

THE SETUP

We closed yesterday with strong momentum across the tech stack. Today we're seeing:

SPY: Pulled back to 556 support (my key watch level). If we hold here, I'm looking for a move back to 561. Key to watch: VWAP and 9-EMA confluence around 558.

QQQ: Similar pattern. Pulled back to 480, watching for a bounce back to 485-487. Heavy volume at the bottom = institutional accumulation.

BTC: Crypto showing strength. 65,000 is my key level. If we break above 65,500, I'm watching for 67,000. Risk reward is 1:2 minimum.

MY PLAN FOR TODAY

1. 6:30-7:00 AM PT: Monitor opening range. I'm looking for early volatility on the 1-minute chart.
2. 7:00-8:00 AM PT: First signal window. If we get a VWAP bounce with RSI in oversold, I'm taking a scalp.
3. Afternoon: Depending on morning momentum, either take the day off or look for continuation trades.

Position sizing: 1% risk per trade, 2:1 minimum risk/reward. Not trading for size today - trading for accuracy.

WHY THIS MATTERS

Last week I posted a similar setup. The traders who followed it made 2-3% on their accounts. That's not gambling - that's systematic trading.

Today feels like one of those days.

WHAT TO WATCH

SPY holding 556
QQQ holding 480
RSI below 30 = oversold bounce opportunity
VWAP rejection = entry confirmation

I'll be posting live updates as the setup unfolds. If you're paid tier, you get it in real-time.

Let's make today count.

Bennett

P.S. - 15 paid members so far have been asking about coaching. I'm working on a Pro tier option for 1-on-1 sessions. More soon.`
    },
    'discipline-paradox': {
      title: 'The Discipline Paradox: Why Motivation Fails But Systems Work',
      text: `The Discipline Paradox: Why Motivation Fails But Systems Work

You're not lazy. Your system is.

Most people think they're broken because they lack motivation. The problem isn't willpower. It's structure.

Here's what nobody talks about: Motivation is a lie. It's a feeling that comes and goes like the weather. You can't build anything sustainable on a feeling.

THE MOTIVATION MYTH

Day 1: You're fired up. You meditate. You work out. You crush your goals.

Day 14: You're tired. You didn't sleep well. Motivation is gone. So you skip the routine.

Day 30: You've quit entirely and convinced yourself "that system doesn't work."

What actually happened: You relied on motivation instead of systems.

Motivation is a bonus. When it shows up, great. When it doesn't, you shouldn't notice.

THE REAL GAME: SYSTEMS

A system is a set of rules that execute whether you feel like it or not.

Example 1: The Trading System
Most traders fail because they trade on emotion. They win. They feel invincible. They over-leverage.
They lose. They panic. They exit at the worst possible time.

A real system removes emotion:
Fixed risk per trade (2% always)
Pre-defined entries and exits
Mechanical rules, no thinking
Follow the system, not your gut

Result: 55% win rate that compounds for years beats 80% win rate that blows up the account.

Example 2: The Content System
Most creators fail because they post when they "feel inspired."

A real system says:
Monday 9 AM: Post #1
Wednesday 9 AM: Post #2
Friday 9 AM: Post #3

You don't ask yourself if you feel like creating. The system says "create," so you create.

Result: 3 posts/week for 52 weeks = 156 posts. That's a brand.

WHY SYSTEMS BEAT WILLPOWER

Willpower is finite. You have a limited amount each day. Every decision drains it.

Should I work out today? Should I post? Should I write? Each "should" costs willpower.

Systems are automatic. Once built, they require zero willpower.

You don't think about brushing your teeth. It's automatic. You don't think about your system. You just execute it.

THE SETUP COST IS REAL

Building a system takes effort upfront.

Defining your trading rules? Painful. Takes hours of backtesting.
Setting up your content calendar? Takes time. Takes thinking.
Creating your morning routine? Boring. Feels useless for the first week.

But here's the payoff: Once the system is built, execution becomes automatic.

THE SYSTEMS I'VE BUILT THAT ACTUALLY WORK

Trading System (3 years active)
Risk: 2% per trade (pre-defined)
Entries: VWAP + EMA (mechanical)
Exits: Profit targets or stops (pre-set)
Emotion removed? Completely.
Result: 55% win rate, +50K accumulated

Content System (6 months active)
Schedule: Mon/Wed/Fri 9 AM PT
Format: 800-1,000 words
Distribution: Substack, LinkedIn, Twitter, Reddit (auto-generated)
Motivation required? Zero.
Result: 287 subscribers, 38% open rate, 18.7K reach

Email System (Active)
Rule: Reply within 2 hours
Filter: Auto-flag sensitive topics
Response: Generated by AI, humanized
Decision-making required? Minimal.
Result: 95% response rate, never miss important emails

THE REAL DISCIPLINE

Discipline isn't about pushing harder.

Discipline is building a system that doesn't require pushing.

The moment you're pushing, it's too hard. You're relying on willpower again.

Real discipline is boring. It's automatic. It's doing the thing because the system says to do the thing.

YOUR MOVE

Here's what I see: Most people are trying to win through willpower.

They're fighting every day. "Should I work out?" "Should I post?" "Should I trade?"

Every decision is a battle. By day 30, they're exhausted and quit.

The winners aren't smarter or more motivated. They just removed the decision.

They built a system that says: "We do this. We don't ask why. We just do it."

If you want to change your life in 90 days:

1. Identify one area that matters (trading, content, fitness, whatever)
2. Build the system (this takes 3-5 hours of focused work)
3. Execute the system (zero willpower required, just follow the rules)
4. Review after 90 days (then adjust based on data)

That's it. That's the game.

Motivation is a distraction. Systems are the move.

Bennett's Brief - Systems, Discipline, Execution`
    }
  };

  // Apply cleanText to all content
  const content = Object.entries(rawContent).reduce((acc, [key, item]) => {
    acc[key] = {
      ...item,
      text: cleanText(item.text)
    };
    return acc;
  }, {} as typeof rawContent);

  const handleCopy = (key: string) => {
    const item = content[key as keyof typeof content];
    if (item) {
      navigator.clipboard.writeText(item.text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bennett's Brief Content Hub</h2>
        <p className="text-gray-600 mb-6">CLEAN TEXT - Copy and paste directly to Substack with ZERO special characters</p>

        {Object.entries(content).map(([key, item]) => (
          <div key={key} className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Ready to paste into Substack - no markdown</p>
              </div>
              <button
                onClick={() => handleCopy(key)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                {copied === key ? (
                  <>
                    <Check size={18} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy to Clipboard
                  </>
                )}
              </button>
            </div>

            <div className="bg-gray-50 rounded border border-gray-200 p-4 max-h-96 overflow-y-auto font-mono text-sm text-gray-700 whitespace-pre-wrap break-words">
              {item.text.substring(0, 400)}...
            </div>
            <p className="text-xs text-gray-500 mt-2">{item.text.length} characters - CLEAN</p>
          </div>
        ))}
      </div>
    </div>
  );
}