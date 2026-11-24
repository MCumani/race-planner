# Cumani Racing — Race Planner

Pick a horse and see every upcoming race it's eligible for, filtered by age, sex, class, rating band, distance and date.

**Live site:** https://mcumani.github.io/race-planner/

On iPhone: open the link in Safari → Share → **Add to Home Screen** to get an app icon.

## What's here

| File | What it is |
|---|---|
| `index.html` | The planner page |
| `data/races.csv` | Race calendar — the racing.com Race Planner "Download CSV" export, unchanged |
| `data/horses.csv` | Horses: Name, Age, Sex, Rating (blank = maiden), In Work (Yes/No), Breeding |
| `assets/targets.js` | Builds the targets sheet (PDF via print, and .xlsx) |
| `assets/` | Logo and icons |
| `tools/build_horses.py` | Builds `data/horses.csv` from the CRHorses sheet |

Everything in this repository is public. Only put public information in `data/`.

## Refreshing the data

**Race calendar** — download the CSV from racing.com's Race Planner, rename it `races.csv`, then in this repo open the `data` folder → **Add file → Upload files** → drop it in → **Commit changes**. The site updates within a couple of minutes.

**Horses** — update CRHorses (SharePoint › Training & Analysis › Racing Calender) and ask Claude to refresh the planner. The rules it applies:

- Unnamed horses (`xDam` or `x Dam` — lowercase x then a capital) are left out.
- The bracketed dam/sire after the name is removed.
- Sex and age come from the ID, e.g. `(b,g 54/2)` → gelding, born 2022. Age rolls over on 1 August.
- BM rating: a number = rated; blank, `-` or a note such as `BD` = maiden.
- In work = Loc. is 1–42.
- Breeding = the bracket after the name (`(Sire x Dam)` as is; `(xDam)` becomes `x Dam`).

## Eligibility rules used by the page

Age and sex from the race's Age/Sex conditions; Maiden only if wins = 0; Class N if wins ≤ N; BMxx within the BM range (default rating −4 to +6); `0 - xx` needs rating ≤ xx; `RTGxx+` needs rating ≥ xx. Maidens default to maiden races; rated horses to BM and open races (plus Group/Listed at 85+).

## Targets sheet (PDF / Excel)

Tick the races, then menu → **Targets sheet**. Check the heading, breeding, preparation and BM rating, give each race a path (1 Ambitious, 2 Expected, 3 Possible, - Alternative; combine like `1,2`) and edit race names if needed. **PDF / Print** opens the sheet and the print dialog (choose Save as PDF); **Download Excel** saves a formatted .xlsx. Trials go first in italics; races are grouped Spring (Sep–Nov), Summer/Autumn (Dec–May), Winter; interstate races are coloured by state. Paths, edited names and breeding are remembered per horse on that device.
