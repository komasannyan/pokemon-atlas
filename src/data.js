import {TYPES, toTitle} from './constants.js';
import {DEMO} from './demo.js';

const POKE = 'https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/';
const RU = 'https://raw.githubusercontent.com/sindresorhus/pokemon/main/data/ru.json';
const STORE_KEY = 'pokemon-atlas-dex-v1';
const FILES = ['pokemon_species.csv','pokemon_species_names.csv','pokemon.csv','pokemon_types.csv','pokemon_stats.csv','pokemon_abilities.csv','abilities.csv'];

// RFC4180-compatible quoted fields (including escaped quotes and embedded line breaks).
export function parseCSV(input) {
  const rows = []; let row=[],field='',quoted=false;
  for (let i=0;i<input.length;i++) {
    const c=input[i];
    if(c==='"') { if(quoted && input[i+1]==='"'){field+='"'; i++;} else quoted=!quoted; }
    else if(c===',' && !quoted) {row.push(field);field='';}
    else if((c==='\n'||c==='\r')&&!quoted) {
      if(c==='\r'&&input[i+1]==='\n')i++;
      row.push(field);field='';if(row.some(x=>x!==''))rows.push(row);row=[];
    } else field+=c;
  }
  if(field||row.length){row.push(field);rows.push(row);}
  const headers=rows.shift();
  return rows.map(values=>Object.fromEntries(headers.map((header,i)=>[header, values[i]??''])));
}
function mapGroup(rows,key) {
  const map=new Map();
  for(const row of rows){ const k=+row[key]; if(!map.has(k))map.set(k,[]);map.get(k).push(row); }
  return map;
}
function nameFromIdentifier(str){return toTitle(str).replace(/\bMr Mime\b/i,'Mr. Mime');}
async function fetchText(url) {
  const ctl = new AbortController();
  const timeout=setTimeout(()=>ctl.abort(),22000);
  try {const r=await fetch(url,{signal:ctl.signal,cache:'default'});if(!r.ok)throw new Error(`${r.status} ${url}`);return await r.text();}
  finally {clearTimeout(timeout);}
}
export async function fetchNationalDex() {
  const [texts, ru] = await Promise.all([
    Promise.all(FILES.map(x=>fetchText(POKE+x))),
    fetchText(RU).then(JSON.parse).catch(()=>[])
  ]);
  const [species, speciesNames, pokemon, types, stats, pokemonAbilities, abilities] = texts.map(parseCSV);
  const names=new Map(speciesNames.filter(x=>x.local_language_id==='9').map(x=>[+x.pokemon_species_id,x.name]));
  const defaults=new Map(pokemon.filter(x=>x.is_default==='1').map(x=>[+x.species_id,x]));
  for(const record of pokemon){const id=+record.species_id;if(!defaults.has(id))defaults.set(id,record);}
  const typesByPokemon=mapGroup(types,'pokemon_id');
  const statsByPokemon=mapGroup(stats,'pokemon_id');
  const abilitiesByPokemon=mapGroup(pokemonAbilities,'pokemon_id');
  const abilityNames=new Map(abilities.map(a=>[+a.id, nameFromIdentifier(a.identifier)]));
  const records=species.map(s=>{
    const id=+s.id,p=defaults.get(id),pid=+p?.id;
    const base=(statsByPokemon.get(pid)||[]).sort((a,b)=>+a.stat_id - +b.stat_id).map(a=>+a.base_stat);
    const typeNames=(typesByPokemon.get(pid)||[]).sort((a,b)=>+a.slot - +b.slot).map(x=>TYPES[+x.type_id]?.[0]).filter(Boolean);
    const ab=(abilitiesByPokemon.get(pid)||[]).sort((a,b)=>+a.slot - +b.slot).map(a=>({name:abilityNames.get(+a.ability_id)||`#${a.ability_id}`,slot:+a.slot,hidden:a.is_hidden==='1'}));
    return {
      id,name:names.get(id)||nameFromIdentifier(s.identifier),ru:ru[id-1]||'',gen:+s.generation_id,
      types:typeNames,stats:base.length===6?base:[],bst:base.reduce((a,b)=>a+b,0),
      abilities:ab,height:p?.height?+p.height/10:null,weight:p?.weight?+p.weight/10:null,
      legendary:s.is_legendary==='1',mythical:s.is_mythical==='1',
      fromId:s.evolves_from_species_id?+s.evolves_from_species_id:null,
      chainId:s.evolution_chain_id?+s.evolution_chain_id:null,
      pokemonId:pid
    };
  }).filter(x=>x.id>0).sort((a,b)=>a.id-b.id);
  if(records.length<1000)throw new Error('Источник вернул неполный список');
  return records;
}
export function loadCachedDex(){
  try{
    const raw=localStorage.getItem(STORE_KEY);
    if(raw){
      const p=JSON.parse(raw);
      if(Array.isArray(p)&&p.length>=1000&&p.every(r=>r&&Number.isInteger(r.id)&&r.id>0&&typeof r.name==='string'&&Array.isArray(r.types)&&r.types.every(x=>typeof x==='string')&&Array.isArray(r.stats)&&r.stats.every(Number.isFinite)&&Array.isArray(r.abilities)&&r.abilities.every(a=>a&&typeof a.name==='string')))return p;
    }
  }catch{}return null;
}
export function saveDex(records){try{localStorage.setItem(STORE_KEY,JSON.stringify(records));}catch{}}
export function getDemo(){return DEMO;}
