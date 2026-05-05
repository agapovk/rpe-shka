# RPE-shka

## Overview

RPE-shka is a local-first workload tracking app for sports teams. Coaches record players’ Rate of Perceived Exertion (RPE) and session duration after each training or match, and the app automatically calculates session load (sRPE).

Sessions are organized into **microcycles** — named containers of sessions, typically representing the preparation period leading up to a match (e.g., “vs. Spartak”) and ending with a session categorized as MD. Microcycles can also represent non-match blocks such as pre-season, off-season, or international breaks. They have variable length and serve as the unit of aggregation for workload reporting.

The system is designed for fast, in-person data collection (often offline), lightweight team management, and structured reporting. Over time, it enables consistent workload tracking and export of clean datasets for further analysis.

---

## Goals

1. Record RPE and duration for all players quickly, in the field, post-session.
2. Compute session load (sRPE) automatically from RPE and duration.
3. Organize sessions into microcycles — free-form named blocks of variable length, typically between matches.
4. Support multiple teams per coach, with custom session categories (MD-4, MD-3, …, MD).
5. Provide microcycle summaries and exports (PDF, CSV, XLSX).
6. Work fully offline with reliable local persistence.

---

## Core User Flow

1. Coach opens the app (no internet required).
2. Coach selects or creates a team.
3. Coach creates a new microcycle (e.g., named after the upcoming opponent).
4. Inside the microcycle, coach creates a training or match session.
5. Coach assigns a session category (e.g., MD-4, MD-3, MD, Recovery).
6. Coach goes through players and records RPE (1–10) for each.
7. Coach inputs session duration.
8. App automatically calculates sRPE for each player.
9. Session is saved locally within the microcycle.
10. Coach views microcycle workload summaries.
11. Coach exports reports (PDF / CSV / XLSX) and shares them externally.

---

## Features

### Team Management

* Create and manage multiple teams.
* Add, edit, and remove players within each team.
* Local-first storage (no required authentication).

---

### Microcycle Management

* Create microcycles as the top-level container for sessions.
* Name microcycles freely (e.g., upcoming opponent, “Pre-season W1”, “Off-season”).
* Variable length — no fixed week boundary; a microcycle can span any number of days.
* Match days are recorded as regular sessions with category MD inside the microcycle.
* All sessions belong to exactly one microcycle and inherit its team context.
* Microcycle start/end dates are derived from the dates of contained sessions (no separate manual range to keep in sync).
* Browse, edit, and archive past microcycles.

---

### Session Tracking

* Create training or match sessions inside a microcycle.
* Inputs: session duration, player RPE (1–10).
* sRPE is computed automatically: `sRPE = RPE × duration`.

---

### Session Categorization

* Create and manage custom session categories:

  * Examples: MD-4, MD-3, MD-2, MD-1, MD, MD+1, Recovery, Adapt
* Assign category to each session.
* Enable filtering and comparison by category.

---

### Microcycle Reporting

* Aggregated workload per microcycle, per player:

  * Total duration
  * Average RPE
  * Total sRPE
* Team-level summaries for the microcycle.
* Breakdown by session category (MD-4, MD-3, …, MD).
* Compare metrics across past microcycles for the same team.

---

### Data Export

* PDF (readable report), CSV (raw data), XLSX (structured analysis).
* Two scopes: a single session, or an entire microcycle.
* Generated on-device; shared via standard browser download.

---

## Scope

### In Scope

* Local-first mobile application
* Team and player management
* Microcycle creation and management
* Session creation and RPE input within a microcycle
* sRPE calculation
* Custom session categories (MD-4, MD-3, …, MD, Recovery, etc.)
* Microcycle summaries
* Data export (PDF, CSV, XLSX)
* Multi-team support per coach
* Responsive layout (mobile-first, usable on desktop)

---

### Out Of Scope

* AI insights or recommendations
* GPS or external tracking integrations
* Wearables integration
* Billing or subscription systems
* Multi-role collaboration inside the app
* Cloud sync (at initial stage)

---

## Success Criteria

1. A coach can create a team and add players in under 2 minutes.
2. A full team’s RPE can be recorded in under 1–2 minutes post-session.
3. Sessions are reliably stored and accessible offline.
4. Exported reports are usable in external analysis tools.
5. The app stays fast and usable in real-world field conditions.
