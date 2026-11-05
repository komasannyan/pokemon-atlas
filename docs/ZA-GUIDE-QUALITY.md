# Legends: Z-A guide — data quality audit (0.9.3)

Internal verification notes. This is **not** part of the public-facing README.

## Walkthrough coverage

- Base-game story: **42/42** main missions have multi-step instructions in `ZA_MAIN_STEPS`.
- Base-game side missions: **119/119** have multi-step instructions. The UI selects the existing personally reviewed detailed steps, then mission-specific clarifications, then the new `ZA_BASE_DEEP` entries for the 59 remaining short-only records.
- Mega Dimension story: **14/14** DLC main missions have detailed step sequences in `ZA_DLC_STORY_DEEP`.
- Mega Dimension side missions: **81/81** (IDs 120–200) have multi-step instructions in `ZA_DLC_DEEP`. Important mission-specific unlocks are supplied by `ZA_DLC_UNLOCKS`.
- **Eight-stage 100% completion route** guides first-time players through the main plot, Z-A Royale, postgame, DLC and completion audit. It provides related mission jumps.
- **17 additional troubleshooting topics** cover missing markers, story/DLC unlocks, Pokémon encounters, recipes, special scans, EX event requirements and endgame.
- Global search covers mission numbers and natural-language problem keywords; cards show linked related missions and provide source links when available.
- Existing completion and step-progress localStorage keys remain in use.

## Catalog retained from version 0.9.2

- 119 base-game sides with named starting places, rank/unlock data, rewards and at least 118 specific NPC/location hints. Sources: [Gamer Guides](https://www.gamerguides.com/pokemon-legends-z-a/guide/side-missions/overview/), [Pokémon GO Hub](https://pokemongohub.net/post/guide/legends-z-a-all-side-missions/).
- 20 Wild Zones with rosters and story unlocks aligned to [Serebii](https://www.serebii.net/legendsz-a/wildzones.shtml).
- 179 recorded specific appearances, including 39 Alpha records, drawn from [Pokémon GO Hub](https://pokemongohub.net/post/guide/all-wild-zones-pokemon-legends-z-a/).
- 160 TM IDs, including independently checked DLC TM acquisition methods (31 shard-shop entries and 22 missions) and 53 DLC TM records, sourced to [Serebii](https://www.serebii.net/legendsz-a/tm.shtml) and [PsyPokes](https://www.psypokes.com/plza/mdtm.php).

## Verification and build

- Run `node tests/za-guide-092.mjs` and `node tests/za-guide-093.mjs`.
- Workflow `.github/workflows/guide-validation.yml` validates both test suites and JavaScript syntax on guide-relevant pushes to main.
- `index.html`, `src/i18n.js`, `src/app.js` and `sw.js` now carry a **0.9.3** indicator/cache revision. The two new handbook modules are part of the offline shell preload.

## Remaining limitations — do not advertise "100% verified" yet

- A multi-step entry does **not** mean every turn, NPC dialogue, battle roster, enemy moveset or exact coordinate was independently reproduced in-game. Many entries summarize established mission objectives and starting NPC information from external sources.
- The 179 micro-location records are **not** a full spawn-coordinate database, and do not supply verified encounter rates or every Alpha variant.
- Important unexplored depth remains in item routes, optional collections, full opponent rosters, recipe optimization and the form-specific Pokédex. Some English start-location hints remain untranslated.
- Some guidance is advisory (e.g. battle type matchups) rather than uniquely prescribed in-game solutions.
- Previously checked step indices stored in localStorage are retained, but if a guide's step list has changed, individual step ticks may refer to a different step. Completed-mission flags are preserved.
- Published GitHub Pages content and actual user-device caching/deployment are not established by CI alone. Verify the live site separately before calling the release deployed.
- EX events and Mystery Gifts are subject to real availability; a checklist should distinguish inaccessible events from permanently obtainable missions.

The release is a **complete numbered mission index with multi-step descriptions**, not a fully playtested exhaustive 100% walkthrough. The next substantive improvement should prioritize path/coordinate screenshots or maps and individual mission playthrough verification instead of bulk filler text.
