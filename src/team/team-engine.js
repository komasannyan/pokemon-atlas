import {FORMATS, ROLE_NAMES} from './team-data.js';
import {fullPool, setsFor, adjustItem} from './team-universe.js';

export const TYPE_CHART = {
 normal:{rock:.5,steel:.5,ghost:0},fire:{fire:.5,water:.5,grass:2,ice:2,bug:2,rock:.5,dragon:.5,steel:2},water:{fire:2,water:.5,grass:.5,ground:2,rock:2,dragon:.5},electric:{water:2,electric:.5,grass:.5,ground:0,flying:2,dragon:.5},grass:{fire:.5,water:2,grass:.5,poison:.5,ground:2,flying:.5,bug:.5,rock:2,dragon:.5,steel:.5},ice:{fire:.5,water:.5,grass:2,ice:.5,ground:2,flying:2,dragon:2,steel:.5},fighting:{normal:2,ice:2,poison:.5,flying:.5,psychic:.5,bug:.5,rock:2,ghost:0,dark:2,steel:2,fairy:.5},poison:{grass:2,poison:.5,ground:.5,rock:.5,ghost:.5,steel:0,fairy:2},ground:{fire:2,electric:2,grass:.5,poison:2,flying:0,bug:.5,rock:2,steel:2},flying:{electric:.5,grass:2,fighting:2,bug:2,rock:.5,steel:.5},psychic:{fighting:2,poison:2,psychic:.5,dark:0,steel:.5},bug:{fire:.5,grass:2,fighting:.5,poison:.5,flying:.5,psychic:2,ghost:.5,dark:2,steel:.5,fairy:.5},rock:{fire:2,ice:2,fighting:.5,ground:.5,flying:2,bug:2,steel:.5},ghost:{normal:0,psychic:2,ghost:2,dark:.5},dragon:{steel:.5,dragon:2,fairy:0},dark:{fighting:.5,psychic:2,ghost:2,dark:.5,fairy:.5},steel:{fire:.5,water:.5,electric:.5,ice:2,rock:2,steel:.5,fairy:2},fairy:{fire:.5,fighting:2,poison:.5,dragon:2,dark:2,steel:.5}
};
export const TYPES=Object.keys(TYPE_CHART);
export const multiplier=(attack,types,ability='')=>{
 if(ability==='Levitate'&&attack==='ground')return 0;
 if(ability==='Flash Fire'&&attack==='fire')return 0;
 if(ability==='Water Absorb'&&attack==='water')return 0;
 if(ability==='Volt Absorb'&&attack==='electric')return 0;
 if(ability==='Sap Sipper'&&attack==='grass')return 0;
 if(ability==='Lightning Rod'&&attack==='electric')return 0;
 if(ability==='Storm Drain'&&attack==='water')return 0;
 if(ability==='Motor Drive'&&attack==='electric')return 0;
 if(ability==='Dry Skin'&&attack==='water')return 0;
 const base=types.reduce((v,type)=>v*(TYPE_CHART[attack]?.[type]??1),1);
 if(ability==='Thick Fat'&&(attack==='fire'||attack==='ice'))return base*0.5;
 if(ability==='Dry Skin'&&attack==='fire')return base*1.25;
 return base;
};
const has=(s,names)=>s.moves.some(m=>names.includes(m));
const HAZARDS=['Stealth Rock','Spikes','Toxic Spikes','Sticky Web'];
const REMOVE=['Rapid Spin','Defog','Mortal Spin','Court Change','Tidy Up'];
const PIVOT=['U-turn','Volt Switch','Flip Turn','Parting Shot'];
const SPEED=['Tailwind','Icy Wind','Electroweb','Thunder Wave','Trick Room','Sticky Web'];
const REDIRECT=['Follow Me','Rage Powder'];
const PROTECT=['Protect','Spiky Shield','Detect','Baneful Bunker','King\'s Shield'];
const PHYS=['Close Combat','Earthquake','Headlong Rush','Knock Off','Sucker Punch','Dragon Darts','Flare Blitz','Stone Edge','Iron Head','Kowtow Cleave','Grassy Glide','Collision Course','Precipice Blades','Rage Fist','Play Rough','Icicle Crash','Scale Shot','Rock Slide','Dragon Claw','Extreme Speed','Waterfall','Wood Hammer','Body Press'];
const SPECIAL=['Make It Rain','Shadow Ball','Draco Meteor','Electro Drift','Moonblast','Psychic','Psyshock','Heat Wave','Earth Power','Sludge Bomb','Power Gem','Water Spout','Overheat','Flamethrower','Thunderbolt','Torch Song','Fickle Beam','Giga Drain','Energy Ball','Hyper Voice','Snarl','Icy Wind','Dazzling Gleam'];

