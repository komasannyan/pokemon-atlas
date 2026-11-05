import {parseCSV} from '../data.js';
import {toTitle} from '../constants.js';
const CSV='https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/';
const STORE='atlas-abilities-v2';
let pending=null;
async function table(filename){
 const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),25000);
 try{const r=await fetch(CSV+filename,{signal:ctrl.signal});if(!r.ok)throw Error(`HTTP ${r.status} — ${filename}`);return parseCSV(await r.text());}
 finally{clearTimeout(timer);}
}
export function fetchAbilityDex(){
 if(pending)return pending;
 try{const old=JSON.parse(localStorage.getItem(STORE)||'null');if(Array.isArray(old)&&old.length>=250)return pending=Promise.resolve(old);}catch{}
 pending=Promise.all([table('abilities.csv'),table('ability_names.csv'),table('ability_prose.csv')]).then(([abilities,names,prose])=>{
  const english=new Map(names.filter(x=>x.local_language_id==='9').map(x=>[+x.ability_id,x.name]));
  const effects=new Map(prose.filter(x=>x.local_language_id==='9').map(x=>[+x.ability_id,x.short_effect||x.effect||'']));
  const result=abilities.filter(a=>+a.id>0).map(a=>({id:+a.id,slug:a.identifier,name:english.get(+a.id)||toTitle(a.identifier),gen:+a.generation_id,effect:effects.get(+a.id)||''})).sort((a,b)=>a.id-b.id);
  if(result.length<250)throw Error('Incomplete abilities database');
  try{localStorage.setItem(STORE,JSON.stringify(result));}catch{}
  return result;
 }).catch(err=>{pending=null;throw err;});
 return pending;
}