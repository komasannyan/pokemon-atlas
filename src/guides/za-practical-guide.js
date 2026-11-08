// Practical Z-A mechanics, checked against the linked Serebii pages.
// Each checklist is an original bilingual summary; no spawn rates are inferred.
export const ZA_PRACTICAL_GUIDE=[
 {
  kind:'help',id:'day-night-respawns',guideTopic:'day-night-respawns',
  name:'День, ночь и обновление диких покемонов',nameEn:'Day, night and wild Pokémon respawns',
  tags:'время часы скамейка bench respawn reset noibat noivern респаун',
  quick:'В Z-A действует собственный ускоренный цикл: скамейка позволяет перейти к следующему дню или ночи и обновляет ближайшие появления.',
  quickEn:'Z-A has its own accelerated clock. A bench skips to the next day or night and refreshes nearby spawns.',
  steps:[
   {id:'s01',ru:'Проверь нужное время в карточке зоны: день в игре длится с 04:00 до 20:00, ночь — с 20:00 до 04:00. Не сверяй эти часы с реальным временем консоли.',en:'Check the required time in the zone card: in-game day runs from 04:00 to 20:00 and night from 20:00 to 04:00. These are not your console’s real-world hours.'},
   {id:'s02',ru:'Чтобы сменить период, сядь на скамейку и выбери переход к следующему дню или ночи. При смене времени ближайшие дикие покемоны обновляются.',en:'To change the period, sit on a bench and skip to the next day or night. Nearby wild Pokémon refresh when the time changes.'},
   {id:'s03',ru:'Для повторной проверки точки можно также улететь в другой район и вернуться. После поимки или победы точке требуется время на восстановление; ожидание в меню не засчитывается.',en:'You can also fly to another area and return to check a spawn point again. A caught or defeated Pokémon leaves a respawn cooldown; time spent in menus does not count toward it.'},
   {id:'s04',ru:'Учитывай конкретную локацию, а не только название вида: Noibat и Noivern на улицах Люмиоса появляются ночью, но в Lumiose Sewers доступны независимо от времени суток.',en:'Check the location as well as the species: Noibat and Noivern appear at night in Lumiose City, but are available in Lumiose Sewers regardless of the time of day.'}
  ],
  sources:['https://www.serebii.net/legendsz-a/daynightcycle.shtml','https://www.serebii.net/legendsz-a/wildpokemon.shtml'],
  related:[['help','wild']]
 },
 {
  kind:'help',id:'catching-window',guideTopic:'catching-window',
  name:'Не получается поймать: злость, стрелки и окно после нокаута',nameEn:'Failed catches: rage, arrows and the knockout window',
  tags:'ловля не ловится покебол нельзя бросить ярость enraged backstrike knockout capture',
  quick:'Стрелки у цели показывают относительную вероятность поимки; разъярённого покемона сначала нужно успокоить боем.',
  quickEn:'The target arrows indicate catch likelihood. An enraged Pokémon cannot be caught by simply throwing another ball.',
  steps:[
   {id:'s01',ru:'Наведи прицел на покемона и проверь стрелки: чем их больше, тем выше шанс поимки. Если стрелок нет, в текущем состоянии поймать цель нельзя.',en:'Target the Pokémon and check the arrows: more arrows indicate a better catch chance. No arrows means it cannot be caught in its current state.'},
   {id:'s02',ru:'Попробуй незаметный бросок со спины до того, как покемон тебя заметит: backstrike повышает шанс поимки.',en:'Try an unnoticed throw from behind before the Pokémon spots you: a backstrike improves the catch chance.'},
   {id:'s03',ru:'После нескольких неудачных бросков покемон может разъяриться и перестать принимать Poké Balls. Переходи к бою и ослабляй его вместо бесконечных повторных бросков.',en:'After several failed throws, a Pokémon can become enraged and stop accepting Poké Balls. Switch to battling and weakening it rather than repeatedly throwing balls.'},
   {id:'s04',ru:'После первого нокаута дикого покемона появляется короткое окно для попытки поимки. Подготовь нужный Poké Ball заранее и следи за этим окном; сама поимка всё равно не гарантирована.',en:'The first knockout of a wild Pokémon provides a short capture window. Have the desired Poké Ball ready and watch for it; the catch is still not guaranteed.'},
   {id:'s05',ru:'Если высокоуровневая цель постоянно вырывается, учитывай и свой ранг Z-A Royale: он влияет на поимку вместе с уровнем цели. Alpha-покемонов обычно ловить сложнее.',en:'If a high-level target keeps escaping, consider your Z-A Royale rank too: it affects catch chances alongside the target’s level. Alpha Pokémon are generally harder to catch.'}
  ],
  sources:['https://www.serebii.net/legendsz-a/wildpokemon.shtml'],
  related:[['help','catch'],['help','royale']]
 },
 {
  kind:'help',id:'friendship-checker',guideTopic:'friendship-checker',
  name:'Дружба: как повысить и где проверить',nameEn:'Friendship: how to raise it and where to check',
  tags:'friendship happiness eevee riolu дружба эволюция roselia кафе скамейка',
  location:'Café Pokémon-Amie, Autumnal Avenue',locationEn:'Café Pokémon-Amie, Autumnal Avenue',
  quick:'Отдых на скамейке помогает всей команде, напиток в кафе — активному покемону; проверка дружбы открывается после побочного задания №25.',
  quickEn:'Benches help the whole party and a café drink helps the active Pokémon. The friendship checker is available after Side Mission 25.',
  steps:[
   {id:'s01',ru:'Для проверки дружбы сначала заверши побочное задание №25 «Trubblesome Patrons». Затем найди тренера с Roselia в Café Pokémon-Amie на Autumnal Avenue.',en:'For a friendship check, first finish Side Mission 25, Trubblesome Patrons. Then find the Trainer with Roselia at Café Pokémon-Amie on Autumnal Avenue.'},
   {id:'s02',ru:'Оставь нужного покемона в команде и посиди с командой на скамейке. Этот способ повышает дружбу всей команды, а не только активного покемона.',en:'Keep the Pokémon in your party and spend time with the party on a bench. This raises friendship for the whole party, not just the active Pokémon.'},
   {id:'s03',ru:'Для напитка в кафе сделай нужного покемона активным: прибавка дружбы от напитка относится именно к нему. Избегай повторных нокаутов — они понижают дружбу.',en:'Make the desired Pokémon active before having a café drink: the drink’s friendship gain applies to that Pokémon. Avoid repeated knockouts, which lower friendship.'},
   {id:'s04',ru:'Для эволюции по дружбе в Z-A достаточно значения 160, а не максимальных 255. У конкретного вида могут оставаться дополнительные условия, поэтому проверь его способ эволюции отдельно.',en:'Friendship-based evolutions in Z-A require 160 friendship, not the maximum of 255. A species may still have additional evolution conditions, so check its evolution method separately.'}
  ],
  sources:['https://www.serebii.net/legendsz-a/friendship.shtml','https://www.serebii.net/legendsz-a/useful.shtml'],
  related:[['side',25]]
 },
 {
  kind:'help',id:'plus-move-training',guideTopic:'plus-move-training',
  name:'Как освоить Plus Moves, в том числе атаки из TM',nameEn:'Mastering Plus Moves, including TM moves',
  tags:'plus moves плюс атака seed of mastery josee josée justice dojo семя мастерство',
  location:'Justice Dojo, Jaune District',locationEn:'Justice Dojo, Jaune District',
  quick:'Атаки из уровневого набора осваиваются при повышении уровня; для Plus-версии атаки из TM нужен Seed of Mastery и Josée.',
  quickEn:'Level-up moves can be mastered by gaining levels. A TM move needs a Seed of Mastery and Josée to become a Plus Move.',
  steps:[
   {id:'s01',ru:'Проверь, каким способом изучена атака. Атаки из уровневого набора покемона могут стать освоенными при дальнейшем повышении уровня; нужный уровень зависит от атаки.',en:'Check how the move is learned. Moves in the Pokémon’s level-up learnset can become mastered as it gains more levels; the required level depends on the move.'},
   {id:'s02',ru:'Чтобы освоить атаку раньше или получить Plus-версию атаки из TM, возьми Seed of Mastery и поговори с Josée в Justice Dojo в Jaune District.',en:'To master a move early, or to obtain a TM move’s Plus version, bring a Seed of Mastery to Josée at the Justice Dojo in the Jaune District.'},
   {id:'s03',ru:'Не жди, что атака из TM станет Plus Move только от прокачки: для неё используй обучение у Josée. Alpha-покемоны изначально имеют освоенные атаки.',en:'Do not expect a TM move to become a Plus Move just from leveling: use Josée’s training for it. Alpha Pokémon come with their moves already mastered.'},
   {id:'s04',ru:'В бою учитывай расход одного деления Mega Gauge на Plus Move. Эффект зависит от атаки: у атакующих усиливается урон, а у статусных могут меняться сила эффекта или длительность.',en:'In battle, account for the one-segment Mega Gauge cost of a Plus Move. The benefit depends on the move: attacks gain damage, while status moves can gain a stronger or longer-lasting effect.'}
  ],
  sources:['https://www.serebii.net/legendsz-a/plusmoves.shtml','https://www.serebii.net/legendsz-a/useful.shtml']
 },
 {
  kind:'help',id:'stat-training-services',guideTopic:'stat-training-services',
  name:'Проверка IV, Hyper Training и сброс EV',nameEn:'IV Judge, Hyper Training and resetting EVs',
  tags:'iv ev hyper training bottle cap judge reset характеристики пробки сброс dojo rust',
  quick:'После сюжета проверь IV в Pokémon Center; Hyper Training доступен с уровня 50, а сброс EV выполняется в Rust Syndicate Office.',
  quickEn:'After the story, unlock the IV Judge at a Pokémon Center. Hyper Training starts at level 50; EV resets are offered at the Rust Syndicate Office.',
  steps:[
   {id:'s01',ru:'После завершения сюжета зайди в Pokémon Center, чтобы открыть IV Judge. В коробках нажми правый стик контроллера для просмотра оценки IV.',en:'After finishing the story, visit a Pokémon Center to unlock the IV Judge. Press the controller’s Right Stick in your boxes to view IV ratings.'},
   {id:'s02',ru:'Для Hyper Training подготовь покемона уровня 50 или выше и Bottle Cap либо Gold Bottle Cap. Обратись к специалисту рядом с Josée в Justice Dojo в Jaune District.',en:'For Hyper Training, prepare a Pokémon at level 50 or above and a Bottle Cap or Gold Bottle Cap. Speak to the specialist next to Josée in the Justice Dojo, Jaune District.'},
   {id:'s03',ru:'Если нужно заново распределить EV, подойди к сотруднику у входа в Rust Syndicate Office в Bleu District. Полный сброс EV одного покемона стоит 5 Mega Shards.',en:'To redistribute EVs, speak to the receptionist at the Rust Syndicate Office entrance in the Bleu District. Resetting one Pokémon’s EVs costs 5 Mega Shards.'},
   {id:'s04',ru:'Не путай услуги: IV Judge только показывает оценку, Hyper Training улучшает характеристики, а сброс EV удаляет прежнее распределение усилий. Выбирай действие под свою задачу до расходования предметов.',en:'Keep the services separate: the IV Judge displays ratings, Hyper Training improves stats, and an EV reset removes the previous effort allocation. Choose the service you need before spending items.'}
  ],
  sources:['https://www.serebii.net/legendsz-a/useful.shtml']
 },
 {
  kind:'help',id:'research-counting',guideTopic:'research-counting',
  name:'Исследования Мейбл: почему действие не засчиталось',nameEn:'Mable’s research: why an action did not count',
  tags:'mable research shiny charm мейбл исследования очки счетчик обмен эволюция награды',
  quick:'Регистрация вида, поимка нужного типа и эволюция обменом — разные исследовательские задачи с разными правилами зачёта.',
  quickEn:'Registering a species, catching a type and evolving by trade are different research tasks with different counting rules.',
  steps:[
   {id:'s01',ru:'Прочитай формулировку конкретной задачи. Для «Filling Your Pokédex» подходят разные способы регистрации, включая поимку и эволюцию; задачи не требуют выполнения действий отдельно для каждого вида.',en:'Read the exact task wording. Filling Your Pokédex accepts different registration methods, including catching and evolving; research tasks are not a separate action checklist for each species.'},
   {id:'s02',ru:'Для задач «Catching … Types» лови диких покемонов нужного типа. Покемоны, полученные от других персонажей или игроков, в такие задачи поимки не засчитываются.',en:'For Catching … Types tasks, catch wild Pokémon of the requested type. Pokémon received from other people do not count toward these catching tasks.'},
   {id:'s03',ru:'Для «Evolving via Link Trade» эволюция засчитывается тому, кто получает эволюционирующего покемона после обмена. Если отправляешь своего покемона, заранее договорись об обратном обмене.',en:'For Evolving via Link Trade, the recipient of the Pokémon that evolves after the trade gets credit. If sending your own Pokémon, arrange a return trade beforehand.'},
   {id:'s04',ru:'Не пропускай задачи вне ловли: в списке есть восстановление ископаемых, отдых в кафе и на скамейках, победы в боях и разрушение Mega Crystals. Они тоже дают исследовательские очки.',en:'Do not overlook non-catching tasks: the list includes restoring fossils, relaxing at cafés and benches, winning battles and smashing Mega Crystals. These also award research points.'},
   {id:'s05',ru:'Сверяй награду с уровнем исследования: например, Master Ball выдаётся на уровне 49, Shiny Charm — на уровне 50. Это награды исследований, а не ранга Z-A Royale.',en:'Match the reward to the research level: for example, the Master Ball is awarded at level 49 and the Shiny Charm at level 50. These are research levels, not Z-A Royale ranks.'}
  ],
  sources:['https://www.serebii.net/legendsz-a/mablesresearch.shtml'],
  related:[['help','items']]
 }
];
