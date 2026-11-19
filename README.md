[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/10THWAVE-LAB/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/10THWAVE-LAB/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Legend — GTA VI Trophy Guide & Tracker

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden), built for the [make.fun GTA 6 trophy guide bounty](https://make.fun/bounty/gta6-trophy-guide-01).

## What it does

- **Checklist tracker** — every trophy with its official name, description and grade, a checkbox, and progress saved in the browser (localStorage), exportable to a file and importable back.
- **Guides in its own words** — each trophy has a guide written for this entry, citing the public guides, wikis and tracker pages its facts come from (PowerPyx, GTABase, Push Square, Exophase/PSNProfiles lists and more). Sources are linked, never copied. Where launch-era guides had no confirmed method, the guide says so honestly.
- **Roadmap to the platinum** — four stages built from the official descriptions: the story (60–80 hours), side stories (~10 hours), the 100% grind (~100 hours), then cleanup. About 200 hours in all, one playthrough, no online trophies.
- **Missable flag** — the one trophy that may be missable, Positive Mental Attitude (a Chapter 1 meditation at Jason's house), is flagged on its card, in the roadmap, and in a warning bar.
- **Filters and search** — by kind (story, missable, collectibles, activities, side stories, robberies, misc), by grade, by earned state, plus search by name.
- **Spoiler setting** — hides the names and descriptions of the 12 story trophies until they are earned.
- **Progress summary** — earned count, percent to platinum, per-grade counts, and Gamerscore (out of 1,000G).
- **Fully offline** — static files under `app/`, no build step, no network requests at run time. Every guide's source is a plain link, opened only if the reader follows it.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in desktop Chrome. It works with the network off.

## Layout

- `app/index.html` — the page shell
- `app/style.css` — the original sunset-over-the-bay look (pure CSS, no game artwork)
- `app/data/trophies.json` — the 55 trophies: official names/descriptions/grades, plus each guide, its cited sources, kind, roadmap stage, count and Gamerscore
- `app/app.js` — boot, state and hash routing
- `app/tracker.js` — checklist and progress rendering
- `app/render.js` — trophy cards and the progress summary
- `app/filters.js`, `app/search.js`, `app/spoiler.js` — filtering, search, spoiler masking
- `app/roadmap.js` — the four-stage roadmap to the platinum
- `app/storage.js` — localStorage, export and import
- `screenshots/` — 4 screenshots taken of the real app running in Chromium

## Notes

An unofficial fan guide, not affiliated with or endorsed by Rockstar Games or Take-Two Interactive. No Rockstar logo, artwork or game imagery is used anywhere.

Referral code: `fnrz5qxg`
