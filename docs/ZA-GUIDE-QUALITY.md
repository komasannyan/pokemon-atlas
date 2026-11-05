# Legends: Z-A guide — data quality audit (0.9.2)

This is an **internal data-quality note**, not a user-facing README.

## Changes verified

- Side missions: 119 indexed with named start locations, reward information, main-story unlocks where established, and 118 starting NPC/location hints. Source: [Gamer Guides](https://www.gamerguides.com/pokemon-legends-z-a/guide/side-missions/overview/), [Pokémon GO Hub](https://pokemongohub.net/post/guide/legends-z-a-all-side-missions/).
- The existing 119 original Russian objective summaries are now actually selected, rather than older vague placeholders. Another 35 base-game missions received additional structured instructions (in addition to prior detailed missions).
- Wild Zones: 20 pools and main-mission unlocks aligned with [Serebii](https://www.serebii.net/legendsz-a/wildzones.shtml). Earlier records contained 17 mismatched opening milestones or encounter rosters.
- Micro-locations: 179 structured recorded appearances (including 39 Alpha entries) from [Pokémon GO Hub's zone guide](https://pokemongohub.net/post/guide/all-wild-zones-pokemon-legends-z-a/). These are **not** comprehensive spawn coordinates, catch rates, or the full roster of Alpha variants. The complete Zone 20 species list is retained separately.
- TM index: 160 unique consecutive IDs, names/regions cross-checked against [Serebii](https://www.serebii.net/legendsz-a/tm.shtml). Acquisition paths for all 53 DLC TMs independently checked against [PsyPokes](https://www.psypokes.com/plza/mdtm.php): 31 Mega Shard shop entries and 22 mission rewards, including real shard prices.
- Completed mission/step progress uses the existing localStorage keys and is not reset by these changes.

## Remaining limitations

- The guide is still **not exhaustive**: some story and side-mission descriptions are concise, and many DLC side quests lack turn-by-turn routes or full opponent teams.
- The 179 micro-location records cover only encounters described by their source. Missing entries do not prove a Pokémon is absent; the roster lists are broader.
- Only independently supported spawn conditions are surfaced; no invented spawn percentages, precise coordinates, or item prices.
- Side-mission starting NPC hints are in their original English in some guide cards; these may be localized in a later pass.
- Original version-specific Pokémon availability outside Legends: Z-A still depends partly on PokéAPI and is incomplete.

Validate with `node tests/za-guide-092.mjs`. Further detailed guides should be grounded mission-by-mission, not filled with generic instructions.