// Common overlapping weaknesses that make teams fragile
const DANGEROUS_WEAK = {
 electric:2.2, rock:2.0, ground:1.9, ice:1.8, fighting:1.6, fire:1.5, dark:1.4, fairy:1.4
};

const countFlags=roster=>{
 const count=fn=>roster.reduce((n,p)=>n+(fn(p.set)?1:0),0);
 return {
  hazards:count(s=>has(s,HAZARDS)),removal:count(s=>has(s,REMOVE)),pivot:count(s=>has(s,PIVOT)),speed:count(s=>has(s,SPEED)),redirect:count(s=>has(s,REDIRECT)),protect:count(s=>has(s,PROTECT)),fakeout:count(s=>has(s,['Fake Out'])),
  physical:count(s=>has(s,PHYS)&&['physical','setup','tank','mega','hazards','pivot'].includes(s.role)),
  special:count(s=>has(s,SPECIAL)&&['special','setup','tank','mega','weather'].includes(s.role)),
  wall:count(s=>['wall','support','redirect','trickroom'].includes(s.role)),
  mega:count(s=>isMega(s)),
  setup:count(s=>['setup','mega'].includes(s.role))
 };
};
const weaknessCounts=(roster)=>Object.fromEntries(TYPES.map(type=>[type,roster.filter(p=>multiplier(type,p.entry.types,p.set.ability)>=2).length]));
export function teamCoverage(roster){
 const results=TYPES.map(type=>({type,weak:roster.filter(p=>multiplier(type,p.entry.types,p.set.ability)>=2).length,resist:roster.filter(p=>multiplier(type,p.entry.types,p.set.ability)<1).length}));
 return results.sort((a,b)=>b.weak-a.weak||a.resist-b.resist);
}
const isMega=s=>/(?:ite|itex|itey|itez)$/i.test(String(s.item||'').replace(/[^a-z]/gi,'')) && !['Eviolite'].includes(s.item);

// Shared types between two mons (penalize stacking same defensive profile)
function sharedWeaknesses(typesA,abA,typesB,abB){
 return TYPES.filter(t=>multiplier(t,typesA,abA)>=2 && multiplier(t,typesB,abB)>=2).length;
}

