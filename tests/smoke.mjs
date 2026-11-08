// Self-contained data and localization smoke tests. Run: node tests/smoke.mjs
import {strict as assert} from 'node:assert';
const store=new Map();
globalThis.localStorage={getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,String(value))};
globalThis.document={documentElement:{lang:'ru'}};
const {parseCSV,loadCachedDex}=await import('../src/data.js');
const {fetchMoveDex,describeEffect}=await import('../src/pokedex/moves.js');
const {t,setLanguage,typeLabel}=await import('../src/i18n.js');
assert.equal(parseCSV('id,text\n1,"hello, world"\n2,"a ""quote"""')[1].text,'a "quote"');
const header='id,identifier,generation_id,type_id,power,pp,accuracy,priority,target_id,damage_class_id,effect_id,effect_chance,contest_type_id,contest_effect_id,super_contest_effect_id';
const moveRows=[header],nameRows=['move_id,local_language_id,name'];
for(let id=1;id<=840;id++){
  const slug=id===89?'earthquake':`mock-${id}`;
  const type=id===89?5:1;
  moveRows.push(`${id},${slug},1,${type},${id===89?100:40},10,100,0,10,2,1,,5,1,5`);
  nameRows.push(`${id},9,${id===89?'Earthquake':'Mock '+id}`);
}
moveRows.push('10001,shadow-rush,3,10002,55,,100,0,10,2,10001,,,,');
nameRows.push('10001,9,Shadow Rush');
const files={
  'moves.csv':moveRows.join('\n'),
  'move_names.csv':nameRows.join('\n'),
  'move_effect_prose.csv':'move_effect_id,local_language_id,short_effect,effect\n1,9,Inflicts damage.,Inflicts damage.'
};
let csvRequests=0;
globalThis.fetch=async url=>{csvRequests++;return {ok:true,text:async()=>files[String(url).split('/').at(-1)]};};
store.set('atlas-moves-v2',JSON.stringify('x'.repeat(800)));
const moves=await fetchMoveDex();
assert.equal(csvRequests,3,'a long cached string must not masquerade as a move catalogue');
assert.equal(moves.length,841);
assert.equal(moves.find(x=>x.slug==='earthquake').power,100);
assert.equal(moves.find(x=>x.slug==='earthquake').name,'Earthquake');
assert.equal(moves.find(x=>x.slug==='shadow-rush').type,'shadow');
assert.equal(describeEffect('Has a $effect_chance% chance.',30),'Has a 30% chance.');
setLanguage('en');assert.equal(t('navMoves'),'Move Database');assert.equal(typeLabel('water'),'Water');
setLanguage('ru');assert.equal(t('navMoves'),'База атак');assert.equal(typeLabel('water'),'Водный');

store.set('atlas-moves-v2',JSON.stringify(Array(800).fill(null)));
const retryMoves=await import('../src/pokedex/moves.js?invalid-cache');
assert.equal((await retryMoves.fetchMoveDex()).length,841,'invalid move rows must be refreshed');
store.set('pokemon-atlas-dex-v1',JSON.stringify(Array(1025).fill(null)));
assert.equal(loadCachedDex(),null,'invalid species rows must not reach the renderer');
store.set('atlas-abilities-v2',JSON.stringify(Array(250).fill({})));
const {fetchAbilityDex}=await import('../src/pokedex/abilities.js');
Object.assign(files,{
 'abilities.csv':'id,identifier,generation_id\n'+Array.from({length:250},(_,i)=>`${i+1},ability-${i+1},1`).join('\n'),
 'ability_names.csv':'ability_id,local_language_id,name',
 'ability_prose.csv':'ability_id,local_language_id,short_effect'
});
assert.equal((await fetchAbilityDex())[0].slug,'ability-1','invalid cached abilities must be refreshed');

// Repeated UI requests for a species share one in-flight HTTPS request. A
// rejected request must be evicted so that opening the detail again can retry.
const {fetchSpecies,fetchPokemon}=await import('../src/api.js');
let calls=0,complete;
globalThis.fetch=()=>{calls++;return new Promise(resolve=>complete=resolve);};
const first=fetchSpecies(6),second=fetchSpecies(6);
assert.equal(calls,1,'concurrent species requests must be deduplicated');
complete({ok:true,json:async()=>({id:6})});
assert.deepEqual(await Promise.all([first,second]),[{id:6},{id:6}]);
await fetchSpecies(6);assert.equal(calls,1,'successful responses remain cached');
globalThis.fetch=async()=>{calls++;return {ok:false,status:503};};
await assert.rejects(fetchPokemon('retry-test'),/HTTP 503/);
globalThis.fetch=async()=>{calls++;return {ok:true,json:async()=>({name:'retried'})};};
assert.deepEqual(await fetchPokemon('retry-test'),{name:'retried'});
assert.equal(calls,3,'failed requests must be retryable');
console.log('Pokémon Atlas 0.2 — data and locale smoke tests passed');
