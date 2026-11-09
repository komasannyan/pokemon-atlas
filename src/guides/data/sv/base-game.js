// First base-game walkthrough. Levels below are the highest listed opponent
// level, not a recommended player level; Titan levels are deliberately omitted.
// Recommended interleaving follows Bulbapedia's walkthrough, Parts 4–21.
const SEREBII='https://www.serebii.net/scarletviolet/';
const WALKTHROUGH='https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Scarlet_and_Violet';
const ORDER='https://www.nintendolife.com/guides/pokemon-scarlet-and-violet-gym-order-which-path-should-i-do-first';
const steps=(...pairs)=>pairs.map(([ru,en],i)=>({id:'s'+String(i+1).padStart(2,'0'),ru,en}));
const gym=(id,name,order,location,level,quick,quickEn,objectives)=>({
 kind:'gym',id,name,order,location,locationEn:location,level,quick,quickEn,version:'both',
 steps:steps(...objectives),sources:[SEREBII+'gyms.shtml',...(id===5?[WALKTHROUGH+'/Part_14']:[])],related:[['route','paldea-order']]
});
const titan=(id,name,order,location,quick,quickEn,objectives)=>({
 kind:'titan',id,name,order,location,locationEn:location,quick,quickEn,version:'both',
 steps:steps(...objectives),sources:[SEREBII+'pathoflegends.shtml',...(id===3?['https://www.serebii.net/abilitydex/eartheater.shtml']:[])],related:[['route','paldea-order']]
});
const star=(id,name,order,location,level,quick,quickEn,objectives)=>({
 kind:'star',id,name,order,location,locationEn:location,level,quick,quickEn,version:'both',
 steps:steps(...objectives),sources:[SEREBII+'starfallstreet.shtml',WALKTHROUGH+'/Part_8'],related:[['help','star-barrage'],['route','paldea-order']]
});

export const SV_TABS=[
 ['start','Начало и маршрут','Start & route'],['gym','Victory Road · Арены','Victory Road · Gyms'],
 ['titan','Path of Legends · Титаны','Path of Legends · Titans'],['star','Starfall Street','Starfall Street'],
 ['finale','Финалы историй','Story finales'],['help','Помощь','Help']
];

