// For standard, non-HP stats, Generation III onward. Games with DV, Grit, AV or
// unusual battle stat systems are intentionally unsupported (no fabricated IVs).
export const STAT_KEYS=['HP','Atk','Def','SpA','SpD','Spe'];
const n=(u,d)=>({name:u,up:d[0],down:d[1]});
export const NATURES=[n('Hardy',[-1,-1]),n('Lonely',[1,2]),n('Brave',[1,5]),n('Adamant',[1,3]),n('Naughty',[1,4]),
 n('Bold',[2,1]),n('Docile',[-1,-1]),n('Relaxed',[2,5]),n('Impish',[2,3]),n('Lax',[2,4]),
 n('Timid',[5,1]),n('Hasty',[5,2]),n('Serious',[-1,-1]),n('Jolly',[5,3]),n('Naive',[5,4]),
 n('Modest',[3,1]),n('Mild',[3,2]),n('Quiet',[3,5]),n('Bashful',[-1,-1]),n('Rash',[3,4]),
 n('Calm',[4,1]),n('Gentle',[4,2]),n('Sassy',[4,5]),n('Careful',[4,3]),n('Quirky',[-1,-1])];
export const ROLES=['general','physical','special','defensive','fast','trickroom'];
export function statFor(base,iv,ev,level,nature,isHp=false){
 if(isHp&&base===1)return 1; // Shedinja
 const raw=Math.floor((2*base+iv+Math.floor(ev/4))*level/100);
 return isHp?raw+level+10:Math.floor((raw+5)*nature);
}
const natureMod=(nature,index)=>{
 const n=NATURES.find(x=>x.name===nature)||NATURES[0];
 return n.up===index?1.1:n.down===index?0.9:1;
};
export function inferIVs(base,level,nature,observed,evs,evKnown=true){
 if(!Number.isInteger(level)||level<1||level>100)return Array(6).fill(null);
 return Array.from({length:6},(_,i)=>{
  const raw=observed?.[i];if(raw===undefined||raw===null||String(raw).trim()==='')return null;
  const value=+raw;if(!Number.isInteger(value)||value<=0)return {min:null,max:null,count:0,error:true};
  const b=base?.[i];if(!Number.isFinite(b)||b<1)return null;
  if(i===0&&b===1)return value===1?{min:0,max:31,count:32,unidentifiable:true}:{min:null,max:null,count:0,error:true};
  const ivs=new Set();
  const evList=evKnown?[+evs?.[i]||0]:Array.from({length:64},(_,j)=>j*4);
  for(const ev of evList)for(let iv=0;iv<=31;iv++){
   if(statFor(b,iv,ev,level,natureMod(nature,i),i===0)===value)ivs.add(iv);
  }
  const sorted=[...ivs].sort((a,b)=>a-b);
  return sorted.length?{min:sorted[0],max:sorted[sorted.length-1],count:sorted.length}:
   {min:null,max:null,count:0,error:true};
 });
}
const WEIGHTS={
 general:[20,18,16,18,14,14],physical:[15,32,13,1,12,27],special:[15,1,12,32,13,27],
 defensive:[30,12,23,3,24,8],fast:[10,20,5,20,5,40],trickroom:[21,28,17,22,11,1]
};
function natureBonus(nature,role){
 const n=NATURES.find(x=>x.name===nature)||NATURES[0], weights=WEIGHTS[role]||WEIGHTS.general;
 if(n.up<0)return 8;
 // Is +10% boosting a role's priority and -10% weakening a low-priority stat?
 const delta=weights[n.up]-weights[n.down];
 return Math.min(15,Math.max(1,Math.round(8+delta/6)));
}
export function evaluateIndividual(p,record){
 const filled=(record.observed||[]).filter(v=>String(v??'')!==''&&+v>0).length;
 const base=p.stats||[];const lv=+record.level;
 const valid=base.length===6&&base.every(v=>Number.isFinite(v)&&v>0);
 if(!valid)return {ranges:[],error:'no-base'};
 if(!Number.isInteger(lv)||lv<1||lv>100)return {ranges:[],filled,error:'inconsistent'};
 const evs=record.evs||Array(6).fill(0), evKnown=record.evMode!=='unknown';
 if(evKnown&&(evs.some(v=>v===''||v===null||+v<0||+v>252||!Number.isInteger(+v))||evs.reduce((a,b)=>a+(+b||0),0)>510))return {ranges:[],error:'invalid-ev'};
 const ranges=inferIVs(base,lv,record.nature,record.observed,evs,evKnown);
 const impossible=ranges.some(r=>r?.error);
 if(impossible)return {ranges,filled,error:'inconsistent'};
 if(filled===0)return {ranges,filled};
 const w=WEIGHTS[record.role]||WEIGHTS.general;const bonus=natureBonus(record.nature,record.role);
 // Unknown IVs contribute their entire [0,31] interval to avoid false precision.
 let low=0,high=0;
 for(let i=0;i<6;i++){
   low+=w[i]*(ranges[i]?.min??0)/31;
   high+=w[i]*(ranges[i]?.max??31)/31;
 }
 const lower=Math.max(1,Math.min(100,Math.round(low*0.85+bonus))),upper=Math.max(1,Math.min(100,Math.round(high*0.85+bonus)));
 return {ranges,filled,lower,upper,score:Math.round((lower+upper)/2),provisional:filled<6||lower!==upper||!evKnown};
}
