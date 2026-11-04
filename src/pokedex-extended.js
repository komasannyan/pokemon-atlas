// Pokémon Atlas 0.8: form, evolution and historical-data normalization.
// No assumptions about a form being obtainable in a particular game.
export const STATS = ['hp','attack','defense','special-attack','special-defense','speed'];
const RN=['HP','Attack','Defense','Sp. Atk','Sp. Def','Speed'];
const genRoman=['','I','II','III','IV','V','VI','VII','VIII','IX','X'];
const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const title=s=>String(s||'').replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
export const generationLabel=slug=>{
 const names={'generation-i':1,'generation-ii':2,'generation-iii':3,'generation-iv':4,'generation-v':5,'generation-vi':6,'generation-vii':7,'generation-viii':8,'generation-ix':9,'generation-x':10};
 return names[slug]?`${genRoman[names[slug]]} (${names[slug]})`:title(slug);
};
export function varietyLabel(slug,base){
 const key=norm(base), val=norm(slug);
 if(val===key)return base;
 let suffix=val.startsWith(key+'-')?val.slice(key.length+1):val;
 if(!suffix||suffix==='normal')return base;
 const labels={alola:'Alola',galar:'Galar',hisui:'Hisui',paldea:'Paldea',mega:'Mega',gmax:'Gigantamax',primal:'Primal',totem:'Totem',eternamax:'Eternamax',therian:'Therian',incarnate:'Incarnate',origin:'Origin',sky:'Sky',black:'Black',white:'White',crowned:'Crowned',battle:'Battle',zen:'Zen',bloodmoon:'Bloodmoon',school:'School',pom:'Pom-Pom',heat:'Heat',wash:'Wash',frost:'Frost',fan:'Fan',mow:'Mow'};
 const parts=suffix.split('-');
 suffix=parts.map(p=>labels[p]||title(p)).join(' ');
 if(val.endsWith('-mega-x')||val.endsWith('-mega-y')||val.endsWith('-mega-z'))suffix=suffix.replace(/\b([XYZ])$/,'$1');
 return `${base} — ${suffix}`;
}
export function normalizeVarieties(species,base){
 const items=Array.isArray(species?.varieties)?species.varieties:[];
 return items.filter(v=>v?.pokemon?.name).map(v=>({slug:v.pokemon.name,name:varietyLabel(v.pokemon.name,base),isDefault:!!v.is_default})).sort((a,b)=>Number(b.isDefault)-Number(a.isDefault)||a.name.localeCompare(b.name));
}
export function formSnapshot(raw){
 if(!raw)return null;
 const m=new Map((raw.stats||[]).map(x=>[x.stat?.name,x.base_stat]));
 const stats=STATS.map(x=>Number(m.get(x)));
 const abilities=(raw.abilities||[]).filter(x=>x.ability?.name).map(x=>({name:title(x.ability.name),slot:x.slot||1,hidden:!!x.is_hidden})).sort((a,b)=>a.slot-b.slot);
 const types=(raw.types||[]).slice().sort((a,b)=>a.slot-b.slot).map(x=>x.type?.name).filter(Boolean);
 return {pokemonId:raw.id,types,stats:stats.every(Number.isFinite)?stats:[],bst:stats.every(Number.isFinite)?stats.reduce((a,b)=>a+b,0):0,abilities,height:raw.height!=null?raw.height/10:null,weight:raw.weight!=null?raw.weight/10:null};
}
export function formArtwork(raw,shiny=false,style='art',fallback=''){
 if(!raw?.sprites)return fallback;
 const spr=raw.sprites;
 const art=spr.other?.['official-artwork']||{};
 const home=spr.other?.home||{};
 const key=shiny?'front_shiny':'front_default';
 const primary=style==='pixel'?spr[key]:style==='home'?home[key]:art[key];
 return primary || home[key] || art[key] || spr[key] || fallback;
}
const loc=s=>title(s?.name||s);
function condOne(d,en){
 const terms=[];const tr=d.trigger?.name;
 const add=(r,e)=>terms.push(en?e:r);
 if(tr==='level-up')add('Повышение уровня','Level up');
 else if(tr==='trade')add('Обмен','Trade');
 else if(tr==='use-item')add('Применить предмет','Use an item');
 else if(tr==='shed')add('Особая эволюция: Shedinja','Special evolution: Shedinja');
 else if(tr==='spin')add('Кружиться с покемоном в команде','Spin with the Pokémon in your party');
 else if(tr==='three-critical-hits')add('Три критических удара в одном бою','Land three critical hits in one battle');
 else if(tr==='take-damage')add('Выполнить условие получения урона','Meet the damage-taken condition');
 else if(tr==='other'||tr==='agile-style-move'||tr==='strong-style-move'||tr==='recoil-damage')add('Особый способ эволюции','Special evolution condition');
 else if(tr)add(`Условие: ${loc(tr)}`,`Trigger: ${loc(tr)}`);
 if(d.min_level!=null)add(`уровень ${d.min_level}+`,`level ${d.min_level}+`);
 if(d.item)add(`предмет ${loc(d.item)}`,`item: ${loc(d.item)}`);
 if(d.held_item)add(`держать ${loc(d.held_item)}`,`hold ${loc(d.held_item)}`);
 if(d.known_move)add(`знать ${loc(d.known_move)}`,`know ${loc(d.known_move)}`);
 if(d.known_move_type)add(`знать атаку типа ${loc(d.known_move_type)}`,`know a ${loc(d.known_move_type)}-type move`);
 if(d.used_move)add(`использовать ${loc(d.used_move)}`,`use ${loc(d.used_move)}`);
 if(d.min_move_count!=null)add(`не менее ${d.min_move_count} использований атаки`,`at least ${d.min_move_count} move uses`);
 if(d.min_happiness!=null)add(`дружба не ниже ${d.min_happiness}`,`friendship ≥ ${d.min_happiness}`);
 if(d.min_affection!=null)add(`привязанность не ниже ${d.min_affection}`,`affection ≥ ${d.min_affection}`);
 if(d.min_beauty!=null)add(`красота не ниже ${d.min_beauty}`,`beauty ≥ ${d.min_beauty}`);
 if(d.location)add(`локация ${loc(d.location)}`,`location ${loc(d.location)}`);
 if(d.region)add(`регион ${loc(d.region)}`,`region ${loc(d.region)}`);
 if(d.time_of_day)add(d.time_of_day==='day'?'днём':d.time_of_day==='night'?'ночью':`время: ${d.time_of_day}`,`time: ${d.time_of_day}`);
 if(d.party_species)add(`в команде ${loc(d.party_species)}`,`party contains ${loc(d.party_species)}`);
 if(d.party_type)add(`в команде тип ${loc(d.party_type)}`,`party contains a ${loc(d.party_type)} type`);
 if(d.trade_species)add(`обмен на ${loc(d.trade_species)}`,`trade for ${loc(d.trade_species)}`);
 if(d.gender!=null)add(d.gender===1?'самка':'самец',d.gender===1?'female':'male');
 if(d.relative_physical_stats!=null){const v=d.relative_physical_stats;add(v>0?'Attack выше Defense':v<0?'Attack ниже Defense':'Attack равен Defense',v>0?'Attack > Defense':v<0?'Attack < Defense':'Attack = Defense');}
 if(d.needs_overworld_rain)add('дождь во внешнем мире','overworld rain');
 if(d.needs_multiplayer)add('совместная игра','multiplayer');
 if(d.turn_upside_down)add('перевернуть устройство','turn the device upside down');
 if(d.min_steps!=null)add(`не менее ${d.min_steps} шагов`,`at least ${d.min_steps} steps`);
 if(d.min_damage_taken!=null)add(`получить ${d.min_damage_taken}+ урона`,`take ${d.min_damage_taken}+ damage`);
 if(d.near_special_rock)add('рядом с особым камнем','near a special rock');
 if(d.base_form)add(`исходная форма ${loc(d.base_form)}`,`base form ${loc(d.base_form)}`);
 if(d.required_pokemon_form)add(`форма ${loc(d.required_pokemon_form)}`,`form ${loc(d.required_pokemon_form)}`);
 if(d.evolved_pokemon_form)add(`форма после эволюции ${loc(d.evolved_pokemon_form)}`,`resulting form ${loc(d.evolved_pokemon_form)}`);
 return terms.join(' · ') || (en?'Check game-specific requirements':'Уточни условия для конкретной игры');
}
export function evolutionRequirements(details,en=false){
 if(!details?.length)return [en?'No evolution requirement':'Нет условий эволюции'];
 const found=new Set();
 for(const d of details){
  const text=condOne(d,en);
  const version=d.version_group?.name?` (${loc(d.version_group.name)})`:'';
  // Avoid duplicating an identical requirement across multiple version groups.
  found.add(text+(details.some(x=>condOne(x,en)!==text)?version:''));
 }
 return [...found];
}
export function evolutionTree(chain){
 const out=[];
 function visit(node,parent=null,depth=0){
  if(!node?.species)return;
  const id=Number(node.species.url?.match(/\/(\d+)\/?$/)?.[1]||0);
  out.push({id,slug:node.species.name,parent,depth,details:node.evolution_details||[],baby:!!node.is_baby});
  for(const next of (node.evolves_to||[]))visit(next,id,depth+1);
 }
 visit(chain?.chain||chain);
 return out;
}
export function historySnapshots(pokemon){
 if(!pokemon)return [];
 const rows=new Map();
 for(const [key,field] of [['past_stats','stats'],['past_types','types'],['past_abilities','abilities']]){
  for(const item of pokemon[key]||[]){
   const gen=item.generation?.name;if(!gen)continue;
   if(!rows.has(gen))rows.set(gen,{generation:gen,stats:null,types:null,abilities:null});
   rows.get(gen)[field]=item[field];
  }
 }
 return [...rows.values()].sort((a,b)=>{
  const g=s=>Number(s.match(/generation-(.+)/)?.[1]?.replace(/x/g,'10'))||0;
  const order={i:1,ii:2,iii:3,iv:4,v:5,vi:6,vii:7,viii:8,ix:9,x:10};
  return (order[a.generation.slice(11)]||g(a.generation))-(order[b.generation.slice(11)]||g(b.generation));
 });
}
export function readableStats(stats){
 const m=new Map((stats||[]).map(x=>[x.stat?.name,x.base_stat]));
 return STATS.filter(s=>m.has(s)).map(s=>({stat:RN[STATS.indexOf(s)],value:m.get(s)}));
}
export function readableTypes(types){return (types||[]).slice().sort((a,b)=>a.slot-b.slot).map(x=>x.type?.name).filter(Boolean);}
export function readableAbilities(abilities){return (abilities||[]).filter(x=>x.ability?.name).map(x=>title(x.ability.name)+(x.is_hidden?' (Hidden)':''));}