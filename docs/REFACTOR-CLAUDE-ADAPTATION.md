# Claude tidy patch — adapted to Pokémon Atlas 0.9.6

Claude's supplied refactor was made for **0.9.4**. This integration preserves **0.9.6** content and carries it forward to structural release **0.9.7**. None of the older ZIP's guide files replace newer content.

## Result

- `src/guides/`: Z-A guide UI and all mission files, **including the newer 119-quest `za-side-handbook.js`**.
- `src/pokedex/`: move, effect, availability, forms, location and translation modules.
- `src/team/`: team builder and game-format JSON.
- `src/collection/`: collection UI and regional Pokédex JSON.
- `css/`: seven site stylesheets.
- Shared app bootstrap, API, data and i18n remain in `src/`.

Existing localStorage keys and all game/mission data are preserved. References, JSON data URLs, and PWA assets are updated. Cache version is bumped to 0.9.7 so old offline module URLs are invalidated.

## Checks

Recursive syntax checks, existing project tests, new `tests/project-paths.mjs` for modules/HTML/PWA links, PR CI, and main Pages deployment are required.

This organizational patch does not independently validate the gameplay guide's factual completeness and is **not** a 1.0 release.
