# Pokémon Legends: Z-A guide — quality and scope (0.9.5)

**Status:** session 3 (base-game side missions) integrated and automated tests expanded. **This is not version 1.0** and not a claim that every mission was independently playtested.


## Side missions: session 3 (November 5, 2026)

- All **119** base-game side missions (001–119) now use the unified `src/za-side-handbook.js`. The current release has **528 structured original Russian steps** in total, each quest with **at least three** steps. Existing base mission data, verified NPC/location/reward catalogs, and previous clarifications remain available for comparison.
- All entries include NPC/starting landmark, area, verified-catalog reward, starting main-story stage where the source supplies it, detailed per-quest steps, source-page links, research status and special prerequisites when known.
- Hard missions now have more concrete walkthroughs, notably #7 (Chespin rematches), #8 (five branches for Fennekin), #9 (three Froakie trial times), #12 (five Flabébé colors), #13 (three fountain shrub waves), #17 (Shiny Mareep spot), #21 (12 Spewpa positions), #30–32 (linked Mega Evolution requests), #63 (XL Gogoat), #67 (five arguments for Sylveon), #76 (all quiz answers), #82 (Water Gun), #83 (Pupitar), #93 (Heliolisk rooftop), #94 (ten 3-star restaurant rounds / 30 Pokémon), #103 (four Furfrou restaurants and final), #108 (Alolan Raichu), #118 (Gwynn follow-up route), #119 (20 Reward Matches and four Jacinthe finals).
- Game-related prerequisites link directly to main mission cards; linked side prerequisites #30→31→32 and #117→118 have side-mission jump buttons.
- **Per-step progress migration:** rewritten side quests use `side:{id}:v2:sNN` keys. Old index-based checklist records stay in browser storage but no longer silently check a different step; mission-level completion flags remain intact.
- Source quality: six Bulbapedia walkthrough ranges (1–20, 21–40, 41–60, 61–80, 81–100 and 101–119), plus existing Gamer Guides/Pokémon Database catalog records. Source-extracted text is independently paraphrased; complex entries were further reviewed. This is **source-based coverage, not an actual end-to-end 119-mission playthrough**.
- `tests/za-side-handbook.mjs` checks every mission, steps, rewards, NPC fields, source links, milestone puzzle details, cross-links and service-worker pre-cache. CI now runs **nine** test scripts along with syntax validation.

### Remaining side-quest limitations

1. **No console playtesting.** Exact timings, custom battle variants and special quest availability have not been exhaustively tested on hardware.
2. **Source granularity varies.** Some simple trainer battles need only a few steps, but rare details (precise building doorway, all hidden items, complete move/held-item data) are not universally present. Do not claim those fields are verified just because the mission number is present.
3. **RU content only.** English UI currently shows the original Russian quest steps with a notice; full translation remains a later cross-project task.
4. **Accuracy needs continuing source comparison.** Bulbapedia walkthrough pages themselves flag incomplete additions; use the citations to check any contested mechanical details. Not every line has independent second-source confirmation.
5. **Visual route verification.** No screenshot/coordinate atlas for every quest and no hands-on mobile navigation audit in this session.
6. **Live site.** Successful code tests plus Pages deployment status do not prove that every live card loads correctly on all devices; browser testing is separate.

## Main story: session 2 (November 5, 2026)

