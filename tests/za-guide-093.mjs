// Pokémon Atlas 0.9.3: deep Mega Dimension guide integrity and UI wiring.
// Run: node tests/za-guide-093.mjs
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ZA_MAIN} from '../src/guides/data/za/main-data.js';
import {ZA_BASE_DEEP} from '../src/guides/data/za/base-handbook.js';
import {ZA_MAIN_STEPS} from '../src/guides/data/za/walkthrough-details.js';
import {ZA_SIDE_DETAILED} from '../src/guides/data/za/extras.js';
import {ZA_SIDE_CLARIFICATIONS} from '../src/guides/data/za/mission-clarifications.js';
import {ZA_SIDE} from '../src/guides/data/za/side-data.js';
import {ZA_DLC_MAIN} from '../src/guides/data/za/dlc-data.js';
import {ZA_DLC_81} from '../src/guides/data/za/dlc-all-side.js';
import {ZA_DLC_DEEP,ZA_DLC_UNLOCKS,ZA_DLC_STORY_DEEP,ZA_FAQ_EXTENDED,ZA_COMPLETION_ROUTE} from '../src/guides/data/za/dlc-handbook.js';
import {ZA_TMS_ENRICHED} from '../src/guides/data/za/tms-enriched.js';
import {ZA_ZONES} from '../src/guides/data/za/world.js';

assert.equal(ZA_MAIN.length,42,'base story mission count');
for(let id=1;id<=42;id++){
 assert.ok(typeof ZA_MAIN_STEPS[id]==='string' && ZA_MAIN_STEPS[id].split('|').length>=3,`main mission ${id} lacks a multi-step walkthrough`);
}
assert.equal(ZA_COMPLETION_ROUTE.length,8,'complete game route should have eight milestones');
assert.ok(ZA_COMPLETION_ROUTE.every(x=>x.steps?.length>=3&&x.related?.length),'every route stage needs directions and linked quests');
assert.equal(ZA_SIDE.length,119,'base side mission count');
for(let id=1;id<=119;id++){
 const steps=ZA_SIDE_DETAILED[id]?.steps||ZA_SIDE_CLARIFICATIONS[id]||ZA_BASE_DEEP[id];
 assert.ok(Array.isArray(steps)&&steps.length>=2,`base side mission ${id} lacks a multi-step walkthrough`);
 assert.ok(steps.every(s=>s.length>=15),`base side mission ${id} has a trivial placeholder`);
}
assert.equal(ZA_DLC_MAIN.length,14,'DLC main mission count');
assert.equal(ZA_DLC_81.length,81,'DLC side mission count');
assert.equal(ZA_TMS_ENRICHED.length,160,'TM count');
assert.equal(ZA_ZONES.length,20,'Wild Zone count');

const consecutive=(arr,start)=>arr.every((x,i)=>Number(x.id)===i+start);
assert.ok(consecutive(ZA_MAIN,1),'story IDs must be 1–42');
assert.ok(consecutive(ZA_SIDE,1),'base side IDs must be 1–119');
assert.ok(consecutive(ZA_DLC_MAIN,1),'DLC story IDs must be 1–14');
assert.ok(consecutive(ZA_DLC_81,120),'DLC side IDs must be 120–200');
for(let id=120;id<=200;id++){
 const steps=ZA_DLC_DEEP[id];
 assert.ok(Array.isArray(steps) && steps.length>=2,`side mission ${id} lacks multi-step walkthrough`);
 assert.ok(steps.every(s=>typeof s==='string'&&s.trim().length>=20),`side mission ${id} contains an empty step`);
}
for(let id=1;id<=14;id++){
 const steps=ZA_DLC_STORY_DEEP[id];
 assert.ok(Array.isArray(steps)&&steps.length>=2,`DLC main ${id} lacks steps`);
}
assert.ok(ZA_FAQ_EXTENDED.length>=15,'troubleshooting handbook must be populated');
assert.equal(new Set(ZA_FAQ_EXTENDED.map(x=>x.id)).size,ZA_FAQ_EXTENDED.length,'help topic IDs must be unique');
for(const topic of ZA_FAQ_EXTENDED){
 assert.ok(topic.name&&topic.tags&&topic.steps.length>=2);
 assert.ok(topic.related?.length,'each help topic must link to guide content');
}
assert.match(ZA_DLC_UNLOCKS[120],/42/);
assert.match(ZA_DLC_UNLOCKS[139],/108/);
assert.match(ZA_DLC_UNLOCKS[195],/190/);
assert.match(ZA_DLC_UNLOCKS[200],/199/);
assert.ok(ZA_DLC_DEEP[175].some(s=>s.includes('Foul Play')));
assert.ok(ZA_DLC_DEEP[200].some(s=>s.includes('Gp58JatW')));
assert.ok(ZA_DLC_DEEP[195].some(s=>s.includes('999 Mega Shards')));
const ui=readFileSync(new URL('../src/guides/guide-ui.js',import.meta.url),'utf8');
const {ZA_GUIDE}=await import('../src/guides/catalogs/za.js');
for(const row of ZA_GUIDE.filter(x=>x.kind==='dlc-side'))assert.deepEqual(row.steps,ZA_DLC_DEEP[row.id]);
for(const row of ZA_GUIDE.filter(x=>x.kind==='dlc-main'))assert.deepEqual(row.steps,ZA_DLC_STORY_DEEP[row.id]);
for(const topic of ZA_FAQ_EXTENDED)assert.ok(ZA_GUIDE.some(x=>x.kind==='help'&&x.guideTopic===topic.id));
assert.equal(ZA_GUIDE.filter(x=>x.kind==='route').length,8);
assert.match(ui,/Check source/,'sources visible');
const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const translations=readFileSync(new URL('../src/i18n.js',import.meta.url),'utf8');
assert.match(sw,/data\/za\/dlc-handbook\.js/,'new data should be cached');
assert.match(sw,/data\/za\/base-handbook\.js/,'base data should be cached');
assert.match(sw,/atlas-shell-v914/,'service worker cache should be bumped');
assert.match(html,/src\/app\.js\?v=914/,'HTML should load fresh JS');
assert.match(translations,/Версия 0\.9\.14/,'Russian UI release label should be updated');
assert.match(translations,/Version 0\.9\.14/,'English UI release label should be updated');
console.log('Pokémon Atlas 0.9.3: 81 DLC sides, 14 story missions, FAQ, unlocks and assets OK');
