// Base-game activities after The Way Home. Each card is an original bilingual
// summary of the linked references; no DLC requirements are implied.
const BASE='https://www.serebii.net/scarletviolet/';
const steps=(...pairs)=>pairs.map(([ru,en],i)=>({id:'s'+String(i+1).padStart(2,'0'),ru,en}));

export const SV_POSTGAME=[
 {
  kind:'postgame',id:'gym-rematches',name:'После титров: реванши восьми арен',nameEn:'After the credits: eight Gym rematches',version:'both',
  location:'Академия → восемь арен Палдеи',locationEn:'Academy → Paldea’s eight Gyms',
  quick:'Сначала заверши The Way Home. Для подготовки Academy Ace Tournament Geeta поручит повторно проверить все восемь арен.',
  quickEn:'Finish The Way Home first. Geeta asks you to inspect all eight Gyms again before the Academy Ace Tournament.',
  steps:steps(
   ['После титров вернись к сюжетным разговорам в академии: Nemona предложит турнир, а Geeta поручит повторно посетить лидеров арен.','After the credits, follow the academy story conversations: Nemona proposes a tournament and Geeta asks you to revisit the Gym Leaders.'],
   ['Посети Cortondo, Artazon, Levincia, Cascarrafa, Medali, Montenevera, Alfornada и Glaseado Gym. Это повторные бои с лидерами, а не новые Gym Tests.','Visit Cortondo, Artazon, Levincia, Cascarrafa, Medali, Montenevera, Alfornada and Glaseado Gym. These are rematches with the leaders, not new Gym Tests.'],
   ['Подготовь полноценную команду: повторные составы сильнее первоначальных. Не ориентируйся на уровни первых боёв из карточек арен.','Prepare a full team: the rematch teams are stronger than the original teams. Do not use the first-battle levels shown in the Gym cards as rematch targets.'],
   ['После всех восьми реваншей продолжи поручение Geeta и разговоры в академии, чтобы перейти к Academy Ace Tournament.','After all eight rematches, finish Geeta’s request and the academy conversations to proceed to the Academy Ace Tournament.']
  ),sources:[BASE+'gymrematches.shtml',BASE+'academyacetournament.shtml'],related:[['finale','the-way-home'],['postgame','academy-ace']]
 },
 {
  kind:'postgame',id:'academy-ace',name:'Academy Ace Tournament: первое прохождение и повторы',nameEn:'Academy Ace Tournament: first clear and repeat runs',version:'both',
  location:'Mesagoza / академия',locationEn:'Mesagoza / academy',
  quick:'Турнир открывается после реваншей всех восьми лидеров. Первый состав соперников фиксирован; при повторных участиях он меняется.',
  quickEn:'The tournament opens after all eight Gym Leader rematches. Its first set of opponents is fixed; repeat runs use changing opponents.',
  steps:steps(
   ['Заверши поручение Geeta с восемью аренами и вступительные разговоры турнира в академии.','Finish Geeta’s eight-Gym inspection and the tournament’s introductory academy conversations.'],
   ['Пройди первый турнир: Arven → Jacq → Dendra → Geeta. Подготовь команду к четырём боям, а не только к одному лидеру типа.','Clear the first tournament: Arven → Jacq → Dendra → Geeta. Prepare for four battles rather than a single type-specialist leader.'],
   ['Досмотри завершение турнира и ответь на последующие звонки Jacq: они связаны с расследованием более сложных Tera Raid Battles.','Finish the tournament’s closing scenes and answer Jacq’s subsequent calls: they concern investigating tougher Tera Raid Battles.'],
   ['Для повторного участия вернись к регистрации турнира в академии. Соперники следующих заходов выбираются из списка участников; турнир можно проходить многократно ради наград.','For another run, return to tournament registration at the academy. Later opponents are selected from the participant pool, and the tournament can be repeated for rewards.']
  ),sources:[BASE+'academyacetournament.shtml',BASE+'teraraidbattles.shtml'],related:[['postgame','gym-rematches'],['postgame','six-star-raids']]
 },
 {
  kind:'postgame',id:'six-star-raids',name:'Как открыть 5★ и 6★ Tera Raid Battles',nameEn:'Unlocking 5★ and 6★ Tera Raid Battles',version:'both',
  quick:'5★ появляются после титров. Для стандартного открытия 6★ нужны Academy Ace Tournament и 10 побед в рейдах 4★ или 5★.',
  quickEn:'5★ raids appear after the credits. Standard 6★ unlocks require the Academy Ace Tournament and 10 wins in 4★ or 5★ raids.',
  steps:steps(
   ['Заверши The Way Home до титров: после этого в Палдее начинают появляться обычные рейды 5★. Само появление 5★ ещё не означает доступ к чёрным кристаллам 6★.','Finish The Way Home through the credits: ordinary 5★ raids then begin appearing in Paldea. Seeing 5★ raids does not yet mean black 6★ crystals are available.'],
   ['Пройди восемь реваншей арен и впервые выиграй Academy Ace Tournament. Затем ответь на звонок Jacq с просьбой исследовать рейды.','Complete the eight Gym rematches and win the Academy Ace Tournament for the first time. Then answer Jacq’s call asking you to investigate raids.'],
   ['После этого победи в 10 рейдах сложности 4★ или 5★. Рейды 1★–3★ не заменяют это условие; звёзды проверяй перед началом боя.','Next, win 10 raids rated 4★ or 5★. 1★–3★ raids do not satisfy this requirement; check the star rating before starting.'],
   ['Ответь на следующий звонок Jacq о необычном чёрном кристалле. После открытия в Палдее доступен один обычный рейд 6★ за реальный день.','Answer Jacq’s next call about an unusual black crystal. Once unlocked, Paldea has one regular 6★ raid per real-world day.'],
   ['Перед сложным рейдом проверь Tera-тип босса и подготовь Pokémon под него. Событийные рейды Poké Portal News — отдельные события, а не замена описанному постоянному открытию 6★.','Before a difficult raid, check the boss’s Tera Type and prepare an appropriate Pokémon. Poké Portal News event raids are separate events, not a replacement for this standard 6★ unlock.']
  ),sources:['https://bulbapedia.bulbagarden.net/wiki/Tera_Raid_Battle',BASE+'teraraidbattles.shtml'],related:[['postgame','academy-ace'],['postgame','iv-training']]
 },
 {
  kind:'postgame',id:'second-legendary',name:'Второй Koraidon или Miraidon: где поймать',nameEn:'Catching the second Koraidon or Miraidon',version:'both',
  location:'Area Zero, рядом с Zero Lab',locationEn:'Area Zero, beside Zero Lab',
  quick:'После The Way Home вернись к Zero Lab: в Scarlet там можно поймать второго Koraidon, в Violet — второго Miraidon.',
  quickEn:'After The Way Home, return to Zero Lab: Scarlet offers a second Koraidon there, while Violet offers a second Miraidon.',
  steps:steps(
   ['Заверши финальные события The Way Home и дождись возвращения свободного исследования после титров.','Complete The Way Home’s final events and return to free exploration after the credits.'],
   ['Вернись в Area Zero и спустись к Zero Lab. Осмотри пространство рядом с лабораторией, где стоит второй легендарный Pokémon.','Return to Area Zero and descend to Zero Lab. Check the area beside the laboratory, where the second Legendary Pokémon is standing.'],
   ['Подготовь Poké Balls и команду для поимки; взаимодействуй с Pokémon, чтобы начать обычный бой с возможностью поймать его.','Prepare Poké Balls and a catching team, then interact with the Pokémon to start a battle in which it can be caught.'],
   ['В Scarlet эта встреча даёт Koraidon, в Violet — Miraidon. Это отдельный Pokémon, а не замена твоего сюжетного транспорта.','Scarlet’s encounter is Koraidon; Violet’s is Miraidon. This is a separate Pokémon rather than a replacement for your story ride Pokémon.']
  ),sources:[BASE+'legendary.shtml'],related:[['finale','the-way-home']]
 },
 {
  kind:'postgame',id:'treasures-of-ruin',name:'Четыре Treasures of Ruin: колышки и святилища',nameEn:'The four Treasures of Ruin: stakes and shrines',version:'both',
  location:'Святилища и колышки по всей Палдее',locationEn:'Shrines and stakes throughout Paldea',
  quick:'Для каждого из четырёх святилищ нужно извлечь восемь соответствующих колышков. Raifort помогает отметить святилища на карте.',
  quickEn:'Each of the four shrines requires eight matching stakes to be removed. Raifort can help mark the shrines on your map.',
  steps:steps(
   ['Посещай History Classes в академии и развивай отношения с Raifort. В её рассказе о Treasures of Ruin есть помощь с расположением святилищ на карте.','Attend the academy’s History Classes and build your relationship with Raifort. Her Treasures of Ruin story helps locate the shrines on your map.'],
   ['Выбери одну цель и открой карту колышков по ссылке-источнику: Wo-Chien — юго-восток Палдеи, Chien-Pao — запад, Ting-Lu — район Casseroya Lake, Chi-Yu — северо-восток.','Choose a target and open the source’s stake map: Wo-Chien is in southeastern Paldea, Chien-Pao in the west, Ting-Lu around Casseroya Lake, and Chi-Yu in the northeast.'],
   ['Извлеки все восемь колышков, относящихся к выбранному святилищу. Колышки другого святилища не заменяют недостающие.','Remove all eight stakes belonging to the selected shrine. Stakes belonging to another shrine do not substitute for missing ones.'],
   ['Вернись к соответствующему святилищу после снятия всех восьми печатей и взаимодействуй с ним, чтобы вызвать легендарного Pokémon.','After removing all eight seals, return to the matching shrine and interact with it to encounter the Legendary Pokémon.'],
   ['Подготовься к поимке заранее. Для остальных трёх Pokémon повтори поиск их собственных восьми колышков; всего для четырёх святилищ нужно 32.','Prepare to catch the Pokémon beforehand. Repeat with each of the other three Pokémon’s own eight stakes; all four shrines require 32 in total.']
  ),sources:[BASE+'stakes.shtml',BASE+'legendary.shtml']
 },
 {
  kind:'postgame',id:'iv-training',name:'Подготовка к рейдам: IV Judge и Hyper Training',nameEn:'Raid preparation: IV Judge and Hyper Training',version:'both',
  location:'Pokémon Centers; Montenevera',locationEn:'Pokémon Centers; Montenevera',
  quick:'IV Judge открывается после The Way Home. Hyper Training выполняется в Montenevera для Pokémon уровня 50 и выше.',
  quickEn:'The IV Judge unlocks after The Way Home. Hyper Training is offered in Montenevera for Pokémon at level 50 or above.',
  steps:steps(
   ['После завершения The Way Home зайди в Pokémon Center, чтобы открыть IV Judge. В коробках нажми кнопку + для просмотра оценок IV.','After completing The Way Home, visit a Pokémon Center to unlock the IV Judge. In your boxes, press + to view IV ratings.'],
   ['Для Hyper Training подготовь Pokémon уровня 50 или выше и Bottle Cap либо Gold Bottle Cap.','For Hyper Training, prepare a Pokémon at level 50 or above and a Bottle Cap or Gold Bottle Cap.'],
   ['Найди мужчину с Abomasnow рядом с Pokémon Center в Montenevera и выбери нужные характеристики для тренировки.','Find the man with an Abomasnow beside Montenevera’s Pokémon Center and choose the stats you want to train.'],
   ['Разделяй действия: IV Judge показывает оценки, а Hyper Training улучшает характеристики за расходный предмет. Это подготовка к боям, а не условие открытия рейдов 6★.','Keep the actions separate: the IV Judge displays ratings, while Hyper Training improves stats using a consumable item. This prepares you for battles; it is not a 6★ raid unlock requirement.']
  ),sources:[BASE+'usefulcharacters.shtml'],related:[['postgame','six-star-raids']]
 }
];
