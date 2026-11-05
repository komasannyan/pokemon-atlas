import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {EXTRA_RU_ABILITIES} from '../src/pokedex/abilities-ru-expanded.js';
import {fullRuAbilityInfo,effectCoverage} from '../src/pokedex/effects-ru.js';

const keys=Object.keys(EXTRA_RU_ABILITIES);
assert.ok(keys.length>=300,'Russian ability dictionary must preserve broad curated coverage');
assert.equal(effectCoverage().abilities,keys.length);
for(const id of keys){
 const info=fullRuAbilityInfo(id);
 assert.equal(info.verified,true,id);
 assert.match(info.text,/[А-Яа-яЁё]/,id);
 assert(!/Точный перевод|Описание пока|Уникальная способность покемона/.test(info.text),id);
}
// Assert verified entries currently provided by EXTRA_RU_ABILITIES, not future/unmerged game abilities.
const test=(key,rx)=>assert.match(fullRuAbilityInfo(key).text,rx);
test('overgrow',/1\/3.*Grass.*50%/);
test('static',/30%.*паралич/);
test('lightning-rod',/Electric.*Sp\. Atk/);
test('chlorophyll',/Speed/);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const worker=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
assert.match(html,/app\.js\?v=\d{3}/);
assert(worker.includes('abilities-ru-expanded.js'));
assert.match(worker,/atlas-shell-v\d{3}/);
console.log('Russian ability localization: '+keys.length+' checked entries; no placeholders; PWA assets versioned.');
