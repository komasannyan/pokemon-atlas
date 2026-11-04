// A small usable offline fallback. The complete national index is loaded from public CSV datasets.
const sample = [
[1,'Bulbasaur','Бульбазавр',1,['grass','poison'],[45,49,49,65,65,45],['Overgrow','Chlorophyll']],
[3,'Venusaur','Венузавр',1,['grass','poison'],[80,82,83,100,100,80],['Overgrow','Chlorophyll']],
[4,'Charmander','Чармандер',1,['fire'],[39,52,43,60,50,65],['Blaze','Solar Power']],
[6,'Charizard','Чаризард',1,['fire','flying'],[78,84,78,109,85,100],['Blaze','Solar Power']],
[7,'Squirtle','Сквиртл',1,['water'],[44,48,65,50,64,43],['Torrent','Rain Dish']],
[9,'Blastoise','Бластойз',1,['water'],[79,83,100,85,105,78],['Torrent','Rain Dish']],
[25,'Pikachu','Пикачу',1,['electric'],[35,55,40,50,50,90],['Static','Lightning Rod']],
[94,'Gengar','Генгар',1,['ghost','poison'],[60,65,60,130,75,110],['Cursed Body']],
[133,'Eevee','Иви',1,['normal'],[55,55,50,45,65,55],['Run Away','Adaptability','Anticipation']],
[150,'Mewtwo','Мьюту',1,['psychic'],[106,110,90,154,90,130],['Pressure','Unnerve']],
[197,'Umbreon','Амбреон',2,['dark'],[95,65,110,60,130,65],['Synchronize','Inner Focus']],
[248,'Tyranitar','Тиранитар',2,['rock','dark'],[100,134,110,95,100,61],['Sand Stream','Unnerve']],
[282,'Gardevoir','Гардевуар',3,['psychic','fairy'],[68,65,65,125,115,80],['Synchronize','Trace','Telepathy']],
[376,'Metagross','Метагросс',3,['steel','psychic'],[80,135,130,95,90,70],['Clear Body','Light Metal']],
[384,'Rayquaza','Рейкваза',3,['dragon','flying'],[105,150,90,150,90,95],['Air Lock']],
[445,'Garchomp','Гарчомп',4,['dragon','ground'],[108,130,95,80,85,102],['Sand Veil','Rough Skin']],
[448,'Lucario','Лукарио',4,['fighting','steel'],[70,110,70,115,70,90],['Steadfast','Inner Focus','Justified']],
[493,'Arceus','Аркеус',4,['normal'],[120,120,120,120,120,120],['Multitype']],
[530,'Excadrill','Экскадрилл',5,['ground','steel'],[110,135,60,50,65,88],['Sand Rush','Sand Force','Mold Breaker']],
[658,'Greninja','Грениндзя',6,['water','dark'],[72,95,67,103,71,122],['Torrent','Protean']],
[724,'Decidueye','Десиджуай',7,['grass','ghost'],[78,107,75,100,100,70],['Overgrow','Long Reach']],
[823,'Corviknight','Корвинайт',8,['flying','steel'],[98,87,105,53,85,67],['Pressure','Unnerve','Mirror Armor']],
[887,'Dragapult','Драгапульт',8,['dragon','ghost'],[88,120,75,100,75,142],['Clear Body','Infiltrator','Cursed Body']],
[959,'Tinkaton','Тинкатон',9,['fairy','steel'],[85,75,77,70,105,94],['Mold Breaker','Own Tempo','Pickpocket']],
[1000,'Gholdengo','Голденго',9,['steel','ghost'],[87,60,95,133,91,84],['Good as Gold']],
[1007,'Koraidon','Корайдон',9,['fighting','dragon'],[100,135,115,85,100,135],['Orichalcum Pulse']],
[1008,'Miraidon','Мирайдон',9,['electric','dragon'],[100,85,100,135,115,135],['Hadron Engine']],
[1017,'Ogerpon','Огерпон',9,['grass'],[80,120,84,60,96,110],['Defiant']],
[1025,'Pecharunt','Печарант',9,['poison','ghost'],[88,88,160,88,88,88],['Poison Puppeteer']]
];
export const DEMO = sample.map(([id,name,ru,gen,types,stats,abilities]) => ({
  id,name,ru,gen,types,stats,abilities:abilities.map((name,i)=>({name,hidden:i>0 && i===abilities.length-1})),
  bst:stats.reduce((a,b)=>a+b,0),height:null,weight:null,legendary:[150,384,493,1007,1008].includes(id),mythical:id===1025,
  chainId:null,fromId:null
}));
