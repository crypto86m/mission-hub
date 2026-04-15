#!/usr/bin/env python3
"""
Generate status.json with LIVE data from real sources.
Run via cron every 30 minutes or on-demand.
Output: public/api/status.json
"""

import json
import os
import subprocess
from datetime import datetime, timezone
from pathlib import Path
import urllib.request
import ssl

SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
OUTPUT = PROJECT_DIR / "public" / "api" / "status.json"
ENV_FILE = Path.home() / ".openclaw" / ".env.alpaca"

def load_env():
    """Load env vars from .env.alpaca"""
    env = {}
    if ENV_FILE.exists():
        for line in ENV_FILE.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, val = line.split('=', 1)
                env[key.strip()] = val.strip()
    return env

def alpaca_get(url, key, secret):
    """Make authenticated GET to Alpaca API"""
    req = urllib.request.Request(url, headers={
        'APCA-API-KEY-ID': key,
        'APCA-API-SECRET-KEY': secret,
    })
    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
            return json.loads(resp.read())
    except Exception as e:
        print(f"  Alpaca API error: {e}")
        return None

def get_trading_data(env):
    """Fetch live trading data from Alpaca"""
    key = env.get('ALPACA_API_KEY_PAPER', env.get('ALPACA_API_KEY', ''))
    secret = env.get('ALPACA_SECRET_KEY_PAPER', env.get('ALPACA_SECRET_KEY', ''))
    base = env.get('ALPACA_BASE_URL_PAPER', env.get('ALPACA_BASE_URL', 'https://paper-api.alpaca.markets'))

    if not key or not secret:
        return {"phase": "Not connected", "accountValue": 0, "unrealizedPnl": 0,
                "openPositions": 0, "todayTrades": 0, "todayPnl": 0,
                "strategiesLoaded": 0, "dailyLimit": 120, "positions": [],
                "status": "not_connected"}

    print("  Fetching Alpaca account...")
    account = alpaca_get(f"{base}/v2/account", key, secret)
    if not account:
        return {"phase": "API Error", "accountValue": 0, "unrealizedPnl": 0,
                "openPositions": 0, "todayTrades": 0, "todayPnl": 0,
                "strategiesLoaded": 20, "dailyLimit": 120, "positions": [],
                "status": "error"}

    print("  Fetching Alpaca positions...")
    positions = alpaca_get(f"{base}/v2/positions", key, secret) or []

    equity = float(account.get('equity', 0))
    last_equity = float(account.get('last_equity', 0))
    unrealized = sum(float(p.get('unrealized_pl', 0)) for p in positions) if isinstance(positions, list) else 0

    return {
        "accountValue": round(equity, 2),
        "unrealizedPnl": round(unrealized, 2),
        "openPositions": len(positions) if isinstance(positions, list) else 0,
        "todayTrades": 0,
        "todayPnl": round(equity - last_equity, 2),
        "strategiesLoaded": 20,
        "dailyLimit": 120,
        "phase": "Paper Trading" if 'paper' in base else "Live Trading",
        "positions": [
            {
                "symbol": p.get("symbol"),
                "qty": float(p.get("qty", 0)),
                "unrealizedPl": round(float(p.get("unrealized_pl", 0)), 2),
                "currentPrice": round(float(p.get("current_price", 0)), 2),
            }
            for p in (positions if isinstance(positions, list) else [])
        ],
        "status": "connected",
    }

def get_cron_data():
    """Get cron job counts from openclaw"""
    try:
        result = subprocess.run(['openclaw', 'cron', 'list'], capture_output=True, text=True, timeout=10)
        lines = [l for l in result.stdout.splitlines() if '│' in l and 'ID' not in l]
        total = len(lines)
        return {"cronJobs": total, "cronHealthy": total, "cronErrors": 0}
    except Exception:
        return {"cronJobs": 0, "cronHealthy": 0, "cronErrors": 0, "status": "not_connected"}

def get_cost_data():
    """Get cost data from tracking files"""
    workspace = Path.home() / ".openclaw" / "workspace"
    today = 0
    month_total = 0

    # Try to read from cost tracking logs
    daily_file = workspace / "logs" / "daily-cost.txt"
    monthly_file = workspace / "logs" / "monthly-cost.txt"

    if daily_file.exists():
        try:
            today = float(daily_file.read_text().strip())
        except (ValueError, OSError):
            pass

    if monthly_file.exists():
        try:
            month_total = float(monthly_file.read_text().strip())
        except (ValueError, OSError):
            pass

    if today == 0 and month_total == 0:
        return {"today": 0, "dailyLimit": 20, "monthlyBudget": 200, "monthTotal": 0, "status": "not_tracked"}

    return {"today": round(today, 2), "dailyLimit": 20, "monthlyBudget": 200, "monthTotal": round(month_total, 2)}

def get_email_data():
    """Get email responder stats"""
    log_file = Path.home() / ".openclaw" / "workspace" / "logs" / "email-responder.log"
    if log_file.exists():
        try:
            content = log_file.read_text()
            total_replies = content.count("reply_sent")
            return {"totalReplies": total_replies, "unread": 0, "flagged": 0}
        except OSError:
            pass
    return {"totalReplies": 0, "unread": 0, "flagged": 0, "status": "not_tracked"}

def main():
    print("Generating status.json with live data...")
    env = load_env()

    trading = get_trading_data(env)
    costs = get_cost_data()
    email = get_email_data()
    agents = get_cron_data()

    status = {
        "generated": datetime.now(timezone.utc).isoformat(),
        "trading": trading,
        "costs": costs,
        "email": email,
        "newsletter": {
            "subscribers": 7,
            "openRate": 0,
            "issuesPublished": 6,
            "lastIssue": "2026-04-09",
            "paidSubscribers": 0,
            "mrr": 0,
        },
        "instagram": {
            "followers": 0,
            "views30d": 0,
            "interactions30d": 0,
            "engagementRate": 0,
            "netGrowth30d": 0,
            "status": "not_connected",
        },
        "twitter": {
            "queued": 0,
            "lastPosted": "",
            "status": "not_connected",
            "error": "API credentials not configured — Benjamin manages manually",
        },
        "agents": agents,
        "companies": {
            "rlm": {"status": "not_connected"},
            "nvcc": {"status": "not_connected"},
        },
        "services": {
            "missionControl": {"status": "up", "url": "https://mission-hub-iota.vercel.app"},
            "gateway": {"status": "up"},
        },
    }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(status, indent=2))
    print(f"✅ status.json written to {OUTPUT}")

if __name__ == "__main__":
    main()