function candidateValue(entry,set,roster,format,plan,index,context=null){
 const flags=context?.flags||countFlags(roster),fmt=FORMATS[format];
 if(roster.some(p=>p.entry.id===entry.id))return -1e9;
 if(fmt.champions&&set.item&&roster.some(p=>p.set.item===set.item))return -1e9;
 if(isMega(set)&&roster.some(p=>isMega(p.set)))return -1e9; // one Mega per team in formats that permit it

 const before=context?.weaknesses||weaknessCounts(roster);
 const nextFlags=countFlags([...roster,{entry,set}]);
 let score=10;

 // --- Weakness management (much stronger) ---
 for(const type of TYPES){
  const mult = multiplier(type,entry.types,set.ability);
  // Reward covering existing team weaknesses
  if(before[type]>=1 && mult < 1){
   score += 4.5 + Math.min(before[type],3)*1.8;
   if(DANGEROUS_WEAK[type]) score += DANGEROUS_WEAK[type];
  }
  // Heavy penalty for increasing already-bad weaknesses
  if(mult >= 2){
   const nextWeakness=before[type]+1;
   if(nextWeakness >= 3) score -= 14 + (nextWeakness-3)*6;
   else if(nextWeakness === 2) score -= 5.5;
   else score -= 1.8;
   if(DANGEROUS_WEAK[type] && nextWeakness >= 2) score -= DANGEROUS_WEAK[type]*1.5;
  }
 }

 // Penalize sharing many weaknesses with existing members
 for(const p of roster){
  const shared = sharedWeaknesses(entry.types,set.ability,p.entry.types,p.set.ability);
  if(shared >= 3) score -= 7;
  else if(shared === 2) score -= 3.2;
 }

 // --- Role balance ---
 const wanted = fmt.doubles
  ? {speed:12, redirect:8, fakeout:7, protect:3, physical:6, special:6, wall:3}
  : {hazards:12, removal:11, pivot:5.5, physical:7, special:7, wall:4, speed:3};
 for(const [key,w] of Object.entries(wanted)){
  if(!flags[key] && nextFlags[key]) score += w;
  // Discourage stacking too many of the same role
  if(flags[key] >= 2 && nextFlags[key] > flags[key]){
   score -= (key==='protect' ? 0.5 : (key==='physical'||key==='special' ? 2.5 : 5));
  }
 }

 // Prefer having both physical and special pressure
 if(flags.physical===0 && nextFlags.physical) score += 3;
 if(flags.special===0 && nextFlags.special) score += 3;

 // --- Format-specific ---
 if(fmt.doubles){
  if(!has(set,PROTECT) && !['Assault Vest','Choice Scarf','Choice Specs','Choice Band'].includes(set.item)) score -= 2.5;
  if(set.role==='lead' && has(set,HAZARDS)) score -= 5;
 } else {
  if(set.role==='redirect') score -= 8; // almost never useful in singles
 }

 // Plan preferences
 if(plan==='offense'){
  score += ['physical','special','setup','mega','tank'].includes(set.role) ? 5 : 0;
  score -= ['wall','support'].includes(set.role) ? 1.5 : 0;
 }
 if(plan==='control'){
  score += ['pivot','wall','support','speed','redirect','hazards','removal'].includes(set.role) ? 5 : 0;
  score -= ['setup','mega'].includes(set.role) ? 1 : 0;
 }
 if(plan==='balanced'){
  score += ['pivot','removal','speed','hazards'].includes(set.role) ? 2.5 : 0;
  // Prefer mixed offense + some bulk
  if(['physical','special','wall','tank'].includes(set.role)) score += 1.2;
 }

 // --- Weather / terrain synergy ---
 const teamAbilities = roster.map(p=>p.set.ability);
 if(teamAbilities.includes('Sand Stream') && set.ability==='Sand Rush') score += 11;
 if(teamAbilities.includes('Drizzle') && (set.ability==='Swift Swim' || has(set,['Hurricane','Thunder']))) score += 10;
 if(teamAbilities.includes('Drought') && (set.ability==='Chlorophyll' || has(set,['Solar Beam','Growth']))) score += 10;
 if(set.ability==='Sand Stream' && roster.some(p=>p.set.ability==='Sand Rush')) score += 9;
 if(set.ability==='Drizzle' && roster.some(p=>p.set.ability==='Swift Swim')) score += 9;
 if(set.ability==='Drought' && roster.some(p=>p.set.ability==='Chlorophyll')) score += 9;
 if(teamAbilities.includes('Grassy Surge') && has(set,['Earthquake','High Horsepower'])) score -= 4;
 if(teamAbilities.includes('Electric Surge') && has(set,['Rising Voltage'])) score += 3;

 // Speed control is valuable when team is slow
 const slowRoles = roster.filter(p=>['wall','tank','support','hazards'].includes(p.set.role)).length;
 if(slowRoles >= 2 && (has(set,SPEED) || set.role==='speed' || set.role==='pivot')) score += 4;

 // Avoid too many pure setup sweepers without support
 if(flags.setup >= 2 && set.role==='setup') score -= 6;

 // Small deterministic tie-break so different variants stay different
 score += ((entry.id * 31 + index * 17) % 13) / 100;

 return score;
}

