// Pokémon Atlas 0.3: explicitly curated prototype builds, not an official tier/legality database.
// Never silently treat a set from one format as legal in a different format.
export const FORMATS = {
 casual:{label:'Gen 9 Singles · Casual',titleRu:'Обычные одиночные · Gen 9',doubles:false,champions:false,min:3,descriptionRu:'Свободные одиночные бои. Это тестовый набор, а не официальный лестничный формат.',descriptionEn:'Casual singles prototype, not an official ladder format.'},
 ou:{label:'Gen 9 OU · Singles',titleRu:'Gen 9 OU · одиночные',doubles:false,champions:false,min:3,descriptionRu:'Прототип команд для Smogon OU. Актуальную легальность и бан-лист нужно проверять на Showdown.',descriptionEn:'Prototype for Smogon OU. Validate tier legality and bans on Showdown.'},
 uu:{label:'Gen 9 UU · Singles',titleRu:'Gen 9 UU · одиночные',doubles:false,champions:false,min:3,descriptionRu:'Отдельный пул UU: не переносит автоматически OU-сборки. Тиринг меняется, проверяй перед матчем.',descriptionEn:'Independent UU pool. Usage-based tiers may change; verify before playing.'},
 ubers:{label:'Gen 9 Ubers · Singles',titleRu:'Gen 9 Ubers · одиночные',doubles:false,champions:false,min:3,descriptionRu:'Пул мощных покемонов и поддержки для Ubers; наборы — отправная точка, не гарантия легальности.',descriptionEn:'Ubers candidate builds; not a substitute for format validation.'},
 doubles:{label:'Gen 9 Doubles OU',titleRu:'Gen 9 Doubles OU',doubles:true,champions:false,min:4,descriptionRu:'Двойные бои Smogon с Protect, контролем скорости, Fake Out и поддержкой партнёров.',descriptionEn:'Smogon Doubles OU with partner support, speed control and Protect.'},
 natdex:{label:'Gen 9 National Dex · Singles',titleRu:'Gen 9 National Dex · одиночные',doubles:false,champions:false,min:3,descriptionRu:'National Dex допускает механики прошлых поколений по собственным правилам. Наличие Mega в сборке не означает автоматическую легальность.',descriptionEn:'National Dex has its own mechanics and rules. Mega suggestions require format validation.'},
 champions:{label:'Pokémon Champions · M-C Doubles',titleRu:'Pokémon Champions · M-C Doubles',doubles:true,champions:true,min:4,descriptionRu:'Регламент M-C (09.09–02.12.2026). 66 Stat Points, до 32 в характеристику; ограничения по видам и предметам. Пул и атаки сверяются с таблицами Pokémon Showdown.',descriptionEn:'Regulation M-C (Sep 9–Dec 2, 2026). 66 Stat Points (max 32/stat), Species + Item Clause. Species and learnsets are filtered using Pokémon Showdown data.'}
};
export const ROLE_NAMES={
 lead:['Лидер с ловушками','Hazard lead'],hazards:['Ловушки','Hazards'],removal:['Удаление ловушек','Hazard removal'],physical:['Физический атакующий','Physical attacker'],special:['Специальный атакующий','Special attacker'],setup:['Свипер с усилением','Setup sweeper'],wall:['Защитный покемон','Wall'],pivot:['Переключения / Pivot','Pivot'],support:['Поддержка','Support'],speed:['Контроль скорости','Speed control'],redirect:['Перенаправление','Redirection'],weather:['Погода','Weather setter'],mega:['Мега-атакующий','Mega attacker'],tank:['Танк','Bulky attacker'],trickroom:['Trick Room','Trick Room']
};
export const ROLE_DESC={
 lead:['Ставит ловушки, создаёт давление в начале матча; часто рассчитан на короткое пребывание на поле.','Sets hazards and applies early pressure.'],
 hazards:['Создаёт долгосрочное давление ловушками на стороне соперника.','Maintains hazard pressure.'],
 removal:['Убирает ловушки, защищая покемонов при переключениях.','Clears hazards to protect switches.'],
 physical:['Наносит физический урон и пробивает специальные стены.','Physical damage and wallbreaking.'],
 special:['Наносит специальный урон и вынуждает оборонительные перестановки.','Special damage and wallbreaking.'],
 setup:['Повышает характеристики, чтобы завершить игру после ослабления соперника.','Boosts stats for a late-game sweep.'],
 wall:['Сдерживает угрозы, лечится и помогает безопасно переключаться.','Checks threats and soaks hits.'],
 pivot:['Создаёт выгодные переключения через U-turn, Volt Switch или поддержку.','Creates advantageous switches.'],
 support:['Создаёт условия для союзников с помощью статусов, экранов и других эффектов.','Enables teammates using status and utility.'],
 speed:['Управляет порядком ходов команды — Tailwind, Icy Wind или другие способы.','Manipulates Speed order.'],
 redirect:['Перенаправляет атаки и защищает союзника в двойных боях.','Redirects attacks in doubles.'],
 weather:['Создаёт погоду, под которую можно построить синергию.','Sets weather for teammates.'],
 mega:['Упор на атакующие характеристики Mega Evolution, а не на роль Suicide Lead.','Uses Mega Evolution for offensive power.'],
 tank:['Выдерживает удары и одновременно оказывает атакующее давление.','Balances bulk and damage.'],
 trickroom:['Меняет порядок действий, позволяя медленным союзникам атаковать первыми.','Enables slow attackers with Trick Room.']
};
// Spread shorthands: phys/spa/bulkphys/bulkspa/def/spdef/speed/support/trickroom
const S=(role,item,ability,nature,moves,spread='phys',tera='Water',formats=[],note='')=>({role,item,ability,nature,moves,spread,tera,formats,note});
const P=(id,name,types,...sets)=>({id,name,types,sets});
export const POKEMON_SETS = [
 P(970,'Glimmora',['rock','poison'],
   S('lead','Focus Sash','Toxic Debris','Timid',['Stealth Rock','Mortal Spin','Power Gem','Earth Power'],'spa','Ghost',['casual','ou','natdex'],'Suicide Lead'),
   S('special','Power Herb','Toxic Debris','Timid',['Meteor Beam','Sludge Wave','Earth Power','Energy Ball'],'spa','Grass',['casual','ou','natdex'],'Offensive meteor'),
   S('mega','Glimmoranite','Toxic Debris','Timid',['Power Gem','Sludge Bomb','Earth Power','Spiky Shield'],'spa','Rock',['champions'],'Mega Ability: Adaptability')
 ),
 P(1000,'Gholdengo',['steel','ghost'],
   S('special','Choice Scarf','Good as Gold','Timid',['Make It Rain','Shadow Ball','Trick','Focus Blast'],'spa','Steel',['casual','ou','natdex']),
   S('setup','Air Balloon','Good as Gold','Modest',['Nasty Plot','Make It Rain','Shadow Ball','Recover'],'spa','Flying',['casual','ou','natdex']),
   S('special','Life Orb','Good as Gold','Modest',['Make It Rain','Shadow Ball','Thunderbolt','Protect'],'spa','Steel',['doubles'])
 ),
 P(984,'Great Tusk',['ground','fighting'],
   S('removal','Heavy-Duty Boots','Protosynthesis','Jolly',['Rapid Spin','Headlong Rush','Close Combat','Knock Off'],'phys','Steel',['casual','ou','natdex']),
   S('tank','Leftovers','Protosynthesis','Impish',['Stealth Rock','Earthquake','Rapid Spin','Knock Off'],'def','Water',['casual','ou','natdex'])
 ),
 P(983,'Kingambit',['dark','steel'],
   S('setup','Black Glasses','Supreme Overlord','Adamant',['Swords Dance','Kowtow Cleave','Sucker Punch','Iron Head'],'bulkphys','Flying',['casual','ou','natdex']),
   S('physical','Assault Vest','Defiant','Adamant',['Kowtow Cleave','Sucker Punch','Iron Head','Low Kick'],'bulkphys','Dark',['doubles','champions'])
 ),
 P(887,'Dragapult',['dragon','ghost'],
   S('special','Choice Specs','Infiltrator','Timid',['Draco Meteor','Shadow Ball','Flamethrower','U-turn'],'spa','Ghost',['casual','ou','natdex']),
   S('physical','Choice Band','Infiltrator','Jolly',['Dragon Darts','Phantom Force','U-turn','Sucker Punch'],'phys','Dragon',['casual','ou','natdex']),
   S('speed','Life Orb','Infiltrator','Timid',['Draco Meteor','Shadow Ball','Will-O-Wisp','Protect'],'spa','Ghost',['doubles'])
 ),
 P(823,'Corviknight',['flying','steel'],
   S('removal','Rocky Helmet','Pressure','Impish',['Defog','Roost','Body Press','U-turn'],'def','Dragon',['casual','ou','natdex']),
   S('pivot','Leftovers','Mirror Armor','Impish',['Brave Bird','Roost','U-turn','Iron Defense'],'def','Water',['casual','ou','natdex'])
 ),
 P(445,'Garchomp',['dragon','ground'],
   S('hazards','Rocky Helmet','Rough Skin','Impish',['Stealth Rock','Earthquake','Dragon Tail','Fire Blast'],'def','Steel',['casual','ou','natdex']),
   S('setup','Loaded Dice','Rough Skin','Jolly',['Swords Dance','Scale Shot','Earthquake','Fire Fang'],'phys','Fire',['casual','ou','natdex']),
   S('mega','Garchompite','Rough Skin','Jolly',['Swords Dance','Earthquake','Scale Shot','Fire Fang'],'phys','Ground',['natdex'],'Mega Ability: Sand Force'),
   S('physical','Life Orb','Rough Skin','Jolly',['Earthquake','Dragon Claw','Rock Slide','Protect'],'phys','Ground',['doubles','champions'])
 ),
 P(248,'Tyranitar',['rock','dark'],
   S('weather','Smooth Rock','Sand Stream','Careful',['Stealth Rock','Knock Off','Stone Edge','Thunder Wave'],'spdef','Flying',['casual','ou','natdex']),
   S('physical','Choice Band','Sand Stream','Adamant',['Stone Edge','Crunch','Earthquake','Ice Punch'],'phys','Rock',['casual','ou','natdex']),
   S('tank','Assault Vest','Sand Stream','Adamant',['Rock Slide','Crunch','Low Kick','Ice Punch'],'bulkphys','Rock',['doubles','champions'])
 ),
 P(530,'Excadrill',['ground','steel'],
   S('removal','Air Balloon','Sand Rush','Jolly',['Rapid Spin','Earthquake','Iron Head','Swords Dance'],'phys','Ghost',['casual','ou','natdex']),
   S('physical','Life Orb','Sand Rush','Jolly',['High Horsepower','Iron Head','Rock Slide','Protect'],'phys','Steel',['doubles','champions'])
 ),
 P(149,'Dragonite',['dragon','flying'],
   S('setup','Heavy-Duty Boots','Multiscale','Adamant',['Dragon Dance','Extreme Speed','Earthquake','Roost'],'phys','Normal',['casual','ou','natdex']),
   S('physical','Choice Band','Multiscale','Adamant',['Extreme Speed','Outrage','Earthquake','Fire Punch'],'phys','Normal',['casual','ou','natdex'])
 ),
 P(472,'Gliscor',['ground','flying'],
   S('hazards','Toxic Orb','Poison Heal','Impish',['Spikes','Earthquake','Toxic','Protect'],'def','Water',['casual','ou','natdex']),
   S('wall','Toxic Orb','Poison Heal','Careful',['Earthquake','Knock Off','Protect','Roost'],'spdef','Water',['casual','ou','natdex'])
 ),
 P(934,'Garganacl',['rock'],
   S('wall','Leftovers','Purifying Salt','Careful',['Salt Cure','Recover','Protect','Iron Defense'],'spdef','Water',['casual','ou','natdex'])
 ),
 P(980,'Clodsire',['poison','ground'],
   S('wall','Leftovers','Unaware','Careful',['Earthquake','Recover','Toxic','Stealth Rock'],'spdef','Water',['casual','ou','natdex'])
 ),
 P(908,'Meowscarada',['grass','dark'],
   S('pivot','Choice Band','Protean','Jolly',['Flower Trick','Knock Off','U-turn','Triple Axel'],'phys','Dark',['casual','ou','uu','natdex']),
   S('lead','Focus Sash','Protean','Jolly',['Spikes','Flower Trick','Knock Off','U-turn'],'phys','Ghost',['casual','uu','natdex'])
 ),
 P(637,'Volcarona',['bug','fire'],
   S('setup','Heavy-Duty Boots','Flame Body','Timid',['Quiver Dance','Fiery Dance','Bug Buzz','Morning Sun'],'spa','Grass',['casual','natdex']),
   S('special','Sitrus Berry','Flame Body','Modest',['Heat Wave','Bug Buzz','Rage Powder','Protect'],'bulkspa','Grass',['doubles','champions'])
 ),
 P(485,'Heatran',['fire','steel'],
   S('wall','Leftovers','Flash Fire','Calm',['Magma Storm','Earth Power','Taunt','Protect'],'spdef','Grass',['casual','ou','natdex']),
   S('special','Shuca Berry','Flash Fire','Modest',['Heat Wave','Earth Power','Flash Cannon','Protect'],'bulkspa','Grass',['doubles'])
 ),
 P(448,'Lucario',['fighting','steel'],
   S('setup','Life Orb','Inner Focus','Jolly',['Swords Dance','Close Combat','Extreme Speed','Meteor Mash'],'phys','Normal',['casual','uu','natdex']),
   S('physical','Focus Sash','Inner Focus','Jolly',['Close Combat','Meteor Mash','Extreme Speed','Protect'],'phys','Steel',['champions','doubles'])
 ),
 P(479,'Rotom',['electric','ghost'],
   S('pivot','Leftovers','Levitate','Bold',['Volt Switch','Thunderbolt','Will-O-Wisp','Pain Split'],'def','Fairy',['casual','uu']),
   S('special','Choice Specs','Levitate','Timid',['Thunderbolt','Shadow Ball','Volt Switch','Trick'],'spa','Electric',['casual','uu'])
 ),
 P(392,'Infernape',['fire','fighting'],
   S('lead','Focus Sash','Blaze','Jolly',['Stealth Rock','Close Combat','Flare Blitz','Taunt'],'phys','Ghost',['casual','uu']),
   S('pivot','Heavy-Duty Boots','Iron Fist','Jolly',['Close Combat','Flare Blitz','U-turn','Mach Punch'],'phys','Fire',['casual','uu'])
 ),
 P(260,'Swampert',['water','ground'],
   S('hazards','Leftovers','Torrent','Relaxed',['Stealth Rock','Earthquake','Flip Turn','Ice Beam'],'def','Grass',['casual','uu','natdex']),
   S('tank','Assault Vest','Torrent','Adamant',['Earthquake','Liquidation','Ice Punch','Flip Turn'],'bulkphys','Grass',['casual','uu'])
 ),
 P(350,'Milotic',['water'],
   S('wall','Leftovers','Marvel Scale','Bold',['Scald','Recover','Haze','Ice Beam'],'def','Grass',['casual','uu']),
   S('support','Sitrus Berry','Competitive','Bold',['Scald','Icy Wind','Recover','Protect'],'def','Grass',['doubles','champions'])
 ),
 P(197,'Umbreon',['dark'],
   S('wall','Leftovers','Synchronize','Careful',['Foul Play','Wish','Protect','Toxic'],'spdef','Fairy',['casual','uu','natdex'])
 ),
 P(596,'Galvantula',['bug','electric'],
   S('lead','Focus Sash','Compound Eyes','Timid',['Sticky Web','Thunder','Bug Buzz','Volt Switch'],'spa','Ghost',['casual','uu','natdex'])
 ),
 P(330,'Flygon',['ground','dragon'],
   S('pivot','Choice Scarf','Levitate','Jolly',['Earthquake','Outrage','U-turn','Stone Edge'],'phys','Steel',['casual','uu']),
   S('removal','Heavy-Duty Boots','Levitate','Jolly',['Rapid Spin','Earthquake','Dragon Claw','U-turn'],'phys','Steel',['casual','uu'])
 ),
 P(282,'Gardevoir',['psychic','fairy'],
   S('special','Choice Scarf','Trace','Timid',['Moonblast','Psychic','Mystical Fire','Trick'],'spa','Fairy',['casual','uu','natdex']),
   S('support','Sitrus Berry','Telepathy','Modest',['Moonblast','Psychic','Helping Hand','Protect'],'bulkspa','Fairy',['doubles','champions']),
   S('mega','Gardevoirite','Trace','Timid',['Hyper Voice','Psyshock','Focus Blast','Calm Mind'],'spa','Fairy',['natdex'],'Mega Ability: Pixilate')
 ),
 P(245,'Suicune',['water'],
   S('wall','Leftovers','Pressure','Bold',['Scald','Calm Mind','Rest','Sleep Talk'],'def','Grass',['casual','uu']),
   S('speed','Sitrus Berry','Inner Focus','Bold',['Tailwind','Snarl','Scald','Protect'],'def','Grass',['champions'])
 ),
 P(144,'Articuno',['ice','flying'],
   S('wall','Heavy-Duty Boots','Pressure','Calm',['Freeze-Dry','Roost','Haze','U-turn'],'spdef','Water',['casual','uu'])
 ),
 P(1007,'Koraidon',['fighting','dragon'],
   S('physical','Choice Scarf','Orichalcum Pulse','Jolly',['Collision Course','Flare Blitz','Dragon Claw','U-turn'],'phys','Fire',['ubers','casual']),
   S('setup','Life Orb','Orichalcum Pulse','Jolly',['Swords Dance','Collision Course','Flare Blitz','Dragon Claw'],'phys','Fire',['ubers','casual'])
 ),
 P(1008,'Miraidon',['electric','dragon'],
   S('special','Choice Specs','Hadron Engine','Timid',['Electro Drift','Draco Meteor','Volt Switch','Overheat'],'spa','Electric',['ubers','casual']),
   S('setup','Life Orb','Hadron Engine','Timid',['Calm Mind','Electro Drift','Dragon Pulse','Agility'],'spa','Fairy',['ubers','casual'])
 ),
 P(1001,'Wo-Chien',['dark','grass'],
   S('wall','Leftovers','Tablets of Ruin','Careful',['Leech Seed','Knock Off','Protect','Ruination'],'spdef','Poison',['ubers','casual'])
 ),
 P(1002,'Chien-Pao',['dark','ice'],
   S('physical','Heavy-Duty Boots','Sword of Ruin','Jolly',['Icicle Crash','Crunch','Ice Shard','Swords Dance'],'phys','Dark',['ubers','casual'])
 ),
 P(1003,'Ting-Lu',['dark','ground'],
   S('hazards','Leftovers','Vessel of Ruin','Careful',['Spikes','Stealth Rock','Ruination','Earthquake'],'spdef','Poison',['ubers','ou','casual'])
 ),
 P(1004,'Chi-Yu',['dark','fire'],
   S('special','Choice Specs','Beads of Ruin','Timid',['Overheat','Dark Pulse','Flamethrower','Psychic'],'spa','Fire',['ubers','casual'])
 ),
 P(888,'Zacian',['fairy'],
   S('setup','Rusted Sword','Intrepid Sword','Jolly',['Swords Dance','Play Rough','Close Combat','Wild Charge'],'phys','Fairy',['ubers','casual'])
 ),
 P(890,'Eternatus',['poison','dragon'],
   S('wall','Black Sludge','Pressure','Calm',['Dynamax Cannon','Sludge Bomb','Recover','Flamethrower'],'spdef','Steel',['ubers','casual'])
 ),
 P(800,'Necrozma',['psychic'],
   S('setup','Weakness Policy','Prism Armor','Adamant',['Dragon Dance','Photon Geyser','Earthquake','Sunsteel Strike'],'phys','Steel',['ubers','casual'])
 ),
 P(382,'Kyogre',['water'],
   S('special','Choice Scarf','Drizzle','Timid',['Water Spout','Origin Pulse','Ice Beam','Thunder'],'spa','Water',['ubers','casual'])
 ),
 P(383,'Groudon',['ground'],
   S('weather','Heat Rock','Drought','Adamant',['Precipice Blades','Stealth Rock','Stone Edge','Thunder Wave'],'bulkphys','Fire',['ubers','casual'])
 ),
 P(249,'Lugia',['psychic','flying'],
   S('wall','Heavy-Duty Boots','Multiscale','Bold',['Aeroblast','Recover','Whirlwind','Thunder Wave'],'def','Fairy',['ubers','casual'])
 ),
 P(150,'Mewtwo',['psychic'],
   S('special','Life Orb','Pressure','Timid',['Psystrike','Ice Beam','Aura Sphere','Recover'],'spa','Fairy',['ubers','casual'])
 ),
 P(861,'Grimmsnarl',['dark','fairy'],
   S('support','Light Clay','Prankster','Careful',['Reflect','Light Screen','Parting Shot','Spirit Break'],'spdef','Steel',['casual','doubles','natdex']),
   S('support','Sitrus Berry','Prankster','Careful',['Spirit Break','Thunder Wave','Taunt','Light Screen'],'spdef','Steel',['champions'])
 ),
 P(547,'Whimsicott',['grass','fairy'],
   S('speed','Focus Sash','Prankster','Timid',['Tailwind','Moonblast','Encore','Protect'],'spa','Ghost',['doubles','champions'])
 ),
 P(727,'Incineroar',['fire','dark'],
   S('pivot','Sitrus Berry','Intimidate','Careful',['Fake Out','Parting Shot','Flare Blitz','Knock Off'],'spdef','Grass',['doubles','champions'])
 ),
 P(812,'Rillaboom',['grass'],
   S('pivot','Assault Vest','Grassy Surge','Adamant',['Fake Out','Grassy Glide','Wood Hammer','U-turn'],'bulkphys','Fire',['doubles','champions']),
   S('physical','Choice Band','Grassy Surge','Adamant',['Grassy Glide','Wood Hammer','U-turn','Knock Off'],'phys','Fire',['casual','natdex'])
 ),
 P(876,'Indeedee',['psychic','normal'],
   S('redirect','Psychic Seed','Psychic Surge','Bold',['Follow Me','Helping Hand','Psychic','Protect'],'def','Fairy',['doubles','champions'])
 ),
 P(591,'Amoonguss',['grass','poison'],
   S('redirect','Rocky Helmet','Regenerator','Relaxed',['Rage Powder','Spore','Pollen Puff','Protect'],'def','Water',['doubles','champions'])
 ),
 P(1018,'Archaludon',['steel','dragon'],
   S('tank','Assault Vest','Stamina','Modest',['Electro Shot','Draco Meteor','Flash Cannon','Body Press'],'bulkspa','Fairy',['champions','doubles'])
 ),
 P(1019,'Hydrapple',['grass','dragon'],
   S('tank','Assault Vest','Regenerator','Modest',['Fickle Beam','Giga Drain','Earth Power','Dragon Pulse'],'bulkspa','Fire',['casual','ou'])
 ),
 P(979,'Annihilape',['fighting','ghost'],
   S('setup','Leftovers','Defiant','Careful',['Rage Fist','Bulk Up','Drain Punch','Taunt'],'spdef','Water',['casual','natdex']),
   S('tank','Sitrus Berry','Defiant','Adamant',['Rage Fist','Drain Punch','Bulk Up','Protect'],'bulkphys','Fire',['doubles'])
 ),
 P(778,'Mimikyu',['ghost','fairy'],
   S('setup','Life Orb','Disguise','Jolly',['Swords Dance','Play Rough','Shadow Sneak','Drain Punch'],'phys','Ghost',['casual','uu','natdex']),
   S('support','Mental Herb','Disguise','Jolly',['Play Rough','Shadow Sneak','Taunt','Trick Room'],'support','Ghost',['champions','doubles'])
 ),
 P(905,'Enamorus',['fairy','flying'],
   S('special','Choice Specs','Contrary','Timid',['Moonblast','Earth Power','Mystical Fire','Psychic'],'spa','Ground',['casual','ou','natdex'])
 ),
 P(923,'Pawmot',['electric','fighting'],
   S('support','Focus Sash','Iron Fist','Jolly',['Fake Out','Nuzzle','Close Combat','Protect'],'phys','Electric',['champions'])
 ),
 P(6,'Charizard',['fire','flying'],
   S('weather','Charizardite Y','Blaze','Timid',['Heat Wave','Solar Beam','Air Slash','Protect'],'spa','Fire',['champions','doubles'],'Mega Ability: Drought'),
   S('mega','Charizardite X','Blaze','Jolly',['Dragon Dance','Flare Blitz','Dragon Claw','Roost'],'phys','Dragon',['natdex'],'Mega Ability: Tough Claws')
 ),
 P(130,'Gyarados',['water','flying'],
   S('mega','Gyaradosite','Intimidate','Jolly',['Dragon Dance','Waterfall','Crunch','Earthquake'],'phys','Water',['natdex'],'Mega Ability: Mold Breaker'),
   S('tank','Sitrus Berry','Intimidate','Adamant',['Waterfall','Power Whip','Thunder Wave','Protect'],'bulkphys','Water',['champions'])
 ),
 P(468,'Togekiss',['fairy','flying'],
   S('redirect','Sitrus Berry','Serene Grace','Calm',['Follow Me','Air Slash','Helping Hand','Protect'],'spdef','Steel',['champions','doubles'])
 ),
 P(303,'Mawile',['steel','fairy'],
   S('mega','Mawilite','Intimidate','Adamant',['Play Rough','Sucker Punch','Iron Head','Protect'],'bulkphys','Fairy',['champions','natdex'],'Mega Ability: Huge Power')
 ),
];
// Prototype candidate sets; validate each roster, item and move against a live format before playing.
export const validSets=(entry,format)=>entry.sets.filter(s=>s.formats.includes(format));
export const availablePool=(format)=>POKEMON_SETS.filter(p=>validSets(p,format).length);
