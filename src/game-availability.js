// Complete *display list* of mainline game versions supported by the UI.
// A missing PokéAPI encounter is NOT evidence that the Pokémon is unobtainable.
export const CORE_GAMES = [
 ['red','Red'],['blue','Blue'],['yellow','Yellow'],['gold','Gold'],['silver','Silver'],['crystal','Crystal'],
 ['ruby','Ruby'],['sapphire','Sapphire'],['emerald','Emerald'],['firered','FireRed'],['leafgreen','LeafGreen'],
 ['diamond','Diamond'],['pearl','Pearl'],['platinum','Platinum'],['heartgold','HeartGold'],['soulsilver','SoulSilver'],
 ['black','Black'],['white','White'],['black-2','Black 2'],['white-2','White 2'],
 ['x','X'],['y','Y'],['omega-ruby','Omega Ruby'],['alpha-sapphire','Alpha Sapphire'],
 ['sun','Sun'],['moon','Moon'],['ultra-sun','Ultra Sun'],['ultra-moon','Ultra Moon'],
 ['lets-go-pikachu',"Let's Go, Pikachu!"],['lets-go-eevee',"Let's Go, Eevee!"],
 ['sword','Sword'],['shield','Shield'],['brilliant-diamond','Brilliant Diamond'],['shining-pearl','Shining Pearl'],
 ['legends-arceus','Legends: Arceus'],['scarlet','Scarlet'],['violet','Violet'],['legends-za','Legends: Z-A']
];
export const recordedVersions = entries=>new Set(entries.flatMap(e=>(e.version_details||[]).map(x=>x.version.name)));
export function recordedInVersion(entries,version){
 return entries.flatMap(e=>(e.version_details||[]).filter(d=>d.version.name===version).map(d=>{
  const details=d.encounter_details||[];
  return {location:e.location_area.name,methods:[...new Set(details.map(x=>x.method.name))],
   min:details.length?Math.min(...details.map(x=>x.min_level)):null,
   max:details.length?Math.max(...details.map(x=>x.max_level)):null,chance:d.max_chance};
 }));
}