// Source: https://github.com/PokeAPI/pokeapi/blob/master/data/v2/csv/pokemon_dex_numbers.csv
// These are in-game Pokédex indexes, NOT an exhaustive list of wild encounters or transfers.
const A=(id,ru,en,dlc=false)=>({id,ru,en,dlc});
const G=(key,label,gen,areas,calc=true)=>({key,label,gen,areas,calc});
const k=A(2,'Канто','Kanto');
const j=A(3,'Джото','Johto');
const h=A(4,'Хоэнн','Hoenn');
const d=A(5,'Синно','Sinnoh');
const jp=A(6,'Расширенный Синно','Expanded Sinnoh');
const ju=A(7,'Обновлённый Джото','Updated Johto');
const u=A(8,'Юнова','Unova');
const u2=A(9,'Обновлённая Юнова','Updated Unova');
const xareas=[A(12,'Центральный Калос','Central Kalos'),A(13,'Прибрежный Калос','Coastal Kalos'),A(14,'Горный Калос','Mountain Kalos')];
const ho=A(15,'Обновлённый Хоэнн','Updated Hoenn');
const al=A(16,'Алола','Alola');
const alu=A(21,'Обновлённая Алола','Updated Alola');
const lg=A(26,'Канто (Let’s Go)','Kanto (Let’s Go)');
const sw=[A(27,'Галар','Galar'),A(28,'Остров Брони','Isle of Armor',true),A(29,'Корона Тундры','Crown Tundra',true)];
const his=A(30,'Хисуи','Hisui');
const sv=[A(31,'Палдея','Paldea'),A(32,'Китаками','Kitakami',true),A(33,'Академия Черники','Blueberry Academy',true)];
const za=[A(34,'Люмиос','Lumiose City'),A(35,'Гиперпространство','Hyperspace',true)];
export const COLLECTION_GAMES=[
 G('red','Pokémon Red',1,[k],false),G('blue','Pokémon Blue',1,[k],false),G('yellow','Pokémon Yellow',1,[k],false),
 G('gold','Pokémon Gold',2,[j],false),G('silver','Pokémon Silver',2,[j],false),G('crystal','Pokémon Crystal',2,[j],false),
 G('ruby','Pokémon Ruby',3,[h]),G('sapphire','Pokémon Sapphire',3,[h]),G('emerald','Pokémon Emerald',3,[h]),
 G('firered','Pokémon FireRed',3,[k]),G('leafgreen','Pokémon LeafGreen',3,[k]),
 G('diamond','Pokémon Diamond',4,[d]),G('pearl','Pokémon Pearl',4,[d]),G('platinum','Pokémon Platinum',4,[jp]),
 G('heartgold','Pokémon HeartGold',4,[ju]),G('soulsilver','Pokémon SoulSilver',4,[ju]),
 G('black','Pokémon Black',5,[u]),G('white','Pokémon White',5,[u]),G('black-2','Pokémon Black 2',5,[u2]),G('white-2','Pokémon White 2',5,[u2]),
 G('x','Pokémon X',6,xareas),G('y','Pokémon Y',6,xareas),
 G('omega-ruby','Pokémon Omega Ruby',6,[ho]),G('alpha-sapphire','Pokémon Alpha Sapphire',6,[ho]),
 G('sun','Pokémon Sun',7,[al]),G('moon','Pokémon Moon',7,[al]),G('ultra-sun','Pokémon Ultra Sun',7,[alu]),G('ultra-moon','Pokémon Ultra Moon',7,[alu]),
 G('lets-go-pikachu','Let’s Go, Pikachu!',7,[lg],false),G('lets-go-eevee','Let’s Go, Eevee!',7,[lg],false),
 G('sword','Pokémon Sword',8,sw),G('shield','Pokémon Shield',8,sw),
 G('brilliant-diamond','Brilliant Diamond',8,[d]),G('shining-pearl','Shining Pearl',8,[d]),
 G('legends-arceus','Legends: Arceus',8,[his],false),
 G('scarlet','Pokémon Scarlet',9,sv),G('violet','Pokémon Violet',9,sv),
 G('legends-za','Legends: Z-A',9,za,false)
];
export const gameFor=key=>COLLECTION_GAMES.find(g=>g.key===key)||COLLECTION_GAMES.find(g=>g.key==='violet');
let loader;
export function fetchRegionalDex(){
 if(!loader)loader=fetch('./src/collection/collection-dex.json').then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json();}).then(data=>{
  if(!data.dexes||!data.dexes['31']||data.dexes['31'].length!==400)throw Error('Incomplete regional dex');
  return data.dexes;
 }).catch(e=>{loader=null;throw e;});
 return loader;
}
export function gameEntries(game,dexes,area='all'){
 const sections=game.areas.filter(a=>area==='all'||String(a.id)===String(area));
 const combined=new Map();
 for(const a of sections)for(const [number,id] of dexes[a.id]||[]){
  if(!combined.has(id))combined.set(id,{id,number,areas:[{id:a.id,num:number,ru:a.ru,en:a.en,dlc:a.dlc}]});
  else combined.get(id).areas.push({id:a.id,num:number,ru:a.ru,en:a.en,dlc:a.dlc});
 }
 return [...combined.values()];
}