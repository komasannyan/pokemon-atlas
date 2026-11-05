# Архитектура Pokémon Atlas

## 1. Принципы

- Строго различать **вид**, **форму**, **поколение**, **версию игры**, **version group**, **событие** и **боевой формат**. Один и тот же покемон не всегда имеет одинаковые типы, атаки, способности или доступность в разных играх.
- Для каждого факта фиксировать **источник, дату синхронизации и область действия**. Показывать «данных нет» вместо неподтверждённых сведений.
- Любая русская запись имеет рядом английское каноническое имя/идентификатор; перевод может отличаться по локализации.
- Данные и представление изолированы друг от друга: изменения источников не должны требовать переписывать интерфейс.

## 2. Текущая схема MVP / v0.2

```text
браузер (index.html + src/app.js)
   │
   ├─ src/data.js → PokeAPI CSV (виды, поколения, типы, статы, способности)
   │               → словарь ru.json (русские имена)
   │               → localStorage (снимок каталога)
   │
   ├─ src/pokedex/moves.js → CSV moves/names/effects, localStorage (список атак)
   ├─ src/i18n.js  → RU/EN UI + сохранение выбора языка
   ├─ src/api.js   → PokéAPI REST (species, abilities, moves, encounters)
   ├─ Sprites     → PokeAPI/sprites (удалённые изображения)
   ├─ favorites   → localStorage
   └─ sw.js       → cache storage для оболочки/данных/изображений
```

Нет сервера и секрета API-ключа. Сайт размещается на HTTPS в статическом хостинге. HTML и CSS адаптированы под телефон, планшет и десктоп. Небольшой код разделён на модули, чтобы постепенно расширять его без обязательного большого фреймворка.

## 3. Целевая архитектура

Для большого проекта предлагается переход на **TypeScript + Vite + React** для UI, **PostgreSQL** для канонизированных версионных данных, **Node.js/TypeScript API** и отдельную задачу импорта/валидации. Переход целесообразен при появлении множества редакторов и справочников, а не обязателен для MVP.

```text
                 Приложение/PWA (Vite, React, TypeScript)
                      │                 │
           IndexedDB: офлайн         Backend REST/GraphQL
           избранное/команды               │
                                          PostgreSQL
                                              ▲
                                         ETL + тесты
                                    ┌─────────┼──────────┐
                                  PokéAPI  Showdown  проверенные гайды
                                              │
                                       публикация версий
```

Веб-приложение и импортёр не должны зависеть от «живого» состояния внешнего API в каждую секунду. Для справочных данных используется версия снимка, синхронизируемая по расписанию после валидации.

### Предлагаемые сущности БД

```text
species(id, national_number, canonical_name, generation)
localized_name(species_id, language, name, source)
form(id, species_id, form_key, available_from_gen, ruleset_id)
game(id, slug, title, generation, platform)
version_group(id, name)
move(id, canonical_name, damage_class, power, accuracy, pp)
move_change(move_id, generation, power, accuracy, pp, effect)
learnset(form_id, game_or_version_group_id, move_id, method, level, restrictions)
ability(id, canonical_name)
form_ability(form_id, ability_id, slot, is_hidden, valid_from, valid_to)
base_stats(form_id, ruleset_id, hp, atk, def, spa, spd, spe)
encounter(form_id, game_id, location_id, method, min_level, max_level, rate, prerequisites)
acquisition(form_id, game_id, method, requirements, source_ref)
media(form_id, media_kind, generation, origin, license, url)
guide(id, game_id, section, order, verified_at)
user_collection(user_id, game_id, form_id, shiny, caught, notes)
team(id, user_id, game_id, format_id)
team_slot(team_id, slot, form_id, ability, item, nature, evs, ivs, moves)
source_ref(id, url, author, license, verified_at, confidence)
```

### Разные типы контента

- **Pokédex:** Species + Form + версии, эволюции, способности, характеристики и медиа.
- **Атаки:** эффекты по поколениям, легальные методы изучения и взаимоисключающие сочетания.
- **Получение:** отдельно встречи, подарки, обмен, яйца, события, рейды и условия сюжета.
- **Гайды:** редактор проверенных прохождений и маршрутов с версиями/патчами.
- **Командный помощник:** матрицы типов и иммунитетов; распределение физических/специальных атак; скорость; роль; погода; Terrain; Hazard control; проверка формата, бан-листов и предметов; рекомендации только с объяснимой метрикой.
- **Медиа:** исторические спрайты, арт, 2D-рендеры и разрешённые модели 3D. Нельзя автоматически считать графику лицензированной лишь потому, что она доступна в открытом репозитории.

## 4. План релизов

- **0.1**: базовый National Dex, фильтры, избранное, карточка, галерея, первые вкладки атак/встреч, PWA — реализовано.
- **0.2**: региональные/альтернативные формы, полный набор эволюций (условия и ветки), игровая версия в карточке.
- **0.3**: энциклопедия атак/предметов/способностей с историческими изменениями и оригинальными английскими именами + проверенными русскими названиями.
- **0.4**: конструктор команд с проверяемой типовой синергией, импортом Showdown и калькулятором урона (сначала один формат).
- **0.5**: точные способы получения по играм и основным DLC с ссылками на источники.
- **0.6**: гайды по основным играм, личный Pokédex, прогресс сохранений.
- **1.0**: версии источников, тестирование правил, серверная синхронизация и проверенная юридическая база медиа.

## 5. Контроль качества и риски

