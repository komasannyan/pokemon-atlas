# Pokémon Atlas — full-project baseline audit
**Date:** 2026-11-05  
**Audited branch:** `main`  
**Baseline HEAD before this audit:** `36f59832366cc99266f67e2a99ebebe6bfc59eee`  
**Current public version:** 0.9.3 (as labeled in source)  
**Audit scope:** Z-A guide + Pokémon encyclopedia + infrastructure + visual-design foundations.  
**Nature of work:** static repository inspection, catalog consistency review and targeted comparison with game reference sources. No live gameplay, visual-browser session, network performance benchmark, or complete game-by-game truth verification was performed.

## Release policy (decided by project owner)

**Version 1.0 is NOT the next guide release.** It is gated on **ALL THREE**:
1. An accurate, sufficiently detailed, nearly self-contained Z-A and Mega Dimension guide.
2. Substantial Pokédex improvement, including forms, game-specific move legality/availability, locations and bilingual source transparency.
3. A coherent professional visual redesign, usability, responsiveness and accessibility verification.

Passing a data-count assertion, merging content, or incrementing a version number cannot independently satisfy this gate.

## Audited baseline (counts are from repository files; not completeness claims)

| Area | Present in code | Critical limitation |
|---|---:|---|
| Base-game main missions | 42 / 42 IDs | Mean **44.1 words** of mission-specific steps; 34 of 42 contain fewer than 60 words |
| Base-game side missions | 119 / 119 IDs | Mean **29.4 words**; 112 of 119 have fewer than 40 words |
| DLC main missions | 14 / 14 IDs | Short objective summaries; no independent full battle/team audit |
| DLC side missions | 81 / 81 IDs (120–200) | Mean **32.0 words**; 67 of 81 have fewer than 40 words |
| Known special DLC side prerequisites | 23 of 81 have records in `ZA_DLC_UNLOCKS` | Missing structured record is NOT proof no special prerequisite exists |
| Base side starts | 118 of 119 have a starting NPC/location hint | ID 119 lacks a specific `start` field in the verified catalog |
| Wild Zones | 20 | Area rosters are not a precise encounter map |
| Wild Zone roster entries | 225 across 20 zones, 171 unique names | Entry counts are not the number of fully mapped/independently obtainable species |
| Described encounter spots | 179, of which 39 are Alpha-labeled | No full spawn-coordinate/condition/rate table; Zone 20: **73 roster entries**, only **15 spot records** |
| TM index | 160 | Many entries do not have entry-point-to-TM routes |
| Mega Stone cards in `ZA_MEGA` | **31** | Serebii / PowerPyx list far more; PowerPyx counts **62 base-game** Mega Stones alone |
| Special donut records | 5 | Flavor minima are not complete verified ingredient combinations |
| Z-A regional dex data | 232 IDs for dex 34; 132 IDs for dex 35 | Regional dex membership is not encounter, transfer or evolution availability |
| Dedicated CI | 2 Z-A test scripts and 5 explicit JS syntax checks | No full-project integration / rendered UI / playthrough verification |

Note: prose length is a **weak depth proxy**, not a substitute for reading or verifying individual steps. It is useful for locating the suspiciously thin majority of mission cards.

## Severity definitions

- **P0 — release blocking**: demonstrable wrong player guidance; test process can report green while critical failure is not exercised; potential user progress confusion.
- **P1 — major gap**: a player will regularly need an external guide; important missing/ambiguous data or broken product feature.
- **P2 — improvement/tech debt**: important to polished 1.0 quality but not necessarily a guide-stopping factual error.
- **EVIDENCE**: `confirmed` = reproducible code/data inconsistency, `source cross-check` = verified against a named game reference, `needs hands-on` = requires browser or gameplay validation.

## P0: confirmed blockers