function buildWithSeeds(seedIds,roles,format,size,plan,variant){
 const entire = fullPool(format);
 // Larger and more diverse candidate pool than pure BST sort
 // Calculate legal sets once per candidate instead of rebuilding them for every slot.
 const withSets = entire.map(entry=>({entry, sets:setsFor(entry,format)})).filter(x=>x.sets.length);
 const bst=x=>x.entry.stats?.reduce((a,b)=>a+b,0)||0;
 const byBst=withSets.sort((a,b)=>bst(b)-bst(a));
 // Include strong picks and a deterministic sample of lower-BST support and defensive species.
 const core=byBst.slice(0,155),rest=byBst.slice(155),diverse=[];
 if(rest.length){for(let j=0;j<45&&j<rest.length;j++)diverse.push(rest[Math.floor(j*rest.length/Math.min(45,rest.length))]);}
 const candidatesPool=[...core,...diverse];

 const byId = new Map(entire.map(p=>[p.id,p]));
 const seeds = seedIds.map(id=>byId.get(id));
 if(seeds.some(x=>!x)) return null;

 // Role choices for seeds
 const choices = seeds.map((entry,i)=>{
  const wanted = roles[i];
  return setsFor(entry,format).filter(s => !wanted || wanted==='auto' || s.role===wanted);
 });
 if(choices.some(c=>!c.length)) return null;

 // Limit combo explosion when 3 seeds
 let combos;
 if(seeds.length <= 2){
  combos = choices.reduce((arr,sets)=>arr.flatMap(prefix=>sets.map(set=>[...prefix,set])), [[]]);
 } else {
  // For 3 seeds take best set per seed first, then limited variants
  combos = [choices.map(sets => sets[0])];
  for(let i=0;i<choices.length;i++){
   for(let j=1;j<Math.min(3,choices[i].length);j++){
    const alt = choices.map((sets,k)=> k===i ? sets[j] : sets[0]);
    combos.push(alt);
   }
  }
 }

 let result = null;
 for(const combo of combos){
  const roster = [];
  for(let i=0;i<seeds.length;i++){
   const set = adjustItem(combo[i],format,roster);
   roster.push({entry:seeds[i], set, seed:true, why:[]});
  }

  // Hard constraints
  if(roster.filter(x=>isMega(x.set)).length > 1) continue;
  if(FORMATS[format].champions){
   const items = roster.map(x=>x.set.item).filter(Boolean);
   if(new Set(items).size !== items.length) continue;
  }

  // Never reject the player's chosen trio solely for shared weaknesses.
  // The fragility score already penalizes the risk while retaining fixed Pokémon.

  let quality = combo.reduce((v,set,i)=>v + candidateValue(seeds[i],set,roster.filter((_,j)=>j!==i),format,plan,i), 0);

  while(roster.length < size){
   const candidates = [];
   const context={flags:countFlags(roster),weaknesses:weaknessCounts(roster)};
   for(const {entry,sets} of candidatesPool){
    if(roster.some(p=>p.entry.id===entry.id)) continue;
    for(const set of sets){
     const candidateSet = adjustItem(set,format,roster);
     const value = candidateValue(entry,candidateSet,roster,format,plan,variant + roster.length,context);
     if(value > -50000) candidates.push({entry, set:candidateSet, value});
    }
   }
   candidates.sort((a,b)=>b.value - a.value || a.entry.id - b.entry.id);
   if(!candidates.length) break;

   // Take best, but occasionally look at top-3 for variety between plans
   const pickIndex = (plan==='offense' && variant%2===0 && candidates.length>1) ? 1 : 0;
   const chosen = candidates[Math.min(pickIndex, candidates.length-1)];
   quality += chosen.value;
   roster.push({...chosen, seed:false, why:[]});
  }

  if(roster.length === size){
   // Final team quality adjustment: punish overall fragile teams
   const finalWeak = weaknessCounts(roster);
   let fragility = 0;
   for(const t of TYPES){
    if(finalWeak[t] >= 3) fragility += 8 + (finalWeak[t]-3)*4;
    else if(finalWeak[t] === 2) fragility += 2.5;
   }
   quality -= fragility;

   if(!result || quality > result.score) result = {roster, score:quality};
  }
 }
 return result;
}

