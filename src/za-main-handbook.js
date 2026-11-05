// Pokémon Atlas: main-story 42-mission, independently sourced structured walkthrough (session 2).
// Original Russian instructions summarizing in-game mission objectives and verified navigation.
// The checklist ids (s01 etc.) are STABLE: insert future steps with suffix IDs, never renumber.
// Sources: Bulbapedia's mission table; game-specific guides from Thonky, Serebii and Neoseeker.
// Lack of console playtesting means we do not assert exact AI move pools or unknown coordinates.
export const ZA_MAIN_HANDBOOK={
  "1": {
    "startHint": "За воротами Gare de Lumiose: сразу после выхода с вокзала.",
    "steps": [
      {
        "id": "s01",
        "ru": "Покинь вокзал Gare de Lumiose. Снаружи начинается сценка с Pancham: он уносит твою сумку, поэтому держись рядом с ним и следуй по доступному проходу."
      },
      {
        "id": "s02",
        "ru": "Когда сюжет предложит выбор, возьми Chikorita (Grass), Tepig (Fire) или Totodile (Water). Этот выбор определит твоего первого партнёра; остальные виды можно получить позже."
      },
      {
        "id": "s03",
        "ru": "Подойди к Pancham, зафиксируй цель и отправь первого покемона в бой. Выпускай атаки по готовности, меняй дистанцию и смотри на предупреждения о вражеском приёме."
      },
      {
        "id": "s04",
        "ru": "Победи Pancham, дождись сцены с возвратом сумки и завершения первого обучения. После боя продолжай за Urbain/Taunie, а не ищи новую точку самостоятельно."
      }
    ],
    "unlock": "Пройти начальную сцену и выйти через турникеты вокзала.",
    "battle": "Pancham — первый учебный бой. Задача — научиться выбирать цель и отдавать команды в реальном времени.",
    "reward": "Первый выбранный Pokémon и возвращённая дорожная сумка.",
    "tip": "При первом бое не нужно пытаться поймать Pancham: он участвует в учебной битве.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "2": {
    "startHint": "Ночная Battle Zone; вход в Hotel Z и лифт.",
    "steps": [
      {
        "id": "s01",
        "ru": "Иди за Urbain/Taunie через ночную Battle Zone к безопасному проходу. Если отстал, проверь активный жёлтый маркер основной миссии на карте."
      },
      {
        "id": "s02",
        "ru": "Подойди к Hotel Z и войди внутрь через главный вход, после чего поговори с сотрудником за стойкой регистрации на первом этаже."
      },
      {
        "id": "s03",
        "ru": "Найди лифт и выбери этаж с комнатой 202. Иди по коридору до нужного номера и войди в комнату."
      },
      {
        "id": "s04",
        "ru": "Взаимодействуй с кроватью, чтобы закончить первый день. После пробуждения открой дверь, когда постучит Urbain/Taunie, — это завершит последовательность."
      }
    ],
    "unlock": "Завершить основную миссию №1.",
    "tip": "Если сюжет не продолжается после заселения, проверь именно комнату 202 и взаимодействие с кроватью: просто подняться на этаж недостаточно.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "3": {
    "startHint": "Лобби Hotel Z → площадь перед отелем → Gare de Lumiose Pokémon Center → Wild Zone 1 → Pokémon Research Lab.",
    "steps": [
      {
        "id": "s01",
        "ru": "В лобби Hotel Z встреться с Urbain/Taunie, затем выйди на улицу и проведи с ним/ней тренировочный бой рядом с отелем."
      },
      {
        "id": "s02",
        "ru": "Дойди до Pokémon Center непосредственно перед Gare de Lumiose. Поговори с сотрудником, чтобы пройти обучение лечению покемонов и услугам центра."
      },
      {
        "id": "s03",
        "ru": "Отправляйся в Wild Zone 1. Подкрадись к Fletchling и попробуй поймать его брошенным Poké Ball, не начиная бой."
      },
      {
        "id": "s04",
        "ru": "Для Bunnelby используй атаку своего покемона, снизь HP, затем брось Poké Ball. Эти два случая объясняют обе основные техники поимки."
      },
      {
        "id": "s05",
        "ru": "Дополни Pokédex до минимум пяти зарегистрированных видов. Если недостаточно, ищи остальные виды в Wild Zone 1; повторная поимка уже записанного вида не заменяет новый вид."
      },
      {
        "id": "s06",
        "ru": "Открой карту и направляйся в Pokémon Research Lab. Сообщи Mable о пяти видах, затем открой меню и изучи вкладку Research Requests."
      },
      {
        "id": "s07",
        "ru": "Возвращайся в Hotel Z, чтобы завершить знакомство с исследованиями и перейти к ночным сражениям."
      }
    ],
    "unlock": "Закончить миссию №2.",
    "tip": "Игра считает разные зарегистрированные виды, а не число пойманных экземпляров. Если прогресс 4/5, найди вид, которого ещё нет в Pokédex.",
    "reward": "Доступ к исследованиям Mable и наградам за исследовательский прогресс.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "4": {
    "startHint": "Battle Zone в ночное время → Pokémon Center возле зоны → стоянка такси, Zach.",
    "steps": [
      {
        "id": "s01",
        "ru": "Начни разговор об участии в Z-A Royale у Urbain/Taunie и дождись наступления ночи; Battle Zones действуют по ночному циклу."
      },
      {
        "id": "s02",
        "ru": "Внутри Battle Zone вызывай тренеров на поединки, зарабатывай Ticket Points и обращай внимание на дополнительные условия Bonus Cards."
      },
      {
        "id": "s03",
        "ru": "Когда набрано достаточно Ticket Points, получи Challenger’s Ticket. Без билета повышение ранга не запускается даже при появлении доступного соперника."
      },
      {
        "id": "s04",
        "ru": "Встреться с Urbain/Taunie возле указанного Pokémon Center, чтобы подтвердить следующий этап задания."
      },
      {
        "id": "s05",
        "ru": "Дойди до стоянки такси, найди Zach и начни повышение. Победи его команду и дождись экрана повышения до ранга Y."
      }
    ],
    "unlock": "Завершить миссию №3.",
    "battle": "Zach — первый соперник в повышающем матче Z-A Royale.",
    "tip": "Если бой с Zach не появляется, проверь наличие Challenger’s Ticket, а не только количество проведённых ночных боёв.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "5": {
    "startHint": "Hotel Z → секретный путь по крышам → Nouveau Café у Centrico Plaza → Looker Bureau.",
    "steps": [
      {
        "id": "s01",
        "ru": "Утром спустись в лобби Hotel Z к Urbain/Taunie и выйди с ним/ней на улицу."
      },
      {
        "id": "s02",
        "ru": "У входа в секретный путь пошли покемона разбить фиолетовые Mega Crystals. Удалённый кристалл освобождает проход и даёт Mega Shards."
      },
      {
        "id": "s03",
        "ru": "Следуй за спутником по крыше: используй отмеченный подъём, переходи между зданиями по доступным настилам, затем в точке сюжетного указания спрыгни вниз к Urbain/Taunie."
      },
      {
        "id": "s04",
        "ru": "Около Centrico Plaza найди фургон Nouveau Café и пройди к Looker Bureau — агентству Emma."
      },
      {
        "id": "s05",
        "ru": "Emma поручит завершить три ранних побочных миссии: №1 (Alpha Bunnelby), №2 (обмен для Heracross) и №3 (кольцо у Dormez Bien Cemetery). Открой каждую в разделе «Побочные»."
      },
      {
        "id": "s06",
        "ru": "Когда все три отмечены в игровом журнале как выполненные, вернись в Looker Bureau, доложи Emma и пройди знакомство с Mega Evolution."
      }
    ],
    "unlock": "Завершить миссию №4.",
    "related": [
      [
        "side",
        1
      ],
      [
        "side",
        2
      ],
      [
        "side",
        3
      ]
    ],
    "tip": "Это не любое три побочных поручения: сюжетная глава приводит к ранним заданиям №1–3. Если Emma не принимает отчёт, проверь завершение именно этих миссий.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "6": {
    "startHint": "Ночная Battle Zone; место матча отмечено для Yvon.",
    "steps": [
      {
        "id": "s01",
        "ru": "После завершения знакомства с Emma проверь новую цель «Reaching Rank X» в журнале."
      },
      {
        "id": "s02",
        "ru": "Дождись ночной Battle Zone, сразись с тренерами и добери Ticket Points до Challenger’s Ticket. Дополнительные бонусы дают возможность сделать это быстрее."
      },
      {
        "id": "s03",
        "ru": "Когда билет получен, включи отслеживание №6 и доберись до указанного работника Yvon. Он является соперником именно за ранг X."
      },
      {
        "id": "s04",
        "ru": "Вступи в повышение, победи Yvon и дождись выдачи следующего ранга."
      }
    ],
    "unlock": "Завершить миссию №5.",
    "battle": "Повышающий бой против Yvon, офисного работника.",
    "tip": "Если игрок видит обычных тренеров, но не Yvon, необходимо сначала оформить Challenger’s Ticket.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "7": {
    "startHint": "Перед Hotel Z → ночная Battle Zone → площадка Xavi.",
    "steps": [
      {
        "id": "s01",
        "ru": "Выйди из Hotel Z и поговори с Naveen: прежде чем продолжить рейтинговую лестницу, необходимо выиграть обязательный бой с ним."
      },
      {
        "id": "s02",
        "ru": "При необходимости вылечи команду в Pokémon Center. Затем ночью участвуй в Battle Zone и набери Ticket Points для очередного Challenger’s Ticket."
      },
      {
        "id": "s03",
        "ru": "Выдели миссию №7, следуй к Xavi — школьнику, назначенному соперником за ранг W."
      },
      {
        "id": "s04",
        "ru": "Победи Xavi в назначенном повышающем матче; убедись, что на экране отображён ранг W."
      }
    ],
    "unlock": "Завершить миссию №6.",
    "battle": "Сначала Naveen у отеля, затем Xavi за ранг W.",
    "tip": "Победа над Naveen сама по себе не заменяет билет и матч с Xavi.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "8": {
    "startHint": "Hotel Z → пустырь среди переулков (Lida) → ночная зона боёв → Rintaro.",
    "steps": [
      {
        "id": "s01",
        "ru": "Получив миссию №8, разыщи Lida и передай ей вещи, которые остались у Hotel Z. Сначала закрой этот обязательный сюжетный пункт."
      },
      {
        "id": "s02",
        "ru": "После разговора последуй за Lida на тренировочный пустырь между переулками и победи её в поединке."
      },
      {
        "id": "s03",
        "ru": "Продолжай ночь в Battle Zone: добери Ticket Points, получи Challenger’s Ticket и отметь следующую цель в журнале."
      },
      {
        "id": "s04",
        "ru": "Найди Rintaro по жёлтому маркеру повышающего матча. Пройди бой, чтобы получить ранг V."
      }
    ],
    "unlock": "Завершить миссию №7.",
    "battle": "Lida на пустыре; Rintaro — следующий повышающий матч.",
    "tip": "Если Rintaro не доступен, перепроверь две части главы: передача вещей Lida и необходимый Challenger’s Ticket.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "9": {
    "startHint": "Сюжетная встреча с Zygarde → Vert District, Rogue Mega Absol.",
    "steps": [
      {
        "id": "s01",
        "ru": "После повышения до V обрати внимание на необычного Zygarde и следуй за ним через доступные улицы. Это сюжетная погоня, а не обычный дикий спавн."
      },
      {
        "id": "s02",
        "ru": "В месте события встретишь Rogue Mega Absol и получишь возможность сразиться с ним при помощи предоставленного AZ Lucario."
      },
      {
        "id": "s03",
        "ru": "Обычные удары сначала приносят мало пользы. Управляй Lucario, собирай появляющиеся Mega Power orbs и заполняй шкалу Mega Evolution."
      },
      {
        "id": "s04",
        "ru": "Когда шкала готова, активируй Mega Lucario. Используй Fighting-атаки, особенно Aura Sphere, и продолжай собирать Mega Power между сериями ударов."
      },
      {
        "id": "s05",
        "ru": "Если Absol начинает мощную атаку Dark Pulse, отбеги к внешнему краю арены; не рассчитывай переждать весь многократный удар в одной точке."
      },
      {
        "id": "s06",
        "ru": "Победи босса, дождись завершения сцены: Absol присоединяется к команде, а Absolite выдаётся здесь, в миссии №9, а не №10."
      }
    ],
    "unlock": "Завершить миссию №8.",
    "battle": "Rogue Mega Absol: используется сюжетный Lucario. Fighting-атаки эффективны против Dark-типа; для сильного Dark Pulse нужно уходить к краю поля.",
    "reward": "Absol и Absolite; обучение Mega Evolution.",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Legends:_Z-A/Part_9"
    ],
    "tip": "Здесь не требуется искать собственный Mega Stone или покупать Mega Ring: битва обучающая и опирается на предоставленного Lucario.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "10": {
    "startHint": "Hotel Z → Quasartico Inc. → battle court → Nouveau Café → Hotel Z.",
    "steps": [
      {
        "id": "s01",
        "ru": "Поговори с Urbain/Taunie и направляйся в Quasartico Inc.; у тебя уже есть Absol и Absolite после миссии №9."
      },
      {
        "id": "s02",
        "ru": "Дай Absol держать Absolite, используй Mega Evolution в учебной битве с Urbain/Taunie и заверши объяснение системы."
      },
      {
        "id": "s03",
        "ru": "Посети Vinnie в Quasartico Inc., затем отправляйся с ним на указанную площадку battle court."
      },
      {
        "id": "s04",
        "ru": "Получи Challenger’s Ticket обычным способом в Battle Zone и вернись к Vinnie для необходимого повышающего матча."
      },
      {
        "id": "s05",
        "ru": "Вернись в офис Quasartico Inc. за объяснением происхождения Rogue Mega. После этого выйди из здания и ненадолго загляни в Nouveau Café."
      },
      {
        "id": "s06",
        "ru": "В Hotel Z участвуй в совещании Team MZ: одновременно откроются три Rogue Mega поручения — №11 Slowbro, №12 Camerupt и №13 Victreebel."
      },
      {
        "id": "s07",
        "ru": "Выполни все три в удобном порядке. После получения трёх Mega Stones снова зайди в Hotel Z и доложи Team MZ."
      }
    ],
    "unlock": "Завершить миссию №9.",
    "related": [
      [
        "main",
        11
      ],
      [
        "main",
        12
      ],
      [
        "main",
        13
      ]
    ],
    "battle": "Учебный бой с Mega Absol; повышающий матч с Vinnie; три Rogue Mega в параллельных поручениях.",
    "tip": "Не нужно искать миссию №11 только после №10 как полностью закрытого задания: три поручения открываются в ходе миссии №10.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "11": {
    "startHint": "Bleu District, район Aymlis Park; подойти к точке Rogue Mega Slowbro.",
    "steps": [
      {
        "id": "s01",
        "ru": "Из Hotel Z после совещания Team MZ выбери миссию №11. На карте появится точка Rogue Mega Slowbro в Bleu District."
      },
      {
        "id": "s02",
        "ru": "Пройди в район Aymlis Park к водной площадке, где ждёт Urbain/Taunie. Подходи к обозначенному проходу, а не пытайся зайти в арену через произвольный берег."
      },
      {
        "id": "s03",
        "ru": "Подготовь Electric, Grass, Bug, Ghost или Dark-атаки: Slowbro имеет Water/Psychic-тип, а значит получает от них усиленный урон."
      },
      {
        "id": "s04",
        "ru": "В бою двигайся по краю арены и следи за водными зонами поражения. Когда босс начинает долгую серию ударов, прекращай атаку и меняй позицию."
      },
      {
        "id": "s05",
        "ru": "Собирай Mega Power и выпускай своего Mega Pokémon или Plus Moves в безопасные окна. После победы получи Slowbronite."
      },
      {
        "id": "s06",
        "ru": "Вернись к общему списку Rogue Mega миссии №10: оставшиеся №12 и №13 можно выполнять в любом порядке."
      }
    ],
    "unlock": "Начать миссию №10 и получить поручения Team MZ.",
    "battle": "Rogue Mega Slowbro — Water/Psychic. Эффективны Electric, Grass, Bug, Ghost и Dark.",
    "reward": "Slowbronite.",
    "tip": "Слишком ранний заход в Bleu District до совещания не активирует Rogue Mega сцену.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "12": {
    "startHint": "Jaune District, площадка Racine Construction и арена Camerupt.",
    "steps": [
      {
        "id": "s01",
        "ru": "Выбери миссию №12 после совещания Team MZ в рамках №10. Доберись до её указателя в Jaune District."
      },
      {
        "id": "s02",
        "ru": "На пути к месту Rogue Mega Camerupt сначала поговори с работником Racine Construction и пройди предусмотренный сюжетный бой; только после этого продолжай к боссу."
      },
      {
        "id": "s03",
        "ru": "Для Camerupt (Fire/Ground) особенно эффективны Water-атаки: это двойная слабость по типам, поэтому Water-удар наносит четырёхкратный урон."
      },
      {
        "id": "s04",
        "ru": "В арене обходи отмеченные области огня и атаки по земле. Не стой на месте, пока Camerupt готовит тяжёлый удар."
      },
      {
        "id": "s05",
        "ru": "Во время передышек чередуй Water-атаки, Plus Moves и Mega Evolution. Победи босса и получи Cameruptite."
      },
      {
        "id": "s06",
        "ru": "Проверь, завершилось ли поручение в журнале; общая миссия №10 продолжится, когда закрыты также №11 и №13."
      }
    ],
    "unlock": "Получить поручение №12 в ходе миссии №10.",
    "battle": "Rogue Mega Camerupt — Fire/Ground; Water ×4, Ground ×2.",
    "reward": "Cameruptite.",
    "tip": "Если у арены нет сюжетной встречи, проверь бой с сотрудником Racine Construction — это отдельный обязательный этап.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "13": {
    "startHint": "Magenta District, сюжетная точка Rogue Mega Victreebel.",
    "steps": [
      {
        "id": "s01",
        "ru": "В списке доступных параллельных заданий Team MZ выбери №13 и отправляйся в Magenta District к отмеченной точке."
      },
      {
        "id": "s02",
        "ru": "Подойди к входу/площадке события и поговори со спутником перед началом боя, чтобы не перепутать обычных диких Victreebel с Rogue Mega."
      },
      {
        "id": "s03",
        "ru": "Victreebel — Grass/Poison: подходят Fire, Flying, Ice и Psychic-атаки. Grass и Fighting без дополнительной выгоды здесь не лучший выбор."
      },
      {
        "id": "s04",
        "ru": "Уклоняйся от облаков и площадных приёмов: двигайся по безопасному краю, пока анимация атаки не закончится."
      },
      {
        "id": "s05",
        "ru": "Вовремя активируй Mega Evolution и Plus Moves, победи Rogue Mega Victreebel и забери Victreebelite."
      },
      {
        "id": "s06",
        "ru": "Закрой оставшиеся №11–12 и вернись на совещание Team MZ, чтобы перейти к рангу E."
      }
    ],
    "unlock": "Получить поручение №13 в ходе миссии №10.",
    "battle": "Rogue Mega Victreebel — Grass/Poison; Fire, Flying, Ice и Psychic эффективны.",
    "reward": "Victreebelite.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "14": {
    "startHint": "Hotel Z (Naveen) → Magenta District (Canari Quiz Whiz) → Café Gallant → Racine Construction.",
    "steps": [
      {
        "id": "s01",
        "ru": "Выйди из Hotel Z и победи Naveen: после боя он поделится сведениями о Canari."
      },
      {
        "id": "s02",
        "ru": "В Battle Zone заработай Challenger’s Ticket, затем снова поговори с Naveen. Он направит тебя на конкурс Canari в северо-западной части города, возле Magenta Pokémon Center."
      },
      {
        "id": "s03",
        "ru": "На входе в конкурс используй пароль по словам: «Let's» → «go» → «DYN4MO!»."
      },
      {
        "id": "s04",
        "ru": "В первом раунде викторины выбирай площадки: про мастерство в играх с падающими блоками — ✓ (правда); про любимые макароны — × (ложь); про любимый Electric-тип — ✓ (правда)."
      },
      {
        "id": "s05",
        "ru": "Для второго раунда понадобится особенная Lumiose Galette для Eelektross. Иди в Café Gallant в Magenta Sector 1, поговори с продавцом и заверши эпизод получения выпечки."
      },
      {
        "id": "s06",
        "ru": "Вернись на конкурс и поговори с Mani из DYN4MO. Победи его команду (Helioptile и Emolga ур. 34, Raichu ур. 35). В финальном вопросе выбирай вариант 4: «её дедушка»."
      },
      {
        "id": "s07",
        "ru": "После викторины отправляйся в Racine Construction. Внутри сначала поговори с Tarragon и выиграй обязательный бой: Hippowdon и Diggersby ур. 36, Mega Excadrill ур. 37."
      },
      {
        "id": "s08",
        "ru": "После победы над Tarragon пройди к отмеченной маленькой комнате в углу Racine Construction, где находится Canari. Поговори с ней: только теперь начнётся повышающий матч."
      },
      {
        "id": "s09",
        "ru": "Победи Canari: Heliolisk ур. 37, Stunfisk и Ampharos ур. 38, Mega Eelektross ур. 39. Для Electric-противников пригодятся Ground-атаки, но проверяй вторичные типы. Получи ранг E, TM066 Volt Switch и Autographed Plush."
      }
    ],
    "unlock": "Завершить основную миссию №10 и три поручения №11–13.",
    "battle": "Три боевых этапа: Naveen (Ariados/Sableye/Scraggy ур. 33), Mani (Helioptile/Emolga ур. 34, Raichu ур. 35), Tarragon (Hippowdon/Diggersby ур. 36, Mega Excadrill ур. 37), затем Canari (Heliolisk ур. 37, Stunfisk/Ampharos ур. 38, Mega Eelektross ур. 39).",
    "reward": "Ранг E и TM066 Volt Switch.",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://serebii.net/legendsz-a/mainmissions/reachingranke.shtml",
      "https://www.thonky.com/pokemon-legends-z-a/main-mission-14-reaching-rank-e"
    ],
    "tip": "Ответы на первый раунд: ✓, ×, ✓. Пароль: Let's / go / DYN4MO!. После конкурса нужен поход в Racine Construction, а не немедленный бой на сцене.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "15": {
    "startHint": "Hotel Z → крыши позади Hotel Z → маршруты Rogue Mega в трёх районах.",
    "steps": [
      {
        "id": "s01",
        "ru": "Вернись в Hotel Z после повышения до ранга E и присоединись к новому совещанию Team MZ."
      },
      {
        "id": "s02",
        "ru": "Выйди на заднюю сторону Hotel Z к Urbain/Taunie на крышах и пройди обучение Roto-Glide."
      },
      {
        "id": "s03",
        "ru": "Пересекай крыши по указанным площадкам. Roto-Glide позволяет спланировать через разрыв; не пытайся пройти несвязанные крыши пешком."
      },
      {
        "id": "s04",
        "ru": "После обучения откроются три параллельные Rogue Mega миссии: №16 Beedrill, №17 Hawlucha и №18 Banette."
      },
      {
        "id": "s05",
        "ru": "Пройди всех трёх, проверяя специальные маршруты на крышах и доступность Roto-Glide, затем вернись на совещание в Hotel Z."
      }
    ],
    "unlock": "Завершить миссию №14.",
    "related": [
      [
        "main",
        16
      ],
      [
        "main",
        17
      ],
      [
        "main",
        18
      ]
    ],
    "reward": "Доступ к Roto-Glide и следующему набору Rogue Mega.",
    "tip": "Без учебной сцены за Hotel Z некоторые проходы на крышах кажутся недоступными. Сначала заверши вводный маршрут.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "16": {
    "startHint": "Vert District, район Vert Sector 5; маршрут на крыши с Roto-Glide.",
    "steps": [
      {
        "id": "s01",
        "ru": "Активируй миссию №16 после знакомства с Roto-Glide в ходе №15. Дойди до Vert Sector 5."
      },
      {
        "id": "s02",
        "ru": "Поднимись по доступным лестницам/площадкам в пределах обозначенного здания и используй Roto-Glide на разрыве, если путь требует перелёта."
      },
      {
        "id": "s03",
        "ru": "Перед подходом к Rogue Mega Beedrill подготовь Fire, Flying, Psychic или Rock-атаку: его тип Bug/Poison уязвим к ним."
      },
      {
        "id": "s04",
        "ru": "Во время боя не стой на линии быстрых атак Beedrill. Сначала уклоняйся, затем отвечай мощными движениями в промежутках между его рывками."
      },
      {
        "id": "s05",
        "ru": "Победи Beedrill, получи Beedrillite и проверь список оставшихся №17–18."
      }
    ],
    "unlock": "Начать миссию №15 и освоить Roto-Glide.",
    "battle": "Rogue Mega Beedrill — Bug/Poison. Fire, Flying, Psychic и Rock эффективны.",
    "reward": "Beedrillite.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "17": {
    "startHint": "Magenta Sector 3, крыша возле Shutterbug Café.",
    "steps": [
      {
        "id": "s01",
        "ru": "Выбери №17 и доберись до Magenta Sector 3. Ориентир — Shutterbug Café: босс находится на крыше, а не в помещении кафе."
      },
      {
        "id": "s02",
        "ru": "Найди путь вверх с соседних строительных площадок/крыш; при необходимости используй Roto-Glide и активный указатель миссии для последнего перехода."
      },
      {
        "id": "s03",
        "ru": "Поговори с Lida перед боем. Она помогает во время встречи, но основные атаки и уклонения остаются твоей задачей."
      },
      {
        "id": "s04",
        "ru": "Hawlucha — Fighting/Flying: подходят Electric, Ice, Flying, Psychic и Fairy-атаки. Не выводи в первую очередь покемонов с явной слабостью к Fighting."
      },
      {
        "id": "s05",
        "ru": "Когда Mega Hawlucha готовит рывок или прыжок, перемещайся за пределы линии атаки. Возвращайся на дистанцию только после удара."
      },
      {
        "id": "s06",
        "ru": "Победи босса и получи Hawluchanite. Продолжи №16 или №18, если они ещё не закрыты."
      }
    ],
    "unlock": "Получить миссию №17 в ходе №15.",
    "battle": "Rogue Mega Hawlucha — Fighting/Flying. Подходят Flying, Electric, Psychic, Fairy и Ice.",
    "reward": "Hawluchanite.",
    "tip": "Если маркер показывает «рядом», но босса не видно, проверь уровень крыши над Shutterbug Café, а не соседнюю улицу.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "18": {
    "startHint": "Jaune Sector 9, арена Rogue Mega Banette рядом с проходом вниз.",
    "steps": [
      {
        "id": "s01",
        "ru": "Отметь №18 в списке Rogue Mega после №15 и направляйся в Jaune Sector 9."
      },
      {
        "id": "s02",
        "ru": "Ориентируйся на точку события в районе спуска к нижнему уровню, чтобы не искать босса на случайной крыше."
      },
      {
        "id": "s03",
        "ru": "Поговори с Naveen и подготовь Ghost или Dark-атаки. Banette — Ghost-тип, Normal и Fighting не наносят ему обычного урона."
      },
      {
        "id": "s04",
        "ru": "Во время боя Banette создаёт иллюзорные копии. Настоящего босса отличает сияние Mega Power; можно также следить, кого атакует союзник."
      },
      {
        "id": "s05",
        "ru": "Избегай атак Shadow Ball и Confuse Ray от копий, не трать долгие приёмы на ложные цели."
      },
      {
        "id": "s06",
        "ru": "Победи настоящего Rogue Mega Banette, получи Banettite и вернись к совещанию Team MZ после выполнения №16–18."
      }
    ],
    "unlock": "Получить миссию №18 в ходе №15.",
    "battle": "Rogue Mega Banette — Ghost; эффективны Ghost и Dark. Следи за копиями и аурой настоящего босса.",
    "reward": "Banettite.",
    "tip": "Копии — не самостоятельные цели миссии. Если бой кажется бесконечным, перенеси атаки на оригинал.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "19": {
    "startHint": "Hotel Z → Looker Bureau → City Hall → Nouveau Café → Clawitzer fountain → Lumiose Sewers → Fist of Justice.",
    "steps": [
      {
        "id": "s01",
        "ru": "Получи Challenger’s Ticket и встреться с Ivor, но подготовься к задержке: прежде повышающего матча нужно найти его сестру Gwynn."
      },
      {
        "id": "s02",
        "ru": "Следуй за Ivor в Looker Bureau. Затем отправляйся к City Hall, расспроси всех отмеченных прохожих и направляйся к Nouveau Café."
      },
      {
        "id": "s03",
        "ru": "После новой подсказки поговори с Canari. История приведёт к двору с фонтаном в форме Clawitzer, рядом с которым спрятан вход в канализацию."
      },
      {
        "id": "s04",
        "ru": "Для открытия канализации нужен Ice Beam. Самый простой способ — поймать Vanillite в Wild Zone 12 (примерно ур. 34), который уже знает Ice Beam. Также можно подобрать TM Ice Beam во дворе Wild Zone 12 и обучить совместимого покемона. Направь Ice Beam прямо на воду фонтана Clawitzer."
      },
      {
        "id": "s05",
        "ru": "Когда фонтан замёрзнет, войди в дверь в канализацию рядом с ним. Продвигайся до запертой решётки и осмотри замок/варианты взаимодействия."
      },
      {
        "id": "s06",
        "ru": "Преследуй Klefki с ключами, получи возможность ловли и поймай нужного Klefki. После сцены пройди через открывшийся маршрут."
      },
      {
        "id": "s07",
        "ru": "Следуй за Chandelure в дальнюю часть канализации. В комнате с тупиком изучи подсвеченные места: электрощиты, трубы и вентили, панели, светлые коробки."
      },
      {
        "id": "s08",
        "ru": "Когда появится проход, зайди через иллюзорную стену; она выглядит как обычная преграда, поэтому именно обследование комнаты запускает дальнейшее продвижение."
      },
      {
        "id": "s09",
        "ru": "Найди Gwynn глубже в канализации и победи её команду. В завершение вернись к Ivor и выиграй отложенный повышающий матч за ранг D."
      }
    ],
    "unlock": "Завершить миссию №15 и поручения №16–18.",
    "battle": "Сначала сюжетный бой с Gwynn (Ghost-состав), затем Ivor (Fighting-состав) за ранг D. Против Ghost помогают Dark/Ghost, против Fighting — Psychic/Flying/Fairy.",
    "reward": "Ранг D и доступ к следующей сюжетной цепочке.",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.neoseeker.com/pokemon-legends-z-a/Main_Mission_19",
      "https://www.powerpyx.com/pokemon-legends-z-a-how-to-get-ice-beam/",
      "https://www.thonky.com/pokemon-legends-z-a/main-mission-19-reaching-rank-d"
    ],
    "tip": "Если не открывается канализация: нужен именно Ice Beam на фонтан Clawitzer; Wild Zone 12 даст Vanillite с Ice Beam или TM. Если тупик в канализации: обследуй отмеченные объекты, затем пройди через иллюзорную стену.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "20": {
    "startHint": "Rust Syndicate HQ → Hotel Z → три Rogue Mega → старое здание, подземелье, банк → Rust Syndicate HQ.",
    "steps": [
      {
        "id": "s01",
        "ru": "После миссии №19 направляйся в штаб Rust Syndicate и победи Philippe в обязательном вступительном бою."
      },
      {
        "id": "s02",
        "ru": "Поговори с руководством Syndicate о долге Urbain/Taunie и вернись в Hotel Z рассказать Team MZ о полученных требованиях."
      },
      {
        "id": "s03",
        "ru": "На совещании появятся три Rogue Mega: №21 Mawile, №22 Barbaracle, №23 Ampharos. Заверши все три перед дальнейшей частью поручений Syndicate."
      },
      {
        "id": "s04",
        "ru": "Когда поступят следующие задания Syndicate, найди старое здание, зачисти указанных беспокойных покемонов и доложи нанимателю."
      },
      {
        "id": "s05",
        "ru": "Для задания с подземным проходом спустись в отмеченную зону и разбей все находящиеся там Mega Crystals атаками покемонов. Вернись к сотруднику, чтобы зачесть поручение."
      },
      {
        "id": "s06",
        "ru": "Далее найди назначенную группу «посторонних» и сразись с тренерами Lumiose Society of Battle Connoisseurs (SBC)."
      },
      {
        "id": "s07",
        "ru": "Присоединись к Corbeau у банка, дождись сцены, затем вернись в Hotel Z и снова иди в штаб Rust Syndicate."
      },
      {
        "id": "s08",
        "ru": "Заключительный разговор с Corbeau открывает дальнейший повышающий матч; не выходи из сюжета после первых трёх Rogue Mega."
      }
    ],
    "unlock": "Завершить основную сюжетную миссию №19 «Reaching Rank D».",
    "related": [
      [
        "main",
        21
      ],
      [
        "main",
        22
      ],
      [
        "main",
        23
      ]
    ],
    "battle": "Вступительный бой с Philippe; позже — тренеры SBC; параллельно три Rogue Mega.",
    "tip": "Самая частая ошибка — считать миссию выполненной после №21–23. На самом деле за ними следуют отдельные поручения Syndicate и возвращение к Corbeau.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "21": {
    "startHint": "Magenta Sector 6, точка Rogue Mega Mawile.",
    "steps": [
      {
        "id": "s01",
        "ru": "После совещания в ходе №20 выбери поручение №21 и отправляйся в Magenta Sector 6."
      },
      {
        "id": "s02",
        "ru": "Дойди до арены сюжетного Rogue Mega и поговори со спутником, прежде чем начинать сражение."
      },
      {
        "id": "s03",
        "ru": "Mega Mawile — Steel/Fairy: атакуй Fire либо Ground-приёмами. Poison-атаки не работают против Steel, а Dragon — против Fairy."
      },
      {
        "id": "s04",
        "ru": "Следи за тяжёлыми выпадами и зонами атаки, оставляя пространство для отступления. Уменьшай дистанцию только во время восстановления босса."
      },
      {
        "id": "s05",
        "ru": "Победи Rogue Mega Mawile, возьми Mawilite и переходи к №22–23 либо продолжай их в удобном порядке."
      }
    ],
    "unlock": "Открыть второй набор Rogue Mega в ходе №20.",
    "battle": "Rogue Mega Mawile — Steel/Fairy, слабости Fire и Ground.",
    "reward": "Mawilite.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "22": {
    "startHint": "Bleu Sector 5, арена Rogue Mega Barbaracle.",
    "steps": [
      {
        "id": "s01",
        "ru": "После получения задания №22 в ходе №20 направляйся в Bleu Sector 5."
      },
      {
        "id": "s02",
        "ru": "В отмеченной зоне найди площадку Barbaracle и активируй бой после обязательной сцены со спутником."
      },
      {
        "id": "s03",
        "ru": "Barbaracle относится к Rock/Water: Grass-атаки особенно сильны (четырёхкратная эффективность), также подходят Electric, Fighting и Ground."
      },
      {
        "id": "s04",
        "ru": "Избегай ближних многоударных выпадов и отступай от обозначенных площадных атак. Не выводи Fire-покемона только из-за доступной Mega Evolution."
      },
      {
        "id": "s05",
        "ru": "Победи Rogue Mega Barbaracle, забери Barbaracite и проверь прогресс общего поручения №20."
      }
    ],
    "unlock": "Открыть миссию №22 через №20.",
    "battle": "Rogue Mega Barbaracle — Rock/Water; Grass ×4, Electric/Fighting/Ground ×2.",
    "reward": "Barbaracite.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "23": {
    "startHint": "Rouge Sector 6, промежуточный разговор с Gwynn перед ареной Ampharos.",
    "steps": [
      {
        "id": "s01",
        "ru": "Выбери миссию №23 после совещания Rust Syndicate и направляйся в Rouge Sector 6."
      },
      {
        "id": "s02",
        "ru": "Когда приблизишься к месту Rogue Mega Ampharos, сначала поговори с Gwynn. Её наблюдение — обязательная сюжетная остановка на пути к боссу."
      },
      {
        "id": "s03",
        "ru": "После разговора вновь следуй к отмеченной точке события; не считай, что диалог с Gwynn заменяет победу над Mega Ampharos."
      },
      {
        "id": "s04",
        "ru": "Mega Ampharos имеет Electric/Dragon-тип, поэтому подходят Ground, Ice, Dragon и Fairy-атаки. Ground-приёмы хорошо защищают от Electric-давления."
      },
      {
        "id": "s05",
        "ru": "Уклоняйся от заряженных дистанционных атак и избегай долгого нахождения прямо перед боссом."
      },
      {
        "id": "s06",
        "ru": "Победи Rogue Mega Ampharos, получи Ampharosite, затем закрой остальные Rogue Mega миссии №21–22 и вернись к №20."
      }
    ],
    "unlock": "Открыть миссию №23 через №20.",
    "battle": "Rogue Mega Ampharos — Electric/Dragon, слабости Ground, Ice, Dragon, Fairy.",
    "reward": "Ampharosite.",
    "tip": "Если Ampharos не активируется, проверь беседу с Gwynn: в этой миссии есть промежуточный сюжетный триггер.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "24": {
    "startHint": "Rust Syndicate HQ, Corbeau; ночная Battle Zone для Challenger’s Ticket.",
    "steps": [
      {
        "id": "s01",
        "ru": "После полного завершения цепочки Rust Syndicate №20 вернись к Corbeau. Он становится твоим следующим соперником в Z-A Royale."
      },
      {
        "id": "s02",
        "ru": "В ночной Battle Zone набери нужное количество Ticket Points и получи новый Challenger’s Ticket."
      },
      {
        "id": "s03",
        "ru": "Прежде чем идти к Corbeau, вылечи команду и возьми разные типы атак — это не бой с Rogue Mega по фиксированной арене."
      },
      {
        "id": "s04",
        "ru": "Вернись в штаб Rust Syndicate, поговори с Corbeau и проведи повышающий матч за ранг C."
      },
      {
        "id": "s05",
        "ru": "После победы проследи, что сюжет перевёл тебя к следующему событию Team MZ."
      }
    ],
    "unlock": "Полностью закончить миссию №20, включая поручения после трёх Rogue Mega.",
    "battle": "Corbeau — повышающий бой за ранг C.",
    "reward": "Ранг C.",
    "tip": "Не путай сюжетный разговор с Corbeau у банка и матч в штабе — для повышения ещё требуется Challenger’s Ticket.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "25": {
    "startHint": "Battle court в Vert Sector 4.",
    "steps": [
      {
        "id": "s01",
        "ru": "После повышения до ранга C отправляйся на battle court в Vert Sector 4, куда собрались члены Team MZ."
      },
      {
        "id": "s02",
        "ru": "Поговори с командой и подготовь запас лечащих предметов: далее идут два обязательных боя в одной сюжетной встрече."
      },
      {
        "id": "s03",
        "ru": "Сначала победи Lida. После сцены проверь здоровье оставшихся покемонов и действуй по следующему приглашению."
      },
      {
        "id": "s04",
        "ru": "Сразись с Naveen и заверши дружеские поединки; только после этого появится приглашение от SBC."
      }
    ],
    "unlock": "Завершить миссию №24.",
    "battle": "Два отдельных боя: Lida, затем Naveen.",
    "tip": "Если сюжетная сцена не заканчивается после первого боя, это ожидаемо: нужен второй бой с Naveen.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "26": {
    "startHint": "Boutique Couture → Hotel Richissime → Hotel Z; третий набор Rogue Mega.",
    "steps": [
      {
        "id": "s01",
        "ru": "Получи приглашение SBC. Сначала отправляйся в Boutique Couture и поговори с дизайнером."
      },
      {
        "id": "s02",
        "ru": "В обязательном бою с дизайнером твой покемон должен использовать Mega Evolution. Одной победы обычным покемоном может быть недостаточно для сюжетного условия."
      },
      {
        "id": "s03",
        "ru": "Направляйся в Hotel Richissime. У входа на мероприятие поговори с Lebanne, которая отвечает за приём гостей."
      },
      {
        "id": "s04",
        "ru": "После сцены возвращайся в Hotel Z и проведи очередное совещание Team MZ."
      },
      {
        "id": "s05",
        "ru": "Откроются три параллельных миссии №27 Froslass, №28 Altaria и №29 Venusaur. Пройди каждую, собери камни и снова вернись в Hotel Z."
      },
      {
        "id": "s06",
        "ru": "После доклада всей тройке продолжай подготовку к турниру Jacinthe и рангу B."
      }
    ],
    "unlock": "Завершить миссию №25.",
    "related": [
      [
        "main",
        27
      ],
      [
        "main",
        28
      ],
      [
        "main",
        29
      ]
    ],
    "battle": "Бой в Boutique Couture с обязательной Mega Evolution; затем три Rogue Mega.",
    "tip": "Если история застряла в Boutique Couture, проверь условие Mega Evolution во время битвы, а не только факт победы.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "27": {
    "startHint": "Bleu District, Aymlis Park, маршрут через Holovator к ледяным платформам.",
    "steps": [
      {
        "id": "s01",
        "ru": "После совещания в миссии №26 включи №27 и подойди к Aymlis Park в Bleu District."
      },
      {
        "id": "s02",
        "ru": "Найди правильный подъём к крышам через Holovator/помеченный переход. Если Holovator не работает, проверь побочное поручение на восстановление конкретного подъёмника."
      },
      {
        "id": "s03",
        "ru": "На пути используй Fire-атаки по ледяным препятствиям, чтобы открыть дальнейший проход/платформы. Следуй за следующими точками маршрута, а не ищи арену на уровне земли."
      },
      {
        "id": "s04",
        "ru": "Подготовь Fire, Rock, Ghost, Dark или Steel-приёмы. Mega Froslass — Ice/Ghost, её быстрые атаки опасны для медленных покемонов."
      },
      {
        "id": "s05",
        "ru": "Во время боя сохраняй дистанцию при ледяных залпах и отступай с отмеченных площадок, затем отвечай Fire-атаками."
      },
      {
        "id": "s06",
        "ru": "После победы получи Froslassite и переходи к №28 или №29."
      }
    ],
    "unlock": "Получить миссию №27 в ходе №26.",
    "battle": "Rogue Mega Froslass — Ice/Ghost. Эффективны Fire, Rock, Ghost, Dark, Steel.",
    "reward": "Froslassite.",
    "tip": "Основная сложность здесь — дорога к арене: проверь Holovator и Fire-приём для препятствий.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "28": {
    "startHint": "Magenta Sector 4, крыша здания с Holovator.",
    "steps": [
      {
        "id": "s01",
        "ru": "Активируй миссию №28 в группе поручений SBC и доберись до Magenta Sector 4."
      },
      {
        "id": "s02",
        "ru": "Воспользуйся Holovator/подъёмом на указанное здание. Босс расположен наверху; обычный обход квартала по земле не приведёт к арене."
      },
      {
        "id": "s03",
        "ru": "Подготовь Ice, Poison, Steel или Fairy-приёмы: Mega Altaria — Dragon/Fairy, поэтому Dragon-атаки против него не работают."
      },
      {
        "id": "s04",
        "ru": "Следи за зонами воздушных атак, выходи из них до окончания подготовки босса и используй дальние приёмы, если арена ограничена."
      },
      {
        "id": "s05",
        "ru": "Победи Rogue Mega Altaria, получи Altarianite и закрой оставшиеся №27/29 перед возвращением к Team MZ."
      }
    ],
    "unlock": "Получить №28 в ходе №26.",
    "battle": "Rogue Mega Altaria — Dragon/Fairy, уязвим к Ice, Poison, Steel, Fairy; Dragon не действует.",
    "reward": "Altarianite.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "29": {
    "startHint": "Jaune Sector 8, арена Rogue Mega Venusaur.",
    "steps": [
      {
        "id": "s01",
        "ru": "В группе миссий №26 включи №29 и отправляйся в Jaune Sector 8."
      },
      {
        "id": "s02",
        "ru": "Найди сюжетный вход на площадку Rogue Mega Venusaur; рядом с точкой задания дождись сцены со спутником."
      },
      {
        "id": "s03",
        "ru": "Mega Venusaur — Grass/Poison. В Legends: Z-A обычные Abilities не работают, поэтому Fire, Ice, Flying и Psychic здесь действительно бьют с удвоенной эффективностью; заранее выбери подходящего покемона."
      },
      {
        "id": "s04",
        "ru": "При наземных/растительных площадных атаках уходи из подсвеченной области, не стой в зоне между препятствиями и боссом."
      },
      {
        "id": "s05",
        "ru": "Используй Mega Evolution и Plus Moves в короткие окна безопасности, победи Venusaur и получи Venusaurite."
      },
      {
        "id": "s06",
        "ru": "Убедись, что все три поручения №27–29 выполнены, и вернись на совещание Team MZ."
      }
    ],
    "unlock": "Получить миссию №29 в ходе №26.",
    "battle": "Rogue Mega Venusaur — Grass/Poison; слабости Fire, Ice, Flying, Psychic. В Legends: Z-A нельзя автоматически применять к боссу эффект Thick Fat из других игр.",
    "reward": "Venusaurite.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "30": {
    "startHint": "SBC / площадка турнира Jacinthe после получения Challenger’s Ticket.",
    "steps": [
      {
        "id": "s01",
        "ru": "После миссии №26 отправляйся ночью в Battle Zone и заработай Challenger’s Ticket для турнира Jacinthe."
      },
      {
        "id": "s02",
        "ru": "Поговори с организаторами SBC и начни турнир. Сначала идёт бой с Canari — приготовь Ground-атаки против Electric-состава."
      },
      {
        "id": "s03",
        "ru": "Во втором раунде победи Ivor: против Fighting-покемонов полезны Flying, Psychic и Fairy."
      },
      {
        "id": "s04",
        "ru": "В полуфинале сразись с Corbeau. Сохраняй универсальный состав, а не только контркоманду предыдущего соперника."
      },
      {
        "id": "s05",
        "ru": "Приступи к финальному повышающему матчу с Jacinthe, но приготовься к вмешательству Zygarde: перед окончательным завершением будет внеплановый бой."
      },
      {
        "id": "s06",
        "ru": "После события с Zygarde вернись к финалу Jacinthe и выиграй решающий матч. Только этот повторный этап закрывает повышение до ранга B."
      }
    ],
    "unlock": "Завершить №26 вместе с №27–29.",
    "battle": "Последовательность турнира: Canari → Ivor → Corbeau → Jacinthe, событие с Zygarde, затем финальный матч с Jacinthe.",
    "reward": "Ранг B.",
    "tip": "Если кажется, что матч Jacinthe уже сыгран, но повышение не выдано, продолжай сюжет после появления Zygarde: финал нужно довести до конца.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "31": {
    "startHint": "Quasartico Inc. → Hotel Z → три последних Rogue Mega.",
    "steps": [
      {
        "id": "s01",
        "ru": "После получения ранга B направляйся к Vinnie в Quasartico Inc. и встреться с President Jett."
      },
      {
        "id": "s02",
        "ru": "Выслушай новую информацию о ситуации с Rogue Mega и вернись в Hotel Z к Team MZ."
      },
      {
        "id": "s03",
        "ru": "На совещании откроются миссии №32 Dragonite, №33 Tyranitar и №34 Starmie; все три можно проходить в выбранном порядке."
      },
      {
        "id": "s04",
        "ru": "После каждой победы забирай соответствующий Mega Stone. Когда тройка закрыта, вернись в Hotel Z и заверши главу."
      },
      {
        "id": "s05",
        "ru": "Далее начинается подготовка к последнему повышению — миссии №35."
      }
    ],
    "unlock": "Завершить миссию №30.",
    "related": [
      [
        "main",
        32
      ],
      [
        "main",
        33
      ],
      [
        "main",
        34
      ]
    ],
    "tip": "Миссия №35 не откроется, пока не закрыты все три Rogue Mega из №31.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "32": {
    "startHint": "Vert Sector 3, указанная арена Dragonite.",
    "steps": [
      {
        "id": "s01",
        "ru": "После получения последней тройки заданий Team MZ включи №32 и отправляйся в Vert Sector 3."
      },
      {
        "id": "s02",
        "ru": "Доберись до сюжетной площадки Mega Dragonite, используя отмеченные подъёмы или Roto-Glide, если на пути есть разрыв между крышами."
      },
      {
        "id": "s03",
        "ru": "Dragonite — Dragon/Flying; Ice-атаки имеют четырёхкратную эффективность. Fairy, Rock и Dragon также подходят, если покемон выдерживает ответные удары."
      },
      {
        "id": "s04",
        "ru": "Не стой прямо перед целью во время широких воздушных атак. Дай Dragonite завершить опасный приём, затем атакуй и собирай Mega Power."
      },
      {
        "id": "s05",
        "ru": "После победы забери Dragoninite и продолжи №33–34."
      }
    ],
    "unlock": "Открыть №32 в ходе миссии №31.",
    "battle": "Rogue Mega Dragonite — Dragon/Flying; Ice ×4, Rock/Dragon/Fairy ×2.",
    "reward": "Dragoninite.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "33": {
    "startHint": "Jaune District, арена Rogue Mega Tyranitar.",
    "steps": [
      {
        "id": "s01",
        "ru": "В рамках №31 выбери миссию №33 и направляйся к указателю в Jaune District."
      },
      {
        "id": "s02",
        "ru": "По маркеру приблизься к арене Mega Tyranitar и проверь, что запускается именно сюжетный Rogue Mega бой."
      },
      {
        "id": "s03",
        "ru": "Tyranitar — Rock/Dark: Fighting-атаки наносят четырёхкратный урон; также подходят Water, Grass, Ground, Bug, Steel и Fairy."
      },
      {
        "id": "s04",
        "ru": "Следи за каменными и площадными атаками, уходи из подсвеченного сектора. Не задерживайся рядом во время подготовки мощного удара."
      },
      {
        "id": "s05",
        "ru": "Победи босса, получи Tyranitarite и переходи к №32/34, если ещё осталось."
      }
    ],
    "unlock": "Открыть №33 через №31.",
    "battle": "Rogue Mega Tyranitar — Rock/Dark. Fighting ×4; Water/Grass/Ground/Bug/Steel/Fairy ×2.",
    "reward": "Tyranitarite.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "34": {
    "startHint": "Bleu Sector 9, отмеченная точка Rogue Mega Starmie.",
    "steps": [
      {
        "id": "s01",
        "ru": "Активируй №34 после совещания с Vinnie в миссии №31 и перейди в Bleu Sector 9."
      },
      {
        "id": "s02",
        "ru": "Доберись до арены по жёлтому указателю и поговори с союзником перед боем с Rogue Mega Starmie."
      },
      {
        "id": "s03",
        "ru": "Starmie — Water/Psychic. Для быстрого урона готовь Electric, Grass, Bug, Ghost и Dark-приёмы."
      },
      {
        "id": "s04",
        "ru": "Следи за быстрыми специальными атаками и отступай, когда рядом появляются предупреждающие зоны. Длительные анимации атаки используй только при безопасном расстоянии."
      },
      {
        "id": "s05",
        "ru": "Заверши бой, получи Starminite, закрой №32–33 и вернись в Hotel Z для начала пути к рангу A."
      }
    ],
    "unlock": "Открыть №34 в ходе №31.",
    "battle": "Rogue Mega Starmie — Water/Psychic; Electric, Grass, Bug, Ghost и Dark эффективны.",
    "reward": "Starminite.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "35": {
    "startHint": "Looker Bureau → Pokémon Research Lab → Nouveau Café → закрытое кафе → Lysandre Labs (B1F → B3F) → Hotel Z → Grisham.",
    "steps": [
      {
        "id": "s01",
        "ru": "Сначала отправляйся в Looker Bureau к Emma: твой соперник по рангу A скрывается под именем Grisham. Победи Emma, чтобы получить доступ к дальнейшим сведениям."
      },
      {
        "id": "s02",
        "ru": "Поднимись в кабинет Mable в Pokémon Research Lab и поговори с ней о Grisham. После этого зайди к фургону Nouveau Café и запроси очередной повышающий матч."
      },
      {
        "id": "s03",
        "ru": "Если нужен Challenger’s Ticket, набери очки ночью; пока ждёшь билет, можно следовать открытой сюжетной информации о Grisham."
      },
      {
        "id": "s04",
        "ru": "Отправляйся северо-восточнее Wild Zone 7 к закрытой витрине, отмеченной миссией. Поговори с Griselle и победи её команду, чтобы войти в заброшенное кафе."
      },
      {
        "id": "s05",
        "ru": "Внутри кафе найди скрытый проход за задней дверью и спустись в Lysandre Labs. Твоя цель — получить Elevator Key, а не просто осмотреть первый этаж."
      },
      {
        "id": "s06",
        "ru": "На B1F активируй светящиеся компьютерные панели: они включают освещение и телепортационные площадки. В юго-восточной части пройди через портал и найди Lab Key Card A на столе."
      },
      {
        "id": "s07",
        "ru": "Вернись к запертой двери с символом замка на карте, используй найденную ключ-карту и продвигайся к следующей области лаборатории. Продолжай активировать панели и искать следующие карты, отслеживая закрытые двери по карте."
      },
      {
        "id": "s08",
        "ru": "В западной части лаборатории пройди открытые коридоры; у финального препятствия победи обязательного Aegislash (это сюжетный бой, поймать его здесь нельзя)."
      },
      {
        "id": "s09",
        "ru": "В комнате за Aegislash осмотри стол и забери Elevator Key. Используй ближайшую панель/портал, чтобы вернуться к центральному лифту."
      },
      {
        "id": "s10",
        "ru": "Выбери этаж B3F: B2F — дополнительное помещение с предметом, но не продолжение сюжета. На B3F пройди к лабораторным файлам и изучи все четыре записи."
      },
      {
        "id": "s11",
        "ru": "Вернись через лифт в Lysandre Café и поговори с Grisham; затем отправляйся в Hotel Z и выслушай AZ."
      },
      {
        "id": "s12",
        "ru": "Когда билет готов, встреться с Grisham у Nouveau Café, проведи решающий повышающий матч и получи ранг A."
      }
    ],
    "unlock": "Закрыть миссию №31 и все три Rogue Mega №32–34.",
    "battle": "Emma: Ampharos, Mawile, Lopunny, Lucario, Mega Malamar (ур. 57–58). Griselle: Talonflame, Aerodactyl, Camerupt, Metagross, Mega Pyroar (ур. 59–61). Grisham: Pangoro, Malamar, Pyroar, Tyranitar, Salamence, Mega Charizard X (ур. 61–63).",
    "reward": "Ранг A; TM104 Flare Blitz после Grisham.",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.thonky.com/pokemon-legends-z-a/main-mission-35-reaching-rank-a",
      "https://www.neoseeker.com/pokemon-legends-z-a/Main_Mission_35"
    ],
    "tip": "Если запутался в Lysandre Labs: ищи не случайные коридоры, а карты доступа с видимых столов, активируй панели порталов и сверяй значки замков. Сюжет продолжается на B3F.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "36": {
    "startHint": "Hotel Z → перед Prism Tower → крыши вокруг башни.",
    "steps": [
      {
        "id": "s01",
        "ru": "После повышения до ранга A выйди из Hotel Z и начни сцену с тревогой вокруг Prism Tower."
      },
      {
        "id": "s02",
        "ru": "Подойди к Prism Tower и встреться с остальными участниками Team MZ. Перед решающим планом будет заключительный сюжетный бой с Urbain/Taunie."
      },
      {
        "id": "s03",
        "ru": "После боя поговори с Vinnie о защите города и выслушай план действий."
      },
      {
        "id": "s04",
        "ru": "Перемещайся по маршруту на крышах к следующему маркеру, затем спустись на уровень улиц, чтобы оценить ситуацию в городе."
      },
      {
        "id": "s05",
        "ru": "Заверши сцену, которая передаёт управление следующей главе «Operation Protect Lumiose»."
      }
    ],
    "unlock": "Завершить миссию №35.",
    "battle": "Сюжетный поединок с Urbain/Taunie перед городской операцией.",
    "tip": "Это точка перехода к масштабному финалу. Перед выходом проверь состав команды, лечащие предметы и покрытия по типам.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "37": {
    "startHint": "Маршрут от Prism Tower через несколько районов, строительные леса и крыши до финальной встречи с Zygarde.",
    "steps": [
      {
        "id": "s01",
        "ru": "Выйди на маршрут защиты Люмиоса и двигайся за союзниками. В первых волнах встречаются Rogue Mega Gengar и Heracross: победи их и продолжай на юг по открывшемуся пути."
      },
      {
        "id": "s02",
        "ru": "В тупике сверни влево через парк и встреться с Ivor и Gwynn. Помоги победить Rogue Mega Pidgeot, Kangaskhan и Garchomp; Ice-атаки особенно полезны против Garchomp."
      },
      {
        "id": "s03",
        "ru": "Следуй за Ivor по мосту, поднявшись по лестнице поверни назад вдоль канала, а затем поднимись по следующей лестнице к сцене с Canari и Tarragon."
      },
      {
        "id": "s04",
        "ru": "Сразись с Rogue Mega Steelix и Blastoise, затем доберись до строительных лесов. Для Steelix подходят Fire/Ground/Fighting/Water, для Blastoise — Electric/Grass."
      },
      {
        "id": "s05",
        "ru": "На лесах поднимайся по доступным лестницам и настилам. На верхнем уровне найди площадку с предметом, затем проход в настиле под четырьмя конусами; двигайся дальше вверх, пока не увидишь отверстие для прыжка вниз."
      },
      {
        "id": "s06",
        "ru": "Спрыгни в это отверстие и спустись по лестнице между прожекторами. Это правильный путь продолжения; не нужно пытаться перепрыгивать всю конструкцию напрямую."
      },
      {
        "id": "s07",
        "ru": "У следующей группы союзников победи Rogue Mega Aggron и Salamence. Двигайся по маршруту, затем через открытый дверной проход в здании справа к бою с Gardevoir и Gallade."
      },
      {
        "id": "s08",
        "ru": "Встреться с Corbeau и его командой. Используй образованную ими живую лестницу, чтобы подняться на крыши; без неё этот участок не проходится."
      },
      {
        "id": "s09",
        "ru": "На крышах переходи по сломанным конструкциям, настилам и корням возле башни. Дальше сразись с Rogue Mega Metagross, Aerodactyl и Alakazam при поддержке Griselle и Grisham."
      },
      {
        "id": "s10",
        "ru": "После всех волн следуй за Zygarde к финальной точке. Не отступай к случайным Wild Zones: продвижение происходит по узкому сюжетному маршруту."
      },
      {
        "id": "s11",
        "ru": "В схватке с Hyperrogue Ange Floette наблюдай за дальними атаками и заметными опасными зонами на земле; используй безопасные периоды для нанесения урона и сохраняй мобильность."
      },
      {
        "id": "s12",
        "ru": "Заверши решающий эпизод и дождись титров: это завершение основной истории, после которого доступны постгейм-миссии №38–42."
      }
    ],
    "unlock": "Завершить миссию №36.",
    "battle": "Серия многоволновых Rogue Mega боёв, затем Hyperrogue Ange Floette. Покрывай Ice/Electric/Fire/Ground/Fighting/Dark и используй Mega Evolution в длинных сражениях.",
    "reward": "Завершение основной кампании, титры и переход в постгейм.",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.thonky.com/pokemon-legends-z-a/main-mission-37-operation-protect-lumiose",
      "https://www.neoseeker.com/pokemon-legends-z-a/Main_Mission_37"
    ],
    "tip": "Три частых тупика: лестницы и проход под четырьмя конусами на лесах; отверстие для спуска сверху; «живая лестница» команды Corbeau перед крышами. Эти три точки обязательны.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "38": {
    "startHint": "Hotel Z, лобби 1F → Centrico Plaza у Prism Tower.",
    "steps": [
      {
        "id": "s01",
        "ru": "После титров вернись к управлению персонажем в Hotel Z. Спустись с жилого этажа в лобби на 1F."
      },
      {
        "id": "s02",
        "ru": "Поговори с Urbain/Taunie о будущем города и завершении основной истории."
      },
      {
        "id": "s03",
        "ru": "Отправляйся к Prism Tower в Centrico Plaza и встреться с Vinnie и остальными. Досмотри сцену, чтобы открыть свободное продолжение постгейма."
      },
      {
        "id": "s04",
        "ru": "После завершения этой миссии появляются отдельные направления №39 (Infinite Z-A Royale) и №40–41 (легендарные Pokémon). Они не являются строгой последовательной цепочкой до №42."
      }
    ],
    "unlock": "Завершить миссию №37 и посмотреть титры.",
    "related": [
      [
        "main",
        39
      ],
      [
        "main",
        40
      ],
      [
        "main",
        41
      ]
    ],
    "reward": "Открытие постгейм-активностей, включая Wild Zone 20 и новые задания.",
    "tip": "Для постгейма не нужно выполнять 15 Reward Matches до открытия Xerneas и Yveltal: миссии №40–41 имеют отдельные условия.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "39": {
    "startHint": "Centrico Plaza → Quasartico Inc. (приёмная Infinite Z-A Royale) → Hotel Z.",
    "steps": [
      {
        "id": "s01",
        "ru": "После №38 в Centrico Plaza активируй Infinite Z-A Royale. В этом режиме Challenger’s Tickets зарабатываются для повторяемых Reward Matches."
      },
      {
        "id": "s02",
        "ru": "Собери требуемые Ticket Points в ночных Battle Zones, затем поговори с работником у приёмной Quasartico Inc. и выиграй первый Reward Match."
      },
      {
        "id": "s03",
        "ru": "Вернись в Hotel Z, когда появится сюжетное приглашение от Lida. После него доступны линии с Xerneas и Yveltal (№40 и №41)."
      },
      {
        "id": "s04",
        "ru": "Продолжай участвовать в Infinite Z-A Royale, снова получая билеты за очки. После определённого прогресса зайди в офис Quasartico Inc. для нового сюжетного этапа."
      },
      {
        "id": "s05",
        "ru": "Чтобы полностью закрыть награды Infinite Z-A Royale, выиграй 15 Reward Matches. После 15-й победы получишь Eternal Flower Floette и Floettite."
      },
      {
        "id": "s06",
        "ru": "Если цель — Zygarde по №42, выполнять все 15 Reward Matches заранее не требуется. Заверши №40 и №41, затем возвращайся в Hotel Z."
      }
    ],
    "unlock": "Завершить миссию №38.",
    "related": [
      [
        "main",
        40
      ],
      [
        "main",
        41
      ],
      [
        "main",
        42
      ]
    ],
    "reward": "Повторяемые Reward Matches; после 15 побед — Eternal Flower Floette и Floettite.",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.thonky.com/pokemon-legends-z-a/post-game"
    ],
    "tip": "Не путай 15 матчей для Floette и 20 матчей для побочной миссии №119. Вход в №42 зависит от Xerneas/Yveltal, а не от полного Infinite Z-A Royale.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "40": {
    "startHint": "Hotel Z → Pokémon Research Lab (Mable) → Wild Zone 11.",
    "steps": [
      {
        "id": "s01",
        "ru": "После разблокирования постгейма и встречи в Hotel Z поговори с Mable по делу «того, кто дарует»."
      },
      {
        "id": "s02",
        "ru": "Выполни исследовательское поручение Mable, связанное с необычными Alpha-покемонами. Не пропускай сдачу исследования: без анализа дальнейшая цель может не открыться."
      },
      {
        "id": "s03",
        "ru": "Когда сведения получены, отправляйся в Wild Zone 11 и найди сюжетную точку появления Xerneas."
      },
      {
        "id": "s04",
        "ru": "Подготовь покемонов к поимке, а не только к победе: запасись Poké Balls и снижением HP, чтобы не затягивать бой."
      },
      {
        "id": "s05",
        "ru": "Успешно поймай Xerneas и заверши миссию в журнале. Для выхода на Zygarde понадобится также Yveltal из №41."
      }
    ],
    "unlock": "Завершить №38, затем запустить постгейм-линию через Hotel Z.",
    "battle": "Xerneas — Fairy; против него хорошо работают Poison и Steel, но для поимки избегай случайного нокаута.",
    "reward": "Xerneas.",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.thonky.com/pokemon-legends-z-a/post-game"
    ],
    "tip": "Если Xerneas не виден в Wild Zone 11, сначала заверши конкретное исследование Mable и её сюжетный диалог.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "41": {
    "startHint": "Hotel Z → Quasartico Inc. → Rogue Mega Simulator 3000 → Galerie de la Lune, Rouge District.",
    "steps": [
      {
        "id": "s01",
        "ru": "После начала постгейма поговори с Grisham и Vinnie по делу Yveltal."
      },
      {
        "id": "s02",
        "ru": "В Quasartico Inc. встреться с Grisham. Тебя направят в Rogue Mega Evolution Simulator 3000."
      },
      {
        "id": "s03",
        "ru": "Победи всех предусмотренных симулятором Rogue Mega. Это последовательное обязательное испытание, а не свободный поиск нескольких боссов по городу."
      },
      {
        "id": "s04",
        "ru": "После симулятора отправляйся в Rouge District и доберись до крыши Galerie de la Lune; Yveltal находится именно наверху, а не внутри галереи."
      },
      {
        "id": "s05",
        "ru": "Подготовь Electric, Ice, Rock либо Fairy-атаки против Dark/Flying Yveltal, но сохраняй возможность ослабить его для поимки."
      },
      {
        "id": "s06",
        "ru": "Поймай Yveltal, заверши миссию №41. После Xerneas из №40 можно запускать финальный постгейм с Zygarde."
      }
    ],
    "unlock": "Завершить №38 и начать соответствующую линию в Hotel Z.",
    "battle": "Yveltal — Dark/Flying, слабости Electric/Ice/Rock/Fairy. Перед поимкой осторожно снижать HP.",
    "reward": "Yveltal.",
    "tip": "Если на крыше Galerie de la Lune пусто, проверь завершение всего Rogue Mega Simulator 3000.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  },
  "42": {
    "startHint": "Hotel Z → встреча с L → подземная область под Prism Tower.",
    "steps": [
      {
        "id": "s01",
        "ru": "Убедись, что обе легендарные миссии №40 (Xerneas) и №41 (Yveltal) завершены. Полностью заканчивать 15 Reward Matches в №39 не требуется."
      },
      {
        "id": "s02",
        "ru": "Войди в Hotel Z, чтобы активировать следующий сюжетный эпизод, и поговори с L."
      },
      {
        "id": "s03",
        "ru": "Перед походом к Prism Tower вылечи команду и подготовь несколько атак Ice, Fairy и Dragon — они полезны в последующей битве с Zygarde."
      },
      {
        "id": "s04",
        "ru": "Проведи обязательный поединок с L. После сцены следуй к входу под Prism Tower, открываемому в рамках этой главы."
      },
      {
        "id": "s05",
        "ru": "В подземной арене начни битву с Zygarde. Сохраняй движение при атаках по площади и учитывай смену форм и последовательные фазы боя."
      },
      {
        "id": "s06",
        "ru": "Используй Ice-атаки против Dragon/Ground Zygarde и следи за возможностью безопасной поимки в завершении встречи."
      },
      {
        "id": "s07",
        "ru": "После победы/поимки дождись получения Zygarde и Zygardite. Это завершает постгейм-ветку баланса Люмиоса, но не все повторяемые активности."
      }
    ],
    "unlock": "Завершить обе миссии №40 и №41; завершение №39 не является обязательным.",
    "related": [
      [
        "main",
        40
      ],
      [
        "main",
        41
      ],
      [
        "main",
        39
      ]
    ],
    "battle": "Сначала L, затем многоэтапный Zygarde. Ice против Dragon/Ground особенно эффективен; следи за атаками широкого радиуса.",
    "reward": "Zygarde и Zygardite.",
    "tip": "Миссию №42 можно закончить до полного выполнения №39. Если она не появилась, проверь именно поимку Xerneas и Yveltal и вход в Hotel Z.",
    "source": "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
    "sources": [
      "https://bulbapedia.bulbagarden.net/wiki/Task_(Legends:_Z-A)",
      "https://www.dexerto.com/wikis/pokemon-legends-z-a/all-main-story-missions-in-pokemon-legends-z-a-full-walkthrough/"
    ],
    "checked": "2026-11-05",
    "status": "source-checked"
  }
};
