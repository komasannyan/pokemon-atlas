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
 return types.reduce((v,type)=>v*(TYPE_CHART[attack]?.[type]??1),1);
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
const countFlags=roster=>{
 const count=fn=>roster.reduce((n,p)=>n+(fn(p.set)?1:0),0);
 return {
  hazards:count(s=>has(s,HAZARDS)),removal:count(s=>has(s,REMOVE)),pivot:count(s=>has(s,PIVOT)),speed:count(s=>has(s,SPEED)),redirect:count(s=>has(s,REDIRECT)),protect:count(s=>has(s,PROTECT)),fakeout:count(s=>has(s,['Fake Out'])),
  physical:count(s=>has(s,PHYS)&&['physical','setup','tank','mega','hazards','pivot'].includes(s.role)),
  special:count(s=>has(s,SPECIAL)&&['special','setup','tank','mega','weather'].includes(s.role)),
  wall:count(s=>['wall','support','redirect','trickroom'].includes(s.role)),
  mega:count(s=>/ite$/i.test(s.item)&&!/eviolite/i.test(s.item))
 };
};
const weaknessCounts=(roster)=>Object.fromEntries(TYPES.map(type=>[type,roster.filter(p=>multiplier(type,p.entry.types,p.set.ability)>=2).length]));
export function teamCoverage(roster){
 const results=TYPES.map(type=>({type,weak:roster.filter(p=>multiplier(type,p.entry.types,p.set.ability)>=2).length,resist:roster.filter(p=>multiplier(type,p.entry.types,p.set.ability)<1).length}));
 return results.sort((a,b)=>b.weak-a.weak||a.resist-b.resist);
}
const isMega=s=>/(?:ite|itex|itey|itez)$/i.test(String(s.item||'').replace(/[^a-z]/gi,'')) && !['Eviolite'].includes(s.item);
function candidateValue(entry,set,roster,format,plan,index){
 const flags=countFlags(roster),fmt=FORMATS[format];
 if(roster.some(p=>p.entry.id===entry.id))return -1e9;
 if(fmt.champions&&set.item&&roster.some(p=>p.set.item===set.item))return -1e9;
 if(fmt.champions&&isMega(set)&&roster.some(p=>isMega(p.set)))return -1e9;
 const before=weaknessCounts(roster),after=weaknessCounts([...roster,{entry,set}]);
 let score=8;
 for(const type of TYPES){
   if(before[type]>0&&multiplier(type,entry.types,set.ability)<1)score+=3.0+Math.min(before[type],3);
   if(after[type]>=3&&before[type]<after[type])score-=6+(after[type]-3)*3;
   else if(after[type]===2&&before[type]<after[type])score-=1.6;
 }
 const wanted=fmt.doubles?{speed:11,redirect:7,fakeout:6,protect:2,physical:6,special:6} : {hazards:11,removal:10,pivot:4,physical:7,special:7,wall:3};
 for(const [key,w] of Object.entries(wanted)){
   const next=countFlags([...roster,{entry,set}]);
   if(!flags[key]&&next[key])score+=w;
   if(flags[key]>=2&&next[key]>flags[key])score-=key==='protect'?0:key==='physical'||key==='special'?2:4;
 }
 if(fmt.doubles){
   if(!has(set,PROTECT)&&!['Assault Vest','Choice Scarf','Choice Specs','Choice Band'].includes(set.item))score-=2;
   if(set.role==='lead'&&has(set,HAZARDS))score-=4;
 } else if(set.role==='redirect')score-=7;
 if(plan==='offense')score+=['physical','special','setup','mega','tank'].includes(set.role)?4:0;
 if(plan==='control')score+=['pivot','wall','support','speed','redirect','hazards','removal'].includes(set.role)?4:0;
 if(plan==='balanced')score+=['pivot','removal','speed'].includes(set.role)?1.5:0;
 // Give varied but reproducible tie breaks; discourage picking the same lead in each variant.
 score+=((entry.id*31+index*17)%13)/100;
 if(roster.some(p=>p.set.ability==='Sand Stream')&&set.ability==='Sand Rush')score+=9;
 if(roster.some(p=>p.set.ability==='Drizzle')&&set.ability==='Swift Swim')score+=8;
 if(roster.some(p=>p.set.ability==='Drought')&&set.ability==='Chlorophyll')score+=8;
 if(set.ability==='Sand Stream'&&roster.some(p=>p.set.ability==='Sand Rush'))score+=9;
 if(roster.some(p=>p.set.ability==='Grassy Surge')&&has(set,['Earthquake']))score-=3;
 return score;
}
function buildWithSeeds(seedIds,roles,format,size,plan,variant){
 const entire=fullPool(format);
 // Every eligible species is manually selectable; automatic recommendations scan a
 // competitively relevant, diverse shortlist for responsiveness on mobile devices.
 const pool=entire;const candidatesPool=entire.filter(p=>!!setsFor(p,format).length).sort((a,b)=>(b.stats?.reduce((x,y)=>x+y,0)||0)-(a.stats?.reduce((x,y)=>x+y,0)||0)).slice(0,175);
 const byId=new Map(pool.map(p=>[p.id,p]));
 const seeds=seedIds.map(id=>byId.get(id));if(seeds.some(x=>!x))return null;
 // Enumerate all seed roles (up to 2 seed mons) to optimize the sets for the existing team.
 const choices=seeds.map((entry,i)=>setsFor(entry,format).filter(s=>!roles[i]||roles[i]==='auto'||s.role===roles[i]));
 if(choices.some(c=>!c.length))return null;
 const combos=choices.reduce((arr,sets)=>arr.flatMap(prefix=>sets.map(set=>[...prefix,set])),[[]]);
 let result=null;
 for(const combo of combos){
  const roster=[];
  for(let i=0;i<seeds.length;i++){
   const set=adjustItem(combo[i],format,roster);
   roster.push({entry:seeds[i],set,seed:true,why:[]});
  }
  if(FORMATS[format].champions){
    const items=roster.map(x=>x.set.item).filter(Boolean);if(new Set(items).size!==items.length||roster.filter(x=>isMega(x.set)).length>1)continue;
  }
  let quality=combo.reduce((v,set,i)=>v+candidateValue(seeds[i],set,roster.filter((_,j)=>j!==i),format,plan,i),0);
  while(roster.length<size){
   const candidates=[];
   for(const entry of candidatesPool)if(!roster.some(p=>p.entry.id===entry.id))for(const set of setsFor(entry,format)){
    const candidateSet=adjustItem(set,format,roster);
    const value=candidateValue(entry,candidateSet,roster,format,plan,variant+roster.length);
    if(value>-100000)candidates.push({entry,set:candidateSet,value});
   }
   candidates.sort((a,b)=>b.value-a.value||a.entry.id-b.entry.id);
   if(!candidates.length)break;
   // Different plans naturally lead to varied builds; avoid pointless randomization.
   const chosen=candidates[0];quality+=chosen.value;
   roster.push({...chosen,seed:false,why:[]});
  }
  if(roster.length===size&&(!result||quality>result.score))result={roster,score:quality};
 }
 return result;
}
function reasonsFor(roster,format,lang){
 const ru=lang!=='en';return roster.map((p,i)=>{
  const others=roster.filter((_,j)=>i!==j);
  const reasons=[];
  const helps=TYPES.filter(type=>others.some(o=>multiplier(type,o.entry.types,o.set.ability)>=2)&&multiplier(type,p.entry.types,p.set.ability)<1);
  if(helps.length)reasons.push(ru?`Прикрывает слабости команды к типам: ${helps.slice(0,3).join(', ')}.`:`Covers team weaknesses to ${helps.slice(0,3).join(', ')}.`);
  if(p.set.role==='removal')reasons.push(ru?'Убирает Stealth Rock и другие ловушки, облегчая переключения.':'Clears hazards for safer switches.');
  if(p.set.role==='lead'||p.set.role==='hazards')reasons.push(ru?'Создаёт давление ловушками на поле соперника.':'Adds hazard pressure.');
  if(p.set.role==='speed')reasons.push(ru?'Даёт контроль скорости для союзников.':'Supplies speed control.');
  if(p.set.role==='redirect')reasons.push(ru?'Отводит направленные атаки от партнёра.':'Redirects targeted attacks from its partner.');
  if(p.set.ability==='Sand Rush'&&others.some(o=>o.set.ability==='Sand Stream'))reasons.push(ru?'Sand Rush удваивает скорость под песком партнёра.':'Sand Rush gains speed under teammate sand.');
  if(p.set.role==='mega')reasons.push(ru?'Использует слот Mega Evolution для атакующей роли.':'Uses the Mega slot for offensive pressure.');
  if(!reasons.length)reasons.push(ru?'Дополняет набор атак и ролей команды.':'Adds an additional offensive or defensive role.');
  return {...p,why:reasons.slice(0,2)};
 });
}
export function generateSuggestions({format='ou',seedIds=[],roles=[],size=6,lang='ru'}){
 if(!FORMATS[format])throw Error('Unknown format');
 if(seedIds.length>2||new Set(seedIds).size!==seedIds.length)throw Error('Select zero, one or two unique Pokémon');
 size=Math.max(FORMATS[format].min,Math.min(6,+size||6));
 const result=[];
 for(const [i,plan] of ['balanced','offense','control'].entries()){
  const built=buildWithSeeds(seedIds,roles,format,size,plan,i+1);
  if(built){const ids=built.roster.map(p=>p.entry.id+':'+p.set.role).join(',');if(!result.some(t=>t.key===ids))result.push({plan,key:ids,score:Math.round(built.score),roster:reasonsFor(built.roster,format,lang)});}
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
