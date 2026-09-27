#!/usr/bin/env bash
# Cloud-schedule wrapper for the 5-min forward-test.
# Cloud agent runs a fresh git clone each fire, so state (the JSON log) must be
# pulled before and pushed after each run. This keeps the scorecard accumulating
# across cloud runs.
#
# ponytail: git-as-state-store. Fine at 1 write/5min; if cadence ever grows or
# runs overlap, move the log to a real store (KV / gist API) instead.
set -euo pipefail

cd "$(dirname "$0")/.."   # repo root

LOG=scripts/forecast_live_log.json

git fetch origin forecast-log
git checkout forecast-log
git pull --rebase --autostash origin forecast-log || true   # get latest log; tolerate first run

python3 scripts/forecast_live_tick.py

# Only commit if the log actually changed
if ! git diff --quiet -- "$LOG" 2>/dev/null; then
  git add "$LOG"
  git commit -m "forecast: live tick $(date -u +%H:%M:%S)UTC"
  git push origin forecast-log
fi
