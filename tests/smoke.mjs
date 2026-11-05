// Self-contained data and localization smoke tests. Run: node tests/smoke.mjs
import {strict as assert} from 'node:assert';
const store=new Map();
globalThis.localStorage={getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,String(value))};
globalThis.document={documentElement:{lang:'ru'}};
const {parseCSV}=await import('../src/data.js');
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
globalThis.fetch=async url=>({ok:true,text:async()=>files[String(url).split('/').at(-1)]});
const moves=await fetchMoveDex();
assert.equal(moves.length,841);
assert.equal(moves.find(x=>x.slug==='earthquake').power,100);
assert.equal(moves.find(x=>x.slug==='earthquake').name,'Earthquake');
assert.equal(moves.find(x=>x.slug==='shadow-rush').type,'shadow');
assert.equal(describeEffect('Has a $effect_chance% chance.',30),'Has a 30% chance.');
setLanguage('en');assert.equal(t('navMoves'),'Move Database');assert.equal(typeLabel('water'),'Water');
setLanguage('ru');assert.equal(t('navMoves'),'База атак');assert.equal(typeLabel('water'),'Водный');
console.log('Pokémon Atlas 0.2 — data and locale smoke tests passed');