export const SV_GUIDE=[
 {
  kind:'route',id:'first-steps',name:'Начало: Cabo Poco → Mesagoza',nameEn:'Getting started: Cabo Poco → Mesagoza',version:'both',
  location:'Cabo Poco, Poco Path, Los Platos, Mesagoza',locationEn:'Cabo Poco, Poco Path, Los Platos, Mesagoza',
  quick:'Дойди до академии и начала Treasure Hunt: после вступления доступны три основные истории.',
  quickEn:'Reach the academy and begin the Treasure Hunt: the introduction opens the three main stories.',
  steps:steps(
   ['Выбери стартового Pokémon в Cabo Poco и пройди вступительные события с Nemona.','Choose your first Pokémon in Cabo Poco and complete the introductory events with Nemona.'],
   ['Следуй по Poco Path; после событий у Inlet Grotto и маяка продолжай через Los Platos к Mesagoza.','Follow Poco Path; after the Inlet Grotto and lighthouse events, continue through Los Platos to Mesagoza.'],
   ['Пройди вступление в академии: Naranja Academy в Scarlet, Uva Academy в Violet.','Complete the academy introduction: Naranja Academy in Scarlet, Uva Academy in Violet.'],
   ['После начала Treasure Hunt выбирай между Victory Road, Path of Legends и Starfall Street; переключаться между ними можно.','Once the Treasure Hunt starts, choose between Victory Road, Path of Legends and Starfall Street; you can alternate between them.']
  ),sources:[WALKTHROUGH],related:[['route','paldea-order']]
 },
 {
  kind:'route',id:'paldea-order',name:'Маршрут по Палдее: как чередовать три истории',nameEn:'Paldea route: alternating the three stories',version:'both',
  quick:'Это рекомендуемый маршрут от простых испытаний к сложным, а не обязательный порядок. Уровни лидеров арен не масштабируются.',
  quickEn:'This is a suggested easier-to-harder route, not a mandatory order. Gym Leader levels do not scale.',
  steps:steps(
   ['Начни с Katy в Cortondo, затем Klawf в South Province Area Three и Brassius в Artazon.','Start with Katy in Cortondo, then Klawf in South Province Area Three and Brassius in Artazon.'],
   ['Далее: Bombirdier → Giacomo → Iono → Mela → Orthworm → Kofu → Atticus.','Next: Bombirdier → Giacomo → Iono → Mela → Orthworm → Kofu → Atticus.'],
   ['Продолжай: Larry → Ryme → титан Asado Desert → Tulip → Grusha → Ortega → Dondozo/Tatsugiri → Eri.','Continue: Larry → Ryme → the Asado Desert Titan → Tulip → Grusha → Ortega → Dondozo/Tatsugiri → Eri.'],
   ['Заверши каждую историю отдельным финалом: Лига и Nemona, бой с Arven, затем развязка с Clavell и Penny. Одних 18 значков недостаточно для The Way Home.','Finish each story with its own finale: the League and Nemona, Arven’s battle, and the Clavell/Penny conclusion. The 18 badges alone do not complete the prerequisites for The Way Home.'],
   ['После завершения всех трёх историй отправляйся к Zero Gate для The Way Home. Затем открой раздел «После титров». DLC в этот гайд не входит.','After completing all three stories, head to Zero Gate for The Way Home. Then open the Postgame section. DLC is outside this guide.']
  ),sources:[WALKTHROUGH,ORDER,SEREBII+'thewayhome.shtml'],related:[['finale','victory-road'],['finale','arven'],['finale','starfall'],['finale','the-way-home']]
 },
 gym(1,'Katy · Cortondo',1,'Cortondo',15,
  'Испытание — Olive Roll; финальный Teddiursa получает Bug Tera Type.',
  'The test is the Olive Roll; the final Teddiursa uses a Bug Tera Type.',[
   ['Зарегистрируйся на испытание арены Cortondo и отправляйся на поле Olive Roll.','Register for the Cortondo Gym Test and head to the Olive Roll field.'],
   ['Толкай большую оливку через полосу препятствий до конечной корзины.','Push the giant olive through the obstacle course into the final basket.'],
   ['Вернись к арене и победи Katy. Её Teddiursa террасталлизуется в Bug-тип, поэтому обычный Normal-тип Teddiursa не определяет его уязвимости в этой фазе.','Return to the Gym and defeat Katy. Her Teddiursa Terastallizes into Bug, so its usual Normal typing does not determine its weaknesses in that phase.']
  ]),
 titan(1,'Klawf · Stony Cliff Titan',2,'South Province Area Three',
  'После двух фаз боя и сюжетного сэндвича открывается рывок Koraidon/Miraidon.',
  'The two-phase encounter and story sandwich unlock Koraidon/Miraidon’s dash.',[
   ['Найди огромного Klawf на скалах South Province Area Three и начни первый бой.','Find the giant Klawf on the cliffs in South Province Area Three and start the first battle.'],
   ['Следуй за отступившим титаном к открытой им пещере; во второй фазе Arven присоединится к бою.','Follow the retreating Titan to the cave it opens; Arven joins the second battle.'],
   ['Досмотри сцену с Herba Mystica и сэндвичем: награда путешествия — способность делать рывок.','Finish the Herba Mystica and sandwich scene: the traversal reward is the ability to dash.']
  ]),
 gym(2,'Brassius · Artazon',3,'Artazon',17,
  'Собери 10 Sunflora; Sudowoodo в финале становится Grass-типа.',
  'Gather 10 Sunflora; the final Sudowoodo becomes Grass-type.',[
   ['Зарегистрируйся в арене Artazon и начни поиск Sunflora по городу.','Register at Artazon Gym and begin the Sunflora search around town.'],
   ['Найди 10 Sunflora и приведи их к месту сдачи испытания; некоторые сначала вступают в бой.','Find 10 Sunflora and return them to the test’s starting area; some battle you first.'],
   ['Победи Brassius. Планируй заключительный бой против Grass Tera Sudowoodo, а не обычного Rock-типа.','Defeat Brassius. Plan the final matchup around Grass Tera Sudowoodo rather than its usual Rock type.']
  ]),
 titan(2,'Bombirdier · Open Sky Titan',4,'West Province Area One',
  'Поднимись по склону мимо валунов; после титана открывается плавание.',
  'Climb the slope past the falling boulders; the Titan unlocks swimming.',[
   ['В West Province Area One поднимись по горному склону, уклоняясь от падающих валунов.','In West Province Area One, climb the mountain slope while avoiding falling boulders.'],
   ['Победи Bombirdier в первом бою, затем следуй за ним к пещере для второй фазы с Arven.','Defeat Bombirdier in the first battle, then follow it to the cave for the second phase with Arven.'],
   ['После сцены с сэндвичем Koraidon/Miraidon сможет плавать. Это пригодится для дальнейших водных маршрутов.','After the sandwich scene, Koraidon/Miraidon can swim, opening later water routes.']
  ]),
 star(1,'Giacomo · Segin Squad',5,'West Province Area One',21,
  'Dark-база Team Star; после Star Barrage предстоит бой с Giacomo и Starmobile.',
  'Team Star’s Dark base; the Star Barrage leads to Giacomo and his Starmobile.',[
   ['Подойди к Segin Squad’s Base в West Province Area One и пройди события у входа.','Approach Segin Squad’s Base in West Province Area One and complete the entrance events.'],
   ['Пройди Star Barrage: победи 30 Pokémon за 10 минут с помощью первых трёх Pokémon команды.','Clear the Star Barrage: defeat 30 Pokémon in 10 minutes using the first three Pokémon in your party.'],
   ['Победи Pawniard Giacomo и его Dark Starmobile; затем заверши разговоры после базы.','Defeat Giacomo’s Pawniard and Dark Starmobile, then finish the post-base conversations.']
  ]),
 gym(3,'Iono · Levincia',6,'Levincia',24,
  'Найди Clavell на изображениях; Mismagius имеет Electric Tera Type и Levitate.',
  'Find Clavell in the images; Mismagius has an Electric Tera Type and Levitate.',[
   ['Начни испытание в арене Levincia и участвуй в трансляции Iono.','Start the test at Levincia Gym and join Iono’s stream.'],
   ['Находи Clavell в показанных городских сценах и выигрывай бои между этапами поиска.','Find Clavell in the displayed town scenes and win the battles between search rounds.'],
   ['Победи Iono. Не рассчитывай только на Ground-атаки: её Electric Tera Mismagius сохраняет Levitate.','Defeat Iono. Do not rely only on Ground moves: her Electric Tera Mismagius retains Levitate.']
  ]),
 star(2,'Mela · Schedar Squad',7,'East Province Area One',27,
  'Fire-база: после Star Barrage Mela использует Torkoal и Fire Starmobile.',
  'The Fire base: after the Star Barrage, Mela uses Torkoal and a Fire Starmobile.',[
   ['Найди Schedar Squad’s Base в East Province Area One и заверши события перед воротами.','Find Schedar Squad’s Base in East Province Area One and finish the gate events.'],
   ['Подготовь первых трёх Pokémon для Star Barrage и победи 30 противников за 10 минут.','Prepare your first three Pokémon for the Star Barrage and defeat 30 opponents in 10 minutes.'],
   ['Выиграй бой против Torkoal и Fire Starmobile Mela, затем заверши диалоги у базы.','Win against Mela’s Torkoal and Fire Starmobile, then complete the base’s closing dialogue.']
  ]),
 titan(3,'Orthworm · Lurking Steel Titan',8,'East Province Area Three',
  'В карьерах преследуй Orthworm; победа открывает высокий прыжок. Ground-атаки поглощает Earth Eater.',
  'Chase Orthworm through the mining area; victory unlocks the high jump. Earth Eater absorbs Ground moves.',[
   ['Найди Orthworm в карьерах East Province Area Three и преследуй его, пока не начнётся бой.','Find Orthworm in the East Province Area Three mining area and chase it until the battle starts.'],
   ['После отступления титана найди его снова и заверши вторую фазу с Arven. У Orthworm способность Earth Eater.','Find the Titan again after it retreats and finish the second phase with Arven. Orthworm has Earth Eater.'],
   ['Заверши сцену с Herba Mystica: Koraidon/Miraidon получит высокий прыжок.','Complete the Herba Mystica scene: Koraidon/Miraidon gains the high jump.']
  ]),
 gym(4,'Kofu · Cascarrafa',9,'Cascarrafa / Porto Marinada',30,
  'Отнеси кошелёк Kofu на аукцион Porto Marinada, затем вернись в арену Cascarrafa.',
  'Take Kofu’s wallet to Porto Marinada’s auction, then return to Cascarrafa Gym.',[
   ['Подойди к арене Cascarrafa: Kofu убежит, а сотрудник передаст его кошелёк.','Approach Cascarrafa Gym: Kofu runs off and an attendant gives you his wallet.'],
   ['Отправляйся в Porto Marinada, верни кошелёк и выиграй порученный Kofu аукцион.','Travel to Porto Marinada, return the wallet and win the auction Kofu asks you to enter.'],
   ['Вернись в Cascarrafa и победи Kofu; его последний Crabominable получает Water Tera Type.','Return to Cascarrafa and defeat Kofu; his final Crabominable uses a Water Tera Type.']
  ]),
 star(3,'Atticus · Navi Squad',10,'Tagtree Thicket',33,
  'Poison-база в Tagtree Thicket; у Atticus есть обычный Revavroom и отдельный Starmobile.',
  'The Poison base in Tagtree Thicket; Atticus has a regular Revavroom and a separate Starmobile.',[
   ['Найди Navi Squad’s Base в Tagtree Thicket и пройди входные события.','Find Navi Squad’s Base in Tagtree Thicket and complete the entrance events.'],
   ['Во время Star Barrage победи 30 Pokémon за 10 минут; следи за здоровьем трёх отправленных Pokémon.','Defeat 30 Pokémon in 10 minutes during the Star Barrage; watch the health of the three Pokémon you send out.'],
   ['Победи команду Atticus и Poison Starmobile. Обычный Revavroom в его команде — не последний противник.','Defeat Atticus’s team and Poison Starmobile. The regular Revavroom on his team is not the final opponent.']
  ]),
 gym(5,'Larry · Medali',11,'Medali / Treasure Eatery',36,
  'Секретный заказ: grilled rice balls, medium, extra crispy (Fire Blast style), lemon.',
  'The secret order: grilled rice balls, medium, extra crispy (Fire Blast style), lemon.',[
   ['Начни испытание арены Medali и собери подсказки о секретном заказе Treasure Eatery.','Begin Medali’s Gym Test and collect clues for Treasure Eatery’s secret menu item.'],
   ['В ресторане закажи grilled rice balls → medium → extra crispy, Fire Blast style → lemon.','At the restaurant, order grilled rice balls → medium → extra crispy, Fire Blast style → lemon.'],
   ['После раскрытия арены победи Larry; его Staraptor террасталлизуется в Normal-тип.','Once the battlefield is revealed, defeat Larry; his Staraptor Terastallizes into Normal.']
  ]),
 gym(6,'Ryme · Montenevera',12,'Montenevera',42,
  'Испытание и бой лидера проходят в формате Double Battle: подготовь двух Pokémon.',
  'The test and Gym Leader battle are Double Battles: prepare two Pokémon.',[
   ['Поднимись в Montenevera на Glaseado Mountain и зарегистрируйся на испытание арены.','Reach Montenevera on Glaseado Mountain and register for the Gym Test.'],
   ['Выиграй серию двойных боёв перед концертом Ryme; учитывай усиления от зрителей.','Win the series of Double Battles before Ryme’s performance; account for the audience’s stat boosts.'],
   ['Победи Ryme в двойном бою. Её финальный Toxtricity получает Ghost Tera Type.','Defeat Ryme in a Double Battle. Her final Toxtricity uses a Ghost Tera Type.']
  ]),
 titan(4,'Quaking Earth Titan · Great Tusk / Iron Treads',13,'Asado Desert',
  'В Scarlet титан — Great Tusk, в Violet — Iron Treads. Победа открывает планирование.',
  'Scarlet has Great Tusk; Violet has Iron Treads. Victory unlocks gliding.',[
   ['Найди Quaking Earth Titan в Asado Desert: Great Tusk в Scarlet или Iron Treads в Violet.','Find the Quaking Earth Titan in Asado Desert: Great Tusk in Scarlet or Iron Treads in Violet.'],
   ['Выиграй первую фазу, проследуй за титаном к пещере и победи его вместе с Arven.','Win the first phase, follow the Titan to the cave and defeat it alongside Arven.'],
   ['Досмотри сцену с сэндвичем: Koraidon/Miraidon получит возможность планировать в воздухе.','Finish the sandwich scene: Koraidon/Miraidon gains the ability to glide through the air.']
  ]),
 gym(7,'Tulip · Alfornada',14,'Alfornada',45,
  'Повторяй эмоции за Dendra и выигрывай промежуточные бои; финальный Florges имеет Psychic Tera Type.',
  'Match Dendra’s emotions and win the intervening battles; the final Florges has a Psychic Tera Type.',[
   ['Доберись до Alfornada и зарегистрируйся на Gym Test.','Reach Alfornada and register for the Gym Test.'],
   ['На тренировке с Dendra нажимай кнопки нужных эмоций и выигрывай бои между раундами.','During Dendra’s training, press the buttons for the requested emotions and win the battles between rounds.'],
   ['После испытания победи Tulip; её Florges в последней фазе становится Psychic-типа.','After the test, defeat Tulip; her Florges becomes Psychic-type in the final phase.']
  ]),
 gym(8,'Grusha · Glaseado',15,'Glaseado Mountain',48,
  'Пройди спуск через ворота за 1 минуту 30 секунд; Altaria станет Ice-типа.',
  'Complete the downhill gates within 1 minute 30 seconds; Altaria becomes Ice-type.',[
   ['Найди арену Glaseado на горе и начни испытание со спуском на Koraidon/Miraidon.','Find Glaseado Gym on the mountain and begin the Koraidon/Miraidon downhill test.'],
   ['Проедь через ворота и закончи спуск за 1 минуту 30 секунд.','Ride through the gates and finish the descent within 1 minute 30 seconds.'],
   ['Вернись к арене и победи Grusha; его последний Altaria использует Ice Tera Type.','Return to the Gym and defeat Grusha; his final Altaria uses an Ice Tera Type.']
  ]),
 star(4,'Ortega · Ruchbah Squad',16,'North Province Area Three',51,
  'Fairy-база на севере; перед Star Barrage нужно пройти бой у входа.',
  'The Fairy base in the north; an entrance battle precedes the Star Barrage.',[
   ['Доберись до Ruchbah Squad’s Base в North Province Area Three и победи Harrison у входа.','Reach Ruchbah Squad’s Base in North Province Area Three and defeat Harrison at the entrance.'],
   ['Пройди Star Barrage и победи 30 Pokémon за 10 минут.','Clear the Star Barrage by defeating 30 Pokémon in 10 minutes.'],
   ['Победи Ortega и Fairy Starmobile, затем заверши разговоры с Clive и Cassiopeia.','Defeat Ortega and the Fairy Starmobile, then complete the conversations with Clive and Cassiopeia.']
  ]),
 titan(5,'Dondozo & Tatsugiri · False Dragon Titan',17,'Casseroya Lake',
  'Нужны обе встречи с Dondozo и последующий бой с Tatsugiri; награда — лазание по скалам.',
  'Finish both Dondozo encounters and the following Tatsugiri battle; the reward is climbing.',[
   ['Доберись до острова Casseroya Lake с необычным Tatsugiri; при взаимодействии появляется Dondozo.','Reach the Casseroya Lake island with the unusual Tatsugiri; interacting with it brings out Dondozo.'],
   ['Победи Dondozo, найди его после отступления и выиграй вторую фазу вместе с Arven.','Defeat Dondozo, find it after it retreats and win the second phase with Arven.'],
   ['После Dondozo отдельно победи Tatsugiri: сюжет не заканчивается на втором бое с Dondozo.','After Dondozo, defeat Tatsugiri separately: the objective is not finished after Dondozo’s second battle.'],
   ['Заверши сцену с Herba Mystica — Koraidon/Miraidon научится взбираться по скалам.','Complete the Herba Mystica scene — Koraidon/Miraidon learns to climb cliffs.']
  ]),
 star(5,'Eri · Caph Squad',18,'North Province Area Two',56,
  'Fighting-база с самой сильной командой среди пяти боссов; после неё ещё остаётся финал Starfall Street.',
  'The Fighting base has the highest-level team among the five bosses; the Starfall Street finale still follows.',[
   ['Найди Caph Squad’s Base в North Province Area Two и заверши события у ворот.','Find Caph Squad’s Base in North Province Area Two and finish the gate events.'],
   ['Победи 30 Pokémon в Star Barrage и подготовься к команде Eri и Fighting Starmobile.','Defeat 30 Pokémon in the Star Barrage and prepare for Eri’s team and Fighting Starmobile.'],
   ['После победы заверши звонок Cassiopeia; если все пять баз пройдены, продолжай историю в академии.','After winning, finish Cassiopeia’s call; once all five bases are cleared, continue the story at the academy.']
  ]),
 {
  kind:'finale',id:'victory-road',name:'Victory Road · Лига и Nemona',nameEn:'Victory Road · League and Nemona',version:'both',
  location:'Pokémon League → Mesagoza',locationEn:'Pokémon League → Mesagoza',
  quick:'После восьми арен пройди Champion Assessment, Elite Four, Geeta и заключительный бой с Nemona.',
  quickEn:'After all eight Gyms, complete the Champion Assessment, Elite Four, Geeta and the final Nemona battle.',
  steps:steps(
   ['Собрав восемь значков арен, отправляйся в Pokémon League и пройди собеседование Rika.','With eight Gym Badges, visit the Pokémon League and pass Rika’s interview.'],
   ['Победи Elite Four в порядке Rika → Poppy → Larry → Hassel. Larry здесь использует Flying-тип, а не Normal-тип арены.','Defeat the Elite Four in order: Rika → Poppy → Larry → Hassel. Here Larry specializes in Flying rather than his Gym’s Normal type.'],
   ['Победи Top Champion Geeta и получи Champion Rank.','Defeat Top Champion Geeta and earn the Champion Rank.'],
   ['Заверши бой с Nemona в Mesagoza: её команда зависит от выбранного тобой стартового Pokémon. Это завершение Victory Road.','Finish the Nemona battle in Mesagoza: her team depends on your starter choice. This completes Victory Road.']
  ),sources:[SEREBII+'victoryroad.shtml'],related:[['finale','the-way-home']]
 },
 {
  kind:'finale',id:'arven',name:'Path of Legends · Последний бой с Arven',nameEn:'Path of Legends · Arven’s final battle',version:'both',
  location:'Poco Path Lighthouse',locationEn:'Poco Path Lighthouse',
  quick:'После пяти титанов вернись к лаборатории у маяка; история завершается боем с Arven, а не пятым значком.',
  quickEn:'After the five Titans, return to the lighthouse lab; Arven’s battle, not the fifth badge, closes the story.',
  steps:steps(
   ['Заверши всех пятерых титанов, включая отдельную заключительную фазу Tatsugiri.','Finish all five Titans, including Tatsugiri’s separate final phase.'],
   ['После звонка профессора вернись к маяку Poco Path и войди в лабораторию вместе с Arven.','After the professor’s call, return to Poco Path Lighthouse and enter the lab with Arven.'],
   ['Победи Arven, включая его восстановившегося Mabosstiff, и досмотри разговор о спутниках для Area Zero.','Defeat Arven, including his recovered Mabosstiff, and finish the discussion about companions for Area Zero.']
  ),sources:[SEREBII+'pathoflegends.shtml'],related:[['finale','the-way-home']]
 },
 {
  kind:'finale',id:'starfall',name:'Starfall Street · Clavell и Cassiopeia',nameEn:'Starfall Street · Clavell and Cassiopeia',version:'both',
  location:'Mesagoza / Naranja Academy (Scarlet), Uva Academy (Violet)',locationEn:'Mesagoza / Naranja Academy (Scarlet), Uva Academy (Violet)',
  quick:'Пять баз не завершают историю: нужны Clavell, вечерняя встреча с Penny и заключительные разговоры.',
  quickEn:'The five bases are not the end: finish Clavell, the nighttime Penny meeting and the closing conversations.',
  steps:steps(
   ['После пяти баз Team Star встреться с Clive у академии Mesagoza и победи Director Clavell.','After all five Team Star bases, meet Clive by Mesagoza’s academy and defeat Director Clavell.'],
   ['Ночью приди на школьный двор по приглашению Cassiopeia и победи Penny.','At night, visit the schoolyard as Cassiopeia requested and defeat Penny.'],
   ['После сюжетных сцен посети кабинет директора, затем ответь на звонок Penny и встреться с ней в Mesagoza.','After the story scenes, visit the director’s office, then answer Penny’s call and meet her in Mesagoza.'],
   ['Получи от Penny TM169; заверши эту развязку перед отправлением к Zero Gate.','Receive TM169 from Penny; finish this conclusion before heading to Zero Gate.']
  ),sources:[SEREBII+'starfallstreet.shtml'],related:[['finale','the-way-home']]
 },
 {
  kind:'finale',id:'the-way-home',name:'The Way Home · Area Zero',version:'both',
  location:'Zero Gate → Area Zero → Zero Lab',locationEn:'Zero Gate → Area Zero → Zero Lab',
  quick:'Финал основной игры открывается только после Victory Road, Path of Legends и Starfall Street. Ниже есть сюжетные спойлеры.',
  quickEn:'The base-game finale opens after Victory Road, Path of Legends and Starfall Street. The steps below contain story spoilers.',
  steps:steps(
   ['Заверши все три истории, включая их финальные бои, и встреться с Arven, Nemona и Penny у Zero Gate.','Complete all three stories, including their final battles, and meet Arven, Nemona and Penny at Zero Gate.'],
   ['Спускайся в Area Zero и отключи четыре замка в четырёх Research Stations.','Descend into Area Zero and release the four locks at the four Research Stations.'],
   ['У Research Station 2 встречается Scream Tail в Scarlet или Iron Bundle в Violet; у станции 3 — Great Tusk или Iron Treads соответственно.','At Research Station 2, Scarlet has Scream Tail and Violet has Iron Bundle; Station 3 has Great Tusk or Iron Treads respectively.'],
   ['Открой Zero Lab и заверши бои у входа. В лаборатории тебя ждёт AI Sada в Scarlet или AI Turo в Violet.','Open Zero Lab and finish the entrance battles. Inside, Scarlet has AI Sada and Violet has AI Turo.'],
   ['После боя с AI обычные Poké Balls блокируются: выбери своего Koraidon/Miraidon для заключительного сюжетного боя.','After the AI battle, normal Poké Balls are locked: select your own Koraidon/Miraidon for the final story battle.'],
   ['Победи второго Koraidon в Scarlet или второго Miraidon в Violet и досмотри сцены до титров.','Defeat the other Koraidon in Scarlet or the other Miraidon in Violet and finish the scenes through the credits.']
  ),sources:[SEREBII+'thewayhome.shtml'],related:[['finale','victory-road'],['finale','arven'],['finale','starfall']]
 },
 {
  kind:'help',id:'star-barrage',name:'Star Barrage · почему не хватает времени',nameEn:'Star Barrage · running out of time',version:'both',
  quick:'Задача — 30 Pokémon за 10 минут; для автоатак используются первые три Pokémon в команде.',
  quickEn:'The goal is 30 Pokémon in 10 minutes; auto battles use the first three Pokémon in your party.',
  steps:steps(
   ['Перед входом поставь подходящих Pokémon в первые три слота: именно они участвуют в Star Barrage.','Before entering, place suitable Pokémon in your first three party slots: those are used in the Star Barrage.'],
   ['Нажимай R для автоатак по группам Pokémon и следи за счётчиком 30 побед и таймером 10 минут.','Press R for auto battles against groups and watch the counter of 30 defeats and the 10-minute timer.'],
   ['Если здоровье заканчивается, поговори с Clive или используй торговый автомат базы для лечения; затем продолжай до появления босса.','If health runs low, speak to Clive or use a base vending machine to heal, then continue until the boss appears.']
  ),sources:[SEREBII+'starfallstreet.shtml',WALKTHROUGH+'/Part_8']
 },
 {
  kind:'help',id:'scope-and-levels',name:'Уровни, порядок и границы этого гайда',nameEn:'Levels, route order and guide scope',version:'both',
  quick:'Число уровня в карточке — максимальный уровень Pokémon соперника, а не гарантия готовности твоей команды.',
  quickEn:'A card’s level is the opponent’s highest Pokémon level, not a guarantee that your team is ready.',
  steps:steps(
   ['Уровни лидеров арен фиксированы: поздний визит к Katy не повышает уровень её команды.','Gym Leader levels are fixed: visiting Katy later does not raise her team’s levels.'],
   ['Рекомендуемый маршрут чередует три истории; если встреча слишком сложная, вернись к более ранней цели и подготовь команду.','The suggested route alternates the three stories; if an encounter is too difficult, return to an earlier objective and prepare your team.'],
   ['Это первый гайд по основной игре до титров. Раздел «После титров» описывает первые постгейм-задачи. The Teal Mask, The Indigo Disk, эпилог и полный список TM пока не покрыты.','This is the first base-game guide through the credits. The Postgame section covers initial postgame tasks. The Teal Mask, The Indigo Disk, the epilogue and the full TM list are not covered yet.']
  ),sources:[ORDER,WALKTHROUGH],related:[['route','paldea-order']]
 }
];
