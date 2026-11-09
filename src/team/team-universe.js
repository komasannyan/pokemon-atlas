// Team Atlas v0.4 — rule-driven pool. All National Pokédex species can be searched,
// but *only* format-eligible species and known-learnable moves can be proposed.
import {POKEMON_SETS, FORMATS} from './team-data.js';
import {fetchMoveDex} from '../pokedex/moves.js';
export const norm=s=>String(s||'').toLowerCase().replace(/♀/g,'f').replace(/♂/g,'m').normalize('NFKD').replace(/[^a-z0-9]/g,'');
const CURATED_BY_ID=new Map(POKEMON_SETS.map(p=>[p.id,p]));
const L='https://play.pokemonshowdown.com/data/learnsets.json';
let promise=null, universe=null;
const CHOICE=['Focus Sash','Life Orb','Leftovers','Choice Scarf','Rocky Helmet','Sitrus Berry','Heavy-Duty Boots','Choice Specs','Choice Band','Assault Vest','Lum Berry','Mental Herb','White Herb','Black Glasses','Mystic Water','Miracle Seed','Air Balloon','Clear Amulet','Covert Cloak','Eject Button','Light Clay','Safety Goggles','Expert Belt','Wise Glasses','Scope Lens','Shell Bell'];
const ITEM_ID=s=>norm(s);
const forbiddenGen9=new Set(['kingsrock','brightpowder','razorfang','quickclaw']);
const STRICT_MOVE_BANS=new Set(['batonpass','doubleteam','minimize','fissure','guillotine','horndrill','sheercold']);
// The Champions mod explicitly removes many legacy items; items absent from its override
// table can still be legal. Use a small, known-valid catalog rather than treating every
// unknown identifier as available (a frequent error in early builder prototypes).
const CHAMPIONS_STANDARD_ITEMS=new Set(['Focus Sash','Life Orb','Leftovers','Rocky Helmet','Sitrus Berry','Lum Berry','Mental Herb','White Herb','Black Glasses','Mystic Water','Miracle Seed','Air Balloon','Clear Amulet','Covert Cloak','Eject Button','Expert Belt','Wise Glasses','Scope Lens','Shell Bell'].map(norm));
const CHAMPIONS_BANNED_ITEMS=new Set(['Assault Vest','Choice Band','Choice Specs','Choice Scarf','Heavy-Duty Boots','Safety Goggles','Light Clay','Weakness Policy'].map(norm));
export function speciesLegal(p,format,rules){
 if(format==='casual')return true;
 const key=norm(p.name), tier=(format==='champions'?rules.champions:rules.tiers)[key];
 if(!tier)return false; // fail closed: unknown/unmapped species are NOT assumed legal
 if(tier.isNonstandard && !(format==='natdex'&&tier.isNonstandard==='Past'))return false;
 // A species absent from Scarlet/Violet can still have a legal National Dex
 // tier. Its Gen 9 "Illegal" marker must not override that separate table.
 if(format==='natdex')return tier.tier!=='Unreleased'&&!!tier.natDexTier&&!['Illegal','AG','Uber','(Uber)','Unreleased'].includes(tier.natDexTier);
 if(tier.tier==='Illegal'||tier.tier==='Unreleased')return false;
 if(format==='champions')return !p.legendary&&!p.mythical; // official M-C roster ALSO excludes legends
 if(format==='doubles')return !['DUber','(DUber)'].includes(tier.doublesTier||'');
 if(format==='uu')return !['Uber','AG','OU','UUBL','Illegal'].includes(tier.tier);
 if(format==='ou')return !['Uber','AG','Illegal'].includes(tier.tier);
 if(format==='ubers')return !['AG','Illegal'].includes(tier.tier);
 return false;
}
export function itemLegal(name,format,rules){
 if(!name)return true; // held items are optional
 if(format==='champions'){
  const id=norm(name);return !CHAMPIONS_BANNED_ITEMS.has(id)&&(rules.championsItems.includes(id)||CHAMPIONS_STANDARD_ITEMS.has(id));
 }
 if(['ou','uu','ubers','doubles','casual'].includes(format)){
  if(/(?:ite|itex|itey|itez)$/i.test(norm(name))&&norm(name)!=='eviolite')return false;
  return !forbiddenGen9.has(norm(name));
 }
 if(format==='natdex')return !forbiddenGen9.has(norm(name));
 return false;
}
export function movesLegal(set,entry,format,u){
 const allowed=learned(u.learnsets,entry,format);
 if(!allowed?.size)return false;
 return set.moves.every(m=>allowed.has(norm(m)) && !(format!=='casual'&&format!=='champions'&&STRICT_MOVE_BANS.has(norm(m))));
}
function learned(learnsets,entry,format){
 if(format==='champions'){
  let x=learnsets.champions[ norm(entry.name) ];
  return x?new Set(x):null;
 }
 let row=learnsets.main[norm(entry.name)];
 if(!row)return null;
 const data=row.learnset||row;
 const res=new Set();
 for(const [name,methods] of Object.entries(data)){
  const sources=Array.isArray(methods)?methods:[];
  if(['natdex','casual'].includes(format)?sources.some(s=>/^[1-9]/.test(s)):sources.some(s=>/^9/.test(s)))res.add(name);
 }
 return res;
}
const STATUSES={
 lead:['stealthrock','spikes','stickyweb','taunt'],hazards:['stealthrock','spikes','toxicspikes','stickyweb'],removal:['rapidspin','defog','mortalspin','tidyup'],
 setup:['swordsdance','nastyplot','dragondance','calmmind','bulkup','quiverdance','shellsmash','coil','agility'],
 wall:['recover','roost','slackoff','softboiled','moonlight','wish','synthesis','rest','protect','toxic','willowisp'],
 pivot:['uturn','voltswitch','flipturn','partingshot','teleport'],speed:['tailwind','icywind','electroweb','thunderwave','trickroom'],
 redirect:['followme','ragepowder','helpinghand'],support:['fakeout','helpinghand','reflect','lightscreen','tailwind','thunderwave','wideguard','trickroom'],
 tank:['protect','recover','roost'],physical:['swordsdance','bulkup'],special:['nastyplot','calmmind']
};
const TYPES_FAV=['fire','water','electric','grass','ground','fairy','steel','dragon','fighting','ice','ghost','dark','rock','poison','flying','bug','psychic','normal'];
function buildMoves(entry, role, u,format){
 const pool=learned(u.learnsets,entry,format);
 if(!pool?.size)return [];
 const available=u.moves.filter(m=>pool.has(norm(m.name))&&m.id>0&&m.type!=='unknown'&&!(format!=='casual'&&STRICT_MOVE_BANS.has(norm(m.name)))&&!(norm(entry.item)==='assaultvest'&&m.category==='status'));
 const stat=entry.stats||[],special=stat[3]>stat[1]*1.12;
 const category=role==='physical'?'physical':role==='special'?'special':special?'special':'physical';
 const attacks=available.filter(m=>m.category!=='status'&&m.power>0).sort((a,b)=>{
  function score(m){return (m.category===category?70:0)+(entry.types.includes(m.type)?95:0)+Math.min(m.power,140)*.6+(m.accuracy||100)*.13+(m.pp||5)*.08-(m.power<=40?20:0)};
  return score(b)-score(a);
 });
 const statusPriority=STATUSES[role]||[];
 const chosen=[], usedTypes=new Set();
 function add(m){if(m&&!chosen.includes(m)){chosen.push(m);if(m.category!=='status')usedTypes.add(m.type);}}
 if(statusPriority.length){for(const n of statusPriority){if(chosen.length>=(role==='support'||role==='redirect'||role==='wall'?2:1))break;add(available.find(m=>norm(m.name)===n));}}
 for(const m of attacks){if(chosen.length>=4)break;if(!usedTypes.has(m.type))add(m);}
 for(const m of attacks){if(chosen.length>=4)break;add(m);}
 if(format==='doubles'||format==='champions'){
  const protect=available.find(m=>norm(m.name)==='protect');
  if(protect&&!chosen.includes(protect)&&role!=='support'&&role!=='redirect'&&!['choiceband','choicescarf','choicespecs','assaultvest'].includes(norm(entry.item))){if(chosen.length===4)chosen.pop();add(protect);}
 }
 for(const m of available){if(chosen.length>=4)break;add(m);}
 return chosen.map(m=>m.name);
}
function chooseAbility(entry){
 const abilities=(entry.abilities||[]).map(a=>a.name);
 const best=['Intimidate','Regenerator','Prankster','Mold Breaker','Magic Bounce','Good as Gold','Multiscale','Unaware','Speed Boost','Levitate','Sand Rush','Sand Stream','Drizzle','Swift Swim','Grassy Surge','Beast Boost','Technician'];
 return best.find(a=>abilities.includes(a))||abilities.find(Boolean)||'';
}
export function chooseItem(role,format,rules,used){
 const picks=role==='lead'?['Focus Sash','Mental Herb','Sitrus Berry']:
  role==='wall'?['Leftovers','Rocky Helmet','Sitrus Berry']:
  role==='pivot'?['Heavy-Duty Boots','Sitrus Berry','Choice Scarf']:
  role==='support'||role==='redirect'?['Sitrus Berry','Mental Herb','Covert Cloak','Focus Sash']:
  role==='physical'?['Life Orb','Choice Band','Focus Sash','Sitrus Berry']:
  role==='special'?['Life Orb','Choice Specs','Focus Sash','Sitrus Berry']:
  role==='speed'?['Focus Sash','Sitrus Berry','Choice Scarf']:CHOICE;
 return [...picks,...CHOICE].find(x=>itemLegal(x,format,rules) && !used.has(norm(x)))||'';
}
function genSet(entry,role,format,u){
 const item=chooseItem(role,format,u.rules,new Set());
 const moves=buildMoves({...entry,item},role,u,format);
 if(moves.length!==4)return null;
 const st=entry.stats||[],attack=st[1]||50,spA=st[3]||50;
 const physical=role==='physical'||(role!=='special'&&attack>=spA);
 const isSupport=['support','redirect','wall','pivot','hazards','lead','removal','speed'].includes(role);
 const spread=isSupport?'def':physical?'phys':'spa';
 return {role,item,ability:chooseAbility(entry),nature:isSupport?'Bold':physical?'Jolly':'Timid',moves,spread,tera:entry.types[0]?.slice(0,1).toUpperCase()+entry.types[0]?.slice(1)||'Normal',formats:[format],note:'Dynamic build · verify with Showdown'};
}
const ROLE_SETS={
 singles:['physical','special','setup','wall','pivot','lead','removal'],doubles:['physical','special','tank','support','speed','redirect']
};
function chooseRoles(entry,format,u){
 const all=learned(u.learnsets,entry,format);if(!all?.size)return [];
 const stats=entry.stats||[],atk=stats[1]||50,spa=stats[3]||50,hp=stats[0]||50,def=(stats[2]||50)+(stats[4]||50);
 const roles=[];
 if(atk>=spa*.75)roles.push('physical');
 if(spa>=atk*.75)roles.push('special');
 if((atk>90||spa>90)&&[...all].some(m=>STATUSES.setup.includes(m)))roles.push('setup');
 if(hp+def>270)roles.push('wall');
 const configs=(format==='doubles'||format==='champions')?ROLE_SETS.doubles:ROLE_SETS.singles;
 for(const role of configs){if(roles.length>=4)break;if(role==='physical'||role==='special'||role==='wall')continue;if((STATUSES[role]||[]).some(x=>all.has(x)))roles.push(role);}
 if(!roles.length)roles.push(atk>=spa?'physical':'special');
 return [...new Set(roles)].slice(0,5);
}
export function adjustItem(set,format,roster){
 if(!universe)return set;
 if(format!=='champions')return set;
 const held=new Set(roster.map(p=>norm(p.set.item)).filter(Boolean));
 if(set.item&&!held.has(norm(set.item))&&itemLegal(set.item,format,universe.rules))return set;
 const alternate=chooseItem(set.role,format,universe.rules,held);
 return {...set,item:alternate};
}
function normalizeCuratedSet(entry,s,format,u){
 if(!s.formats.includes(format)||!itemLegal(s.item,format,u.rules))return null;
 if(s.ability&&!entry.abilities.some(a=>norm(a.name)===norm(s.ability)))return null;
 const legal=learned(u.learnsets,entry,format);if(!legal?.size)return null;
 const proposed=s.moves.filter(m=>legal.has(norm(m)) && !(format!=='casual'&&format!=='champions'&&STRICT_MOVE_BANS.has(norm(m))) && !(norm(s.item)==='assaultvest'&&u.moves.find(move=>norm(move.name)===norm(m))?.category==='status'));
 const backup=buildMoves({...entry,item:s.item},s.role,u,format);
 const moves=[...new Set([...proposed,...backup])].slice(0,4);
 if(moves.length!==4)return null;
 return {...s,moves,formats:[format]};
}
export function configureUniverse(dex,rules,moves,learnsets){
 universe={dex,rules,moves,learnsets};return universe;
}
export function getUniverse(){return universe;}
export function fullPool(format){
 if(!universe)return [];
 const u=universe;
 return u.dex.filter(p=>speciesLegal(p,format,u.rules)).map(p=>({
  id:p.id,name:p.name,ru:p.ru||'',stats:p.stats||[],types:p.types||[],abilities:p.abilities||[],legendary:p.legendary,mythical:p.mythical,
  sets:((CURATED_BY_ID.get(p.id)?.sets||[]).map(s=>normalizeCuratedSet(p,s,format,u)).filter(Boolean))
 }));
}
export function setsFor(entry,format){
 if(!universe)return [];
 const curated=entry.sets||[],roles=chooseRoles(entry,format,universe),generated=roles.map(r=>genSet(entry,r,format,universe)).filter(Boolean);
 // Curated options have priority but still MUST be verified for item, ability and learnset.
 return [...curated,...generated.filter(s=>!curated.some(x=>x.role===s.role))];
}
export function normalizeSelection(seedIds,roles,format,candidates=fullPool(format)){
 const byId=new Map(candidates.map(entry=>[entry.id,entry]));
 const seeds=[...new Set((Array.isArray(seedIds)?seedIds:[]).map(Number))].filter(id=>Number.isInteger(id)&&byId.has(id)).slice(0,3);
 const selectedRoles=Object.fromEntries(seeds.map(id=>{
  const wanted=roles?.[id];
  return [id,setsFor(byId.get(id),format).some(set=>set.role===wanted)?wanted:'auto'];
 }));
 return {seeds,roles:selectedRoles};
}
export async function loadUniverse(getDex){
 if(promise)return promise;
 promise=(async()=>{
  const local=async name=>{const r=await fetch('./src/team/'+name,{cache:'no-cache'});if(!r.ok)throw Error(name+': HTTP '+r.status);return r.json();};
  const [rules, champ, moves, main] = await Promise.all([
   local('format-rules.json'),local('champions-learnsets.json'),fetchMoveDex(),
   fetch(L,{cache:'default'}).then(r=>{if(!r.ok)throw Error('Showdown learnsets: '+r.status);return r.json();})
  ]);
  const mainRows=main?.BattleLearnsets||main?.Learnsets||main;
  if(!mainRows||Object.keys(mainRows).length<600)throw Error('Showdown learnsets unavailable');
  const dex=getDex();if(dex.length<1000)throw Error('Full National Dex unavailable');
  configureUniverse(dex,rules,moves,{main:mainRows,champions:champ.learnsets});
  return universe;
 })().catch(e=>{promise=null;throw e;});
 return promise;
}