function reasonsFor(roster,format,lang){
 const ru = lang !== 'en';
 return roster.map((p,i)=>{
  const others = roster.filter((_,j)=>i!==j);
  const reasons = [];
  const helps = TYPES.filter(type =>
   others.some(o => multiplier(type,o.entry.types,o.set.ability) >= 2) &&
   multiplier(type,p.entry.types,p.set.ability) < 1
  );
  if(helps.length){
   reasons.push(ru
    ? `Прикрывает слабости команды к: ${helps.slice(0,3).join(', ')}.`
    : `Covers team weaknesses to ${helps.slice(0,3).join(', ')}.`);
  }
  if(p.set.role==='removal') reasons.push(ru ? 'Убирает ловушки, облегчая переключения.' : 'Clears hazards for safer switches.');
  if(p.set.role==='lead' || p.set.role==='hazards') reasons.push(ru ? 'Ставит ловушки и создаёт давление.' : 'Adds hazard pressure.');
  if(p.set.role==='speed') reasons.push(ru ? 'Даёт контроль скорости.' : 'Supplies speed control.');
  if(p.set.role==='redirect') reasons.push(ru ? 'Отводит атаки от партнёра.' : 'Redirects targeted attacks from its partner.');
  if(p.set.role==='pivot') reasons.push(ru ? 'Даёт безопасные переключения (U-turn / Volt Switch).' : 'Provides safe pivots.');
  if(p.set.ability==='Sand Rush' && others.some(o=>o.set.ability==='Sand Stream'))
   reasons.push(ru ? 'Sand Rush удваивает скорость под песком.' : 'Sand Rush gains speed under teammate sand.');
  if(p.set.ability==='Swift Swim' && others.some(o=>o.set.ability==='Drizzle'))
   reasons.push(ru ? 'Swift Swim под дождём партнёра.' : 'Swift Swim under partner rain.');
  if(p.set.ability==='Chlorophyll' && others.some(o=>o.set.ability==='Drought'))
   reasons.push(ru ? 'Chlorophyll под солнцем партнёра.' : 'Chlorophyll under partner sun.');
  if(p.set.role==='mega') reasons.push(ru ? 'Mega Evolution для сильного атакующего слота.' : 'Uses the Mega slot for offensive pressure.');
  if(!reasons.length) reasons.push(ru ? 'Дополняет роли и покрытие команды.' : 'Adds an additional offensive or defensive role.');
  return {...p, why:reasons.slice(0,2)};
 });
}

export function generateSuggestions({format='ou', seedIds=[], roles=[], size=6, lang='ru'}){
 if(!FORMATS[format]) throw Error('Unknown format');
 if(seedIds.length > 3 || new Set(seedIds).size !== seedIds.length)
  throw Error('Select zero to three unique Pokémon');
 size = Math.max(FORMATS[format].min, Math.min(6, +size || 6));
 const result = [];
 for(const [i,plan] of ['balanced','offense','control'].entries()){
  const built = buildWithSeeds(seedIds, roles, format, size, plan, i+1);
  if(built){
   const ids = built.roster.map(p => p.entry.id + ':' + p.set.role).join(',');
   if(!result.some(t => t.key === ids))
    result.push({plan, key:ids, score:Math.round(built.score), roster:reasonsFor(built.roster, format, lang)});
  }
 }
 return result;
}

export const spread=(kind,champions=false)=>{
 const codes={phys:['Atk','Spe'],spa:['SpA','Spe'],bulkphys:['HP','Atk'],bulkspa:['HP','SpA'],def:['HP','Def'],spdef:['HP','SpD'],support:['HP','SpD'],trickroom:['HP','SpA']};
 const [a,b]=codes[kind]||codes.phys;
 return champions?{[a]:32,[b]:32,...(a==='HP'?{Spe:2}:{HP:2})}: {[a]:252,[b]:252,...(a==='HP'?{Spe:4}:{HP:4})};
};
export function displaySpread(kind,champions){
 const data=spread(kind,champions);
 return Object.entries(data).filter(([k,v])=>v>0).map(([k,v])=>`${v} ${k}`).join(' / ');
}
export function showdownExport(roster,format){
 if(FORMATS[format]?.champions)return '';
 return roster.map(({entry,set})=>{
  const evs=displaySpread(set.spread,false);
  return `${entry.name}${set.item?" @ "+set.item:""}\nAbility: ${set.ability}\nTera Type: ${set.tera}\nEVs: ${evs}\n${set.nature} Nature\n${set.moves.map(x=>'- '+x).join('\n')}`;
 }).join('\n\n');
}
export function championsText(roster){return roster.map(({entry,set})=>`${entry.name}${set.item?" @ "+set.item:""}\nAbility: ${set.ability}\nStat Points: ${displaySpread(set.spread,true)} (66 total max)\nAlignment: ${set.nature}\n${set.moves.join(' / ')}`).join('\n\n');}