### AUD-001 — Absolite obtained in mission 9, but item card says mission 10
- Files: `src/za-items-data.js` (`ZA_MEGA` Absolite entry), `src/za-walkthrough-details.js` (mission 9).
- Current item card: «Завершение сюжетного события, миссия 10».
- Story guide: fight Rogue Mega Absol in **main mission 9** and obtain Absolite.
- Verified independently: [Serebii mission 9](https://www.serebii.net/legendsz-a/mainmissions/chasethatmysteriouspokemon.shtml), [Bulbapedia part 9](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Legends:_Z-A/Part_9).
- **Fix:** mission 9 in item catalog, then add a cross-catalog assertion of acquisition IDs.
- Evidence: **confirmed + source cross-check**.

### AUD-002 — old test expectations are known stale, but are omitted from CI
- Files: `tests/localization.mjs`, `tests/atlas-06.mjs`, `index.html`, `sw.js`, `.github/workflows/guide-validation.yml`.
- Both old tests assert `app.js?v=061` / `atlas-shell-v061`; current source uses `v=093` / `atlas-shell-v093`.
- Thus these assertions are incompatible with the current app. The CI workflow runs only `za-guide-092.mjs`, `za-guide-093.mjs`, plus five JS syntax checks; it **does not run** these known-stale suites, smoke, team, or Pokédex tests.
- **Fix:** replace brittle string-version expectations with shared version metadata or semantic asset checks; run all maintained suites as part of CI. The stale tests are expected to fail if run against this source; not executed in the audit environment.
- Evidence: **confirmed static contradiction**.

### AUD-003 — the same generic «blue quest marker» directions are prepended to ALL DLC side missions
- File: `src/guides-v09.js` `objectiveSteps()`.
- Code unconditionally inserts «На карте найди голубой маркер побочного задания №… рядом с …» for `side` AND `dlc-side` entries.
- DLC mission **139** is reached via a **Hyperspace portal**, which can appear as a special yellow portal, not an ordinary blue side-mission map marker; see [Nintendo Life](https://www.nintendolife.com/guides/pokemon-legends-z-a-mega-dimension-all-new-dlc-mega-evolutions) and [Dexerto](https://www.dexerto.com/wikis/pokemon-legends-z-a/all-hyperspace-side-missions-walkthrough-in-mega-dimension-dlc/).
- **Fix:** separate quest-entry instruction by mechanism (map NPC, distortion/portal, postgame encounter, gift), and suppress generalized location hints when inapplicable.
- Evidence: **confirmed structural defect + source cross-check**.

## P1: must fix for a self-contained guide

### AUD-004 — numbered coverage ≠ actionable walkthrough
- Files: `src/za-main-data.js`, `src/za-side-data.js`, `src/za-dlc-all-side.js`, `src/za-base-handbook.js`, `src/za-guide-handbook.js`, `src/za-walkthrough-details.js`.
- Every quest ID is present, but most mission-specific instructions are only 2–4 short steps. Many say «поговори», «следуй за маркером», «победи», without a full from-landmark route, coordinates/level, special conditions and what to do when stuck.
- **Fix:** for every entry require unlock, exact start, full route including vertical access, objective sequence, branch differences, failure recovery, rewards and cross-links; mark unknown facts explicitly. Avoid adding generic filler.
- **Acceptance:** manual review for each of the **256** base/DLC story/side mission cards.

### AUD-005 — prerequisite graph is incomplete
- Files: `src/za-side-locations.js`, `src/za-verified-catalog.js`, `src/za-guide-handbook.js`.
- Only **23/81** DLC sides have additional structured prerequisites; missing conditions may be ordinary or unknown. Base verified side #119 lacks starting-person hint. Base #31/#32/#116 have nonstandard dependencies represented separately.
- **Fix:** build structured `unlock: {mainMission, sideMissions, dlcMission, rank, dayNight, special}` for ALL records; use `not_required` vs `unknown` explicitly; validate topological consistency.
- **Acceptance:** player can see why any absent quest marker/portal is not available.

### AUD-006 — the catalog of Mega Stones is very incomplete
- File: `src/za-items-data.js` contains **31** selected stones, not a complete index.
- External catalog: [Serebii Mega Stones](https://www.serebii.net/legendsz-a/megastones.shtml); [PowerPyx 62 base-game stones](https://www.powerpyx.com/pokemon-legends-z-a-all-mega-stones-locations/), plus later DLC/other distribution mechanisms.
- **Fix:** full stone registry, variant, source, cost, story threshold, missability/online/event status and linked Pokémon.
- **Acceptance:** no game-available stone silently absent from Items.

### AUD-007 — Pokémon acquisition is not a unified source of truth
- Files: `src/data.js`, `src/collection-games.js`, `src/locations-v09.js`, `src/za-data.js`, `src/za-wild-spawns.js`.
- National Dex and game membership rely primarily on PokéAPI; the Z-A guide uses hand-maintained encounter/quest catalogs. The availability UI correctly warns that a regional dex entry is not capture proof, but does not give a fully unified method-per-species Z-A entry.
- Wild Zones: 20 rosters, 179 observations, 39 Alpha observations. **Zone 20 has 73 names and only 15 detailed spot observations**. No full levels, conditions, special encounters, quests, gifts, exchanges, Hyperpace, and evolution path coverage for all available species.
- **Fix:** a keyed species/form/acquisition data model with game scope, method, exact area, unlocks, day/night, confirmed source and confidence; use the SAME model in Pokédex, guide, and collection tracker.
- **Acceptance:** query any species/form and retrieve all documented Z-A acquisition methods with transparent unknowns.

### AUD-008 — incomplete TM routes, evolution items and donut recipes
- Files: `src/za-tms-complete.js`, `src/za-tms-enriched.js`, `src/za-items-data.js`, `src/za-guide-extras.js`.
- 160 TM IDs exist; shop prices/quest ID lookup for DLC are documented but not all findable TMs have roof access directions. Special donut entries record five flavor thresholds; a threshold is not a verified exact berry combination.
- **Fix:** each TM with obtainable method, map-level landmark, building entrance and roof route; every required evolution item with acquisition paths; special donuts with reproducible checked ingredient sets and recipe unlock rules.
- **Acceptance:** no need to leave Atlas to locate TM or satisfy a story donut recipe.

### AUD-009 — opponent team data and battle-specific help are patchy
- Files: `src/za-walkthrough-details.js`, `src/za-guide-handbook.js`.
- Boss tactics include type weaknesses and a selection of move-counterplay, but the guide lacks structured complete opponent rosters, levels, moves, lead order and variant dependent on selected starter for every relevant battle.
- **Fix:** opponent registry keyed to mission/event, specific team variants, level, moves, battle restriction, item/reward, safe practice tips, source.
- **Acceptance:** full key battles can be prepared for without searching another website.

### AUD-010 — guide language switch changes chrome, not mission content
- File: `src/guides-v09.js`; most `steps` strings in `src/za-*.js` are Russian-only.
- `tx(ru,en)` is used for labels but not to supply distinct translated mission steps; selecting English still leaves Russian body paragraphs. A few descriptions are precomputed at module import time, preventing later language switching.
- **Fix:** every translatable field as `{ru,en}` or locale registry, including names where useful, route steps, help, warnings, and unlocks. Snapshot-test both languages.
- **Acceptance:** no Russian-only gameplay instruction when EN is selected (except intentional proper names).

### AUD-011 — progress checkbox indices are unstable on content edits
- File: `src/guides-v09.js`, `stepKey(x,i)` based on step index rather than stable step ID.
- When step ordering changes across updates, an old checked box can refer to a different step. Completed mission status uses separate stable keys and is preserved.
- **Fix:** stable per-step IDs and migration from old index records; never silently lose or misattribute user progress.
- **Acceptance:** regression test from real 0.9.2/0.9.3 localStorage fixtures.

## Pokédex-specific blockers for version 1.0

### AUD-012 — Legends: Z-A move learnsets and mechanics lack dedicated integration
- Files: `src/constants.js` `GAME_GROUPS`, `src/app.js` `state.moveGame`, `src/moves.js`.
- The move version-group selector currently ends at **Scarlet / Violet**: no Z-A option in `GAME_GROUPS`. Default selected move game is `scarlet-violet`.
- Most underlying move descriptions come from cross-generation generic PokéAPI records; mechanics can vary by game, especially Z-A's real-time combat.
- **Fix:** separate move learnsets and live-game effects/cooldown data by actual source and game; clearly distinguish unknown move availability from impossible moves.
- **Acceptance:** an accurate Z-A-specific Pokémon move page where data exists, with honest unknown indicators otherwise.

### AUD-013 — live external data and cache lifecycle lack explicit source-version management
- Files: `src/data.js`, `src/api.js`, `src/moves.js`, `src/abilities.js`.
- National Dex loads multiple remote CSVs + a Russian name list; move/ability pages load additional remote tables and API requests. Cache accepts a national dex with >=1000 species and stores it under a long-lived v1 key without a publication/sync date or upstream refresh path in the UI.
- **Fix:** pin verified snapshots with sync metadata, provide refreshing/offline behavior, detect missing game updates and degrade gracefully; add schema tests and image fallback verification.
- **Acceptance:** data freshness and loading failures are intelligible, resilient and independently testable.

### AUD-014 — bilingual content consistency and provenance
- Files: `src/moves.js` (~59 manually mapped Russian move names), `src/effects-ru.js`, `src/abilities-ru-expanded.js`, `src/translate-ru.js`.
- Manual Russian ability text coverage is strong, but many move names/effects rely on generic English or on-demand machine translation; machine translations are not canon verified.
- **Fix:** maintain complete bilingual strings for supported scope and per-field provenance/status (checked vs machine vs unavailable); game-specific effects and exceptions.
- **Acceptance:** EN/RU switch provides consistent labels and appropriate source warnings.

## UX, design and delivery blockers for version 1.0

### AUD-015 — presentation architecture is fragmented
- Files: **seven** imported CSS files: `styles.css`, `styles-v02.css`, `styles-v03.css`, `collection.css`, `pokedex-v08.css`, `styles-v09.css`, `styles-guide-full.css`; large `src/app.js` and HTML-string generated cards.
- **Fix:** design tokens, typography, layout grid, responsive spacing, composable components, typography/contrast/focus rules, consistent mobile/tablet/desktop view.
- **Acceptance:** deliberate visual redesign verified with screenshots and manual device-width review.
- **Evidence limitation:** a static code audit **does not** establish what looks good/bad on a rendered page.

### AUD-016 — source links and search need semantic upgrades
- File: `src/guides-v09.js`.
- Search is a normalized substring match plus limited number handling, not a question-answer system. Most mission source links resolve to overview pages rather than unique mission evidence. Free-form queries and Russian/English synonyms are not systematically validated.
- **Fix:** synonyms, entities (Pokémon, items, missions), indexed questions, ranking/filters; deep source references per mission.
- **Acceptance:** a 50+ query test set (including unknown quest names, wrong floor, item aliases, missing markers) returns relevant cards at top.

### AUD-017 — current PWA fallback is too generic
- File: `sw.js`.
- For **any** same-origin request failing over network, the service worker attempts a cached asset then falls back to `index.html`, even for JS/CSS/JSON requests. Returning HTML for a missing module/JSON resource is invalid and makes diagnosis confusing.
- **Fix:** navigation-only HTML fallback; for asset requests return a cached matching file or an explicit failure response. Test both online and offline updates.
- **Acceptance:** offline read-only shell works and missing scripts never receive HTML instead.

### AUD-018 — deployment verification and test coverage are incomplete
- Files: `.github/workflows/guide-validation.yml`, `.github/workflows/pages-recovery.yml`, `tests/*`.
- Guide CI checks only a subset. A special recovery workflow contains a hard-coded GitHub Pages deployment ID from Nov 4 rather than a general deploy pipeline. Live GitHub Pages could **not** be inspected through this audit's web access; do not claim published site is identical to `main`.
- **Fix:** universal test workflow, deterministic build/deploy checks, a minimal browser E2E test, dead-link checks, smoke test against published assets, remove one-off recovery once confirmed unnecessary.
- **Acceptance:** passing CI AND verified live deploy.

## Proposed execution dependency order

1. **Data invariants first (AUD-001/002/003):** incorrect guides and CI false confidence need correction before expansion.
2. **Guide schema/unlocks (AUD-004/005/009/016):** make accuracy and source validation enforceable, then enrich all 256 missions.
3. **Cross-reference data catalogs (AUD-006/007/008):** species / forms / encounter methods / stones / TM / recipes share sources.
4. **Pokédex-specific work (AUD-012/013/014):** proper game-aware data, caching, localization.
5. **Design/UX (AUD-010/011/015/016/017):** redesign after content schema stabilizes, while preserving compatibility.
6. **Full CI + release gate (AUD-018):** test all components and verify live Pages; only then discuss 1.0.

## Mandatory acceptance schema for each mission

- Stable ID, exact English name, display RU/EN title.
- Main and optional unlocks with provenance.
- NPC name, exact start location, nearest practical entrypoint, floor/roof/hyperspace status and directions.
- Ordered **uniquely identified** steps, exact target locations, branch-dependent steps and common gotchas.
- Required Pokémon/moves/items, trainer rosters, boss levels and move tactics where relevant.
- All concrete rewards and next/unlocked quests.
- Source page URL(s) per factual step, last checked date, verification status `verified` / `source-only` / `unknown`.
- Search aliases / synonyms and internal deep links; coherent RU/EN.
- Two passes: content audit + UI test. No generic `follow the marker` as the only navigation instruction.

## What was and was not performed in this audit

**Performed:** repository tree review, guide/Pokédex/UI code inspection, structural counts and step-length checks, known contradiction and stale-test identification, reference spot checks against Serebii/Bulbapedia/Nintendo Life/PowerPyx.

**Not performed:** real-game playthrough for 256 missions, visual screenshot audit, GitHub Pages production browser test, full Pokédex acquisition truth comparison, runtime execution of every test suite. Keep these as pending validation rather than marking them completed.

## Sources consulted

- [Serebii — main missions](https://www.serebii.net/legendsz-a/mainmissions.shtml)
- [Serebii — individual mission 9](https://www.serebii.net/legendsz-a/mainmissions/chasethatmysteriouspokemon.shtml)
- [Serebii — all Mega Stones](https://www.serebii.net/legendsz-a/megastones.shtml)
- [Serebii — side missions](https://www.serebii.net/legendsz-a/sidemissions.shtml)
- [Bulbapedia — Rogue Mega](https://bulbapedia.bulbagarden.net/wiki/Rogue_Mega)
- [Bulbapedia — main mission 9 walkthrough](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Legends:_Z-A/Part_9)
- [Nintendo Life — Mega Dimension Mega Evolutions](https://www.nintendolife.com/guides/pokemon-legends-z-a-mega-dimension-all-new-dlc-mega-evolutions)
- [Dexerto — Mega Dimension side missions](https://www.dexerto.com/wikis/pokemon-legends-z-a/all-hyperspace-side-missions-walkthrough-in-mega-dimension-dlc/)
- [PowerPyx — base-game 62 Mega Stones](https://www.powerpyx.com/pokemon-legends-z-a-all-mega-stones-locations/)