1. **Неверные характеристики из другого поколения:** обязательно показывать ruleset/version context.
2. **Несуществующие наборы атак:** проверять легальность по покемону, форме, игре, способу переноса и формату, а не просто наличие атаки в истории вида.
3. **Доступность в игре:** различать «доступен без обмена», «нужен обмен», «только по событию», «доступен при переносе из HOME».
4. **Сторонние обновления и API-лимиты:** выполнять пакетный импорт и хранить версионированные снимки, кэшировать по ETag/TTL.
5. **Авторские права:** отдельно учитывать права на изображения, модели, тексты гайдов и официальные логотипы. Пользовательские описания и оригинальный дизайн предпочтительны.
6. **Безопасность:** экранирование внешнего текста, обработка ошибок, ограничение импорта, политика CSP при публикации, данные пользователей не размещать в статических файлах.
7. **Офлайн:** IndexedDB для больших данных и изображений, миграции схемы данных, тесты повторного подключения.


## 9. Изменения v0.2 и следующий этап

Появились отдельный список атак и семантические раскрывающиеся карточки (`<details>`), использующие метаданные из CSV и дополнительные подробности из REST API по клику. Общий компонент карточки атаки используется также внутри подробностей покемона. Разделение `i18n.js` и `moves.js` оставляет возможность заменить или дополнить источники данных без переписывания всей навигации.

В следующем этапе нужны: 1) модель изменения атак по поколениям (`past_values`) и гарантированная проверка version group; 2) редактор локализации для переводов эффектов и описаний (с источником и проверкой); 3) индексация форм и эволюционных условий; 4) автоматический браузерный regression test перед публикацией.

---

## Release 0.3 — Team Builder beta and localized effects

**New modules**
- `src/pokedex/effects-ru.js`: manually reviewed Russian descriptions for common moves and abilities, plus conservative regex rules for simple API effect prose. Untranslated advanced effects remain visibly labeled in English (do not fabricate a translation).
- `src/team/team-data.js`: versioned, format-scoped candidate sets. Each entry includes Pokémon, a role, four moves, item, ability, nature, stat spread, and allowed prototype formats.
- `src/team/team-engine.js`: deterministic heuristic team composition. Seeds (0–2), role locking, type matchup chart, immunities, hazard/removal/speed/coverage evaluation, weather, item and Mega duplication safeguards, and Showdown or Champions text export.
- `src/team/team-ui.js`: UI state, format/size selector, searchable available pool, role selectors, three generated options, reasons, shared weaknesses and clipboard export.
- `css/styles-v03.css`: responsive UI for the team lab; the original layout remains intact.

**Supported prototype formats**: casual Gen 9 singles, Gen 9 OU/UU/Ubers, Gen 9 Doubles OU, Gen 9 National Dex, and Champions Regulation M-C Doubles. A format label identifies a *prototype template pool*, not current legal validation. Champions enforces no duplicate items and at most one active Mega-stone candidate in recommended teams as a conservative restriction. The builder does not yet validate the Pokémon Champions eligible roster, banned items/moves, exact format usage tiers, or move learnability across all forms.

**Stat allocations**: Showdown-style examples use 252/252/4 EV templates with standard natures; for Champions, templates output 66 Stat Points (32/32/2) under the M-C rules. They are not interchangeable. The Champions copy function deliberately outputs a human-readable build rather than masquerading as an importable Showdown team.

**Future work**: automate data-set provenance, add date-aware format snapshots and official legality checks, support alternate forms without base-species artwork ambiguity, replace simple rule-based scoring with calibrated matchup scoring, add coverage vs metagame threats, and allow every Pokémon with fully verified sets.


## v0.4: правила форматов и полный список видов

Конструктор использует 1025 видов из кэша Национального Покедекса. Статические таблицы `src/format-rules.json` и `src/champions-learnsets.json` — срез Pokémon Showdown за ноябрь 2026. Общие learnsets ген9 загружаются из публичного JSON Showdown; если источник недоступен, конструктор не генерирует непроверенные наборы. `src/team/team-universe.js` фильтрует виды и предметы, выбирает допустимые атаки и создаёт шаблоны ролей. `src/team/team-engine.js` оценивает синергию и подбирает команду.

Champions — Regulation M-C от 9 сентября до 2 декабря 2026, без легендарных, с Item Clause и одной Mega Evolution. Нельзя гарантировать полную легальность составов без Showdown Team Validator; эта версия не проверяет сложные форменные и событийные ограничения. Русские описания способностей и атак пока частично проверены, остальная информация помечена как требующая ручного перевода и сверки.


## Покедекс 0.8 — формы и история

- `src/pokedex/pokedex-extended.js` — нормализация разновидностей, индивидуальных базовых характеристик, типов и способностей, эволюций, исторических сведений.
- `src/pokedex/pokedex-extended-ui.js` — интерфейс выбора разновидностей, дерево эволюций с условиями и история изменений.
- `css/pokedex-v08.css` — адаптивное оформление новых разделов.
- Сведения берутся по запросу из `pokemon-species/{id}`, `pokemon/{variety}` и `evolution-chain/{id}` PokéAPI. Основной каталог и записи коллекции используют прежние ID видов, поэтому старые данные пользователей сохраняются.
- В PokeAPI разновидности не равны доступным для поимки формам конкретной игры; косметические разновидности и история данных представлены настолько полно, насколько позволяет источник. Условия эволюции в разных играх могут различаться.
- Проверка: `node tests/pokedex-extended.test.mjs`.