- Every base-game main mission **1–42** has a new individual structured record in `src/za-main-handbook.js` (42/42), totaling **248 ordered mission-specific steps** at the time of this report.
- Cards now show a starting landmark, unlock condition, checklist, encounters/battle preparation where applicable, common stuck-point advice, rewards when known, and reference links. Earlier concise summaries in `src/za-main-data.js` and `src/za-walkthrough-details.js` remain for compatibility.
- Especially expanded: **#14** Canari password/quiz, Mani/Tarragon/Canari matches; **#19** Ice Beam, Vanillite alternative, Clawitzer fountain, sewer puzzles; **#35** Lysandre Labs key cards/elevator and battle teams; **#37** construction scaffolds/ally encounters/Hyperrogue battle; **#38–42** non-linear postgame prerequisites and legendary catches.
- Important verified corrections: **Absolite is awarded in mission #9, not #10** (item catalog aligned); **Zygarde mission #42 can be done before finishing #39 Infinite Z-A Royale**; ordinary Abilities such as Thick Fat should not be carried over to Z-A real-time boss battle advice.
- The main story uses discrete step IDs in `state.checkedSteps` (key suffix `:v2:sNN`); *old localStorage step progress stays untouched* but cannot be mapped reliably to rewritten directions and is not automatically checked against a different step. Whole-mission completion remains intact.
- DLC distortion side missions no longer receive a universal, inaccurate blue quest-marker preamble.
- **All eight test suites** now run in `.github/workflows/guide-validation.yml`; updated legacy expectations that were incompatible with the present asset version and content. The workflow also checks every `src/*.js` module syntax and required 0.9.4 cache assets. This is structural/software verification, **not gameplay verification**.
- Version label and asset query changed to **0.9.4**, and the new story handbook is precached by the service worker.

## Existing coverage outside session 2

- **119** base-game side quests with 528 structured steps from `ZA_SIDE_HANDBOOK` (the earlier summary modules are legacy fallbacks).
- **14** DLC storyline missions; **81** DLC side quests numbered **120–200** with additional special prerequisites for 23.
- **20** Wild Zones, 179 described encounter observations (39 Alpha-labeled), **160** TM entries.
- **8** completion-roadmap stages and 17 expanded help/FAQ subjects.

## Mandatory unresolved work

1. **Direct playthrough verification:** every main step has source-based research but has not been personally reproduced in-game end to end. Some micro-routes and optional branch behavior remain source dependent.
2. **Battle accuracy:** complete teams/levels/movesets, variant teams by starter, and all individual late-boss moves are not independently verified for all 42 missions. Where provided, these are tactical explanations and source summaries.
3. **Precise navigation:** not all 42 records give exact roof/stair/door coordinates from a nearby fast-travel landmark. No verified per-step in-game screenshots yet.
4. **Language:** new walkthrough instructions are authored in Russian; when EN UI is selected, the card explicitly explains that the mission instructions currently remain Russian. True bilingual content is an upcoming project session.
5. **Sources:** some source links are mission-index pages; direct per-step links, review dates, and game-play verification metadata should be refined.
6. **Pokédex:** game-specific move availability, complete species/forms/capture methods, and the overall National Dex redesign are **not part of this release**.
7. **Other catalogs:** all Mega Stones, Evolution Items, optimization of donut recipes, wild spawn maps, and side-quest specificity are **not complete**.
8. **Live site:** a successful CI run does not establish that GitHub Pages has deployed the corresponding commit. The public deployment status must be checked separately.

## Release gate

**Pokémon Atlas 1.0** requires (a) full accurate guide, (b) substantial Pokédex work and (c) professional coherent UI redesign, each separately validated. The 0.9.4 content update does **not** satisfy that gate.

## Verification commands

```sh
for f in src/*.js; do node --check "$f"; done
node tests/za-guide-092.mjs
node tests/za-guide-093.mjs
node tests/za-main-handbook.mjs
node tests/za-side-handbook.mjs
node tests/smoke.mjs
node tests/atlas-06.mjs
node tests/pokedex-extended.test.mjs
node tests/localization.mjs
node tests/team.mjs
```

## Reference list

- [Serebii — base-game main mission index](https://www.serebii.net/legendsz-a/mainmissions.shtml)
- [Bulbapedia — Legends Z-A main mission objectives](https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A))
- [Thonky — full Z-A walkthrough](https://www.thonky.com/pokemon-legends-z-a/)
- [Thonky — postgame order](https://www.thonky.com/pokemon-legends-z-a/post-game)
- [PowerPyx — mission 19 Ice Beam](https://www.powerpyx.com/pokemon-legends-z-a-how-to-get-ice-beam/)
- [Serebii — abilities and passive effects in Z-A](https://www.serebii.net/legendsz-a/passiveeffects.shtml)
