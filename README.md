# Pokémon Atlas

Pokédex, moves, abilities, team builder, collection tracker and game guides.

**[Open website](https://komasannyan.github.io/pokemon-atlas/)**

Your progress is saved in your browser. Unofficial fan project.

---

## Русский

Pokémon Atlas — Покедекс, атаки, способности, конструктор команд, коллекция и гайды.

**[Открыть сайт](https://komasannyan.github.io/pokemon-atlas/)**

Прогресс сохраняется в браузере. Неофициальный фанатский проект.

## Разработка

Статический сайт на ES-модулях: установка npm-пакетов и сборка не нужны. Для локального запуска используй `python3 -m http.server 8000`, для проверок — Node.js 22 или новее:

```sh
set -e
find src -name '*.js' -print0 | xargs -0 -n1 node --check
for test in tests/*.mjs; do node "$test"; done
```

- `src/guides/data/za/` и `data/sv/` — игровые сведения со ссылками на источники.
- `src/guides/catalogs/` — сборка карточек и связей; без DOM и выбранного языка.
- `src/guides/guide-ui.js` — общий интерфейс; `guide-progress.js` — сохранение отметок.
- `src/pokedex/`, `team/`, `collection/` — отдельные функции приложения.
- `css/` — стили по назначению; порядок подключения в `index.html` важен.

При добавлении или переносе модуля обнови список офлайн-файлов в `sw.js`. `tests/project-paths.mjs` проверяет импорты, ссылки и полноту этого списка. Прежние таблицы Z-A используются как резервные данные каталога и не являются архивом.
