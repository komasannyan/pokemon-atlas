import assert from 'node:assert/strict';
import {SV_GUIDE,SV_TABS} from '../src/guides/data/sv/base-game.js';
import {ZA_PRACTICAL_GUIDE} from '../src/guides/data/za/practical-guide.js';
import {SV_POSTGAME} from '../src/guides/data/sv/postgame.js';
import {SV_GUIDE as CATALOG,SV_TABS as CATALOG_TABS} from '../src/guides/catalogs/sv.js';
import {readProgress,updateProgress} from '../src/guides/guide-progress.js';

const key=x=>x.kind+':'+x.id;
const keys=new Set(CATALOG.map(key));
assert.equal(keys.size,32,'each base/postgame objective needs a unique stable identity');
assert.equal(SV_POSTGAME.length,6);
assert.ok(CATALOG_TABS.some(([kind])=>kind==='postgame'));
for(const [kind,count] of Object.entries({route:2,gym:8,titan:5,star:5,finale:4,help:2})){
 assert.equal(SV_GUIDE.filter(x=>x.kind===kind).length,count,kind);
}
assert.deepEqual(SV_GUIDE.filter(x=>x.order).map(x=>x.order).sort((a,b)=>a-b),Array.from({length:18},(_,i)=>i+1));
assert.deepEqual(SV_TABS.map(x=>x[0]),['start','gym','titan','star','finale','help']);
assert.ok(SV_GUIDE.filter(x=>x.kind==='titan').every(x=>x.level===undefined),'do not guess Titan levels');
for(const record of [...CATALOG,...ZA_PRACTICAL_GUIDE]){
 assert.ok(record.name&&record.steps.length>=3,key(record));
 assert.ok(record.sources.length>=1,key(record)+' needs a source');
 for(const link of record.sources){
  const url=new URL(link);assert.equal(url.protocol,'https:');
  assert.ok(['www.serebii.net','bulbapedia.bulbagarden.net','www.nintendolife.com'].includes(url.hostname));
 }
 const stepIds=new Set();
 for(const step of record.steps){
  assert.ok(step.id&&!stepIds.has(step.id));stepIds.add(step.id);
  assert.ok(step.ru.length>=25&&step.en.length>=25,key(record)+' needs bilingual directions');
 }
}
for(const record of CATALOG)for(const related of record.related||[])assert.ok(keys.has(related.join(':')),'broken guide link: '+related);
assert.equal(ZA_PRACTICAL_GUIDE.length,6);
assert.equal(new Set(ZA_PRACTICAL_GUIDE.map(key)).size,6);

// The actual renderer must select only the current game's records, while
// preserving the existing Z-A and version-specific completion/checklist keys.
const handlers={},stored=new Map([
 ['pokemon-atlas-guide-progress-v1',JSON.stringify({'legends-za:main:1':true})]
]);
const status={textContent:''},counter={textContent:''};
const results={innerHTML:'',querySelectorAll:()=>[],querySelector:()=>null};
const root={innerHTML:'',addEventListener:(event,fn)=>handlers[event]=fn,
 querySelector:selector=>selector==='#guide-results'?results:selector==='#guide-notice'?status:null};
globalThis.localStorage={getItem:key=>stored.get(key)||null,setItem:(key,value)=>stored.set(key,value)};
globalThis.document={getElementById:()=>root,documentElement:{lang:'ru'}};
const {setupGuides,openGuideTab,refreshGuides}=await import('../src/guides/guide-ui.js');
const {setLanguage}=await import('../src/i18n.js');
setupGuides();
const search=value=>{
 handlers.input({target:{id:'guide-query',value}});
 return [...results.innerHTML.matchAll(/<article[^>]+id="guide-([^"]+)"/g)].map(x=>x[1]);
};
const fakeCard={classList:{toggle(){}},querySelector:()=>counter};
const mark=(dataset,checked=true)=>handlers.change({target:{dataset,checked,closest:()=>fakeCard}});

openGuideTab('gym','scarlet');
assert.match(root.innerHTML,/id="guide-gym-1"/);
assert.doesNotMatch(root.innerHTML,/guide-main-|Mega Dimension|Z-A Royale/);
assert.deepEqual(search('gym1'),['gym-1']);
assert.deepEqual(search('Katy'),['gym-1','route-paldea-order','help-scope-and-levels']);
assert.deepEqual(search('TM001'),[],'SV search must never return a Z-A TM');
openGuideTab('postgame','scarlet');
for(const entry of SV_POSTGAME)assert.ok(root.innerHTML.includes('id="guide-postgame-'+entry.id+'"'));
assert.match(root.innerHTML,/10 рейдах/,'six-star raid unlock guidance is available');
openGuideTab('gym','scarlet');
mark({guideDone:'gym:1'});
mark({guideStep:'gym:1:0'});
let progress=JSON.parse(stored.get('pokemon-atlas-guide-progress-v1'));
assert.equal(progress['scarlet:gym:1'],true);
assert.equal(progress['legends-za:main:1'],true,'keep earlier Z-A progress');
assert.ok(Object.keys(JSON.parse(stored.get('pokemon-atlas-guide-steps-v1'))).some(k=>k.startsWith('scarlet:gym:1:content:')));
openGuideTab('gym','violet');
assert.doesNotMatch(root.innerHTML,/<input[^>]+data-guide-done="gym:1" checked/);
assert.match(root.innerHTML,/data-guide-count[^>]*>0\/3</,'Violet must not inherit Scarlet step marks');
openGuideTab('gym','scarlet');
assert.match(root.innerHTML,/<input[^>]+data-guide-done="gym:1" checked/);
assert.match(root.innerHTML,/data-guide-count[^>]*>1\/3</);
openGuideTab('start','scarlet');
assert.equal((root.innerHTML.match(/class="guide-route-list"/g)||[]).length,1,'recommended order links are visible');
assert.equal((root.innerHTML.match(/data-guide-jump="(?:gym|titan|star):/g)||[]).length,18);

handlers.change({target:{id:'guide-filter',value:'done',dataset:{}}});
handlers.change({target:{id:'guide-game',value:'violet',dataset:{}}});
assert.match(root.innerHTML,/<option value="all" selected>/,'game changes clear stale progress filters');
openGuideTab('main','legends-za');
assert.deepEqual(search('TM001'),['tm-1']);
openGuideTab('help','legends-za');
for(const topic of ZA_PRACTICAL_GUIDE)assert.ok(root.innerHTML.includes('id="guide-help-'+topic.id+'"'));
mark({guideStep:'help:day-night-respawns:0'});
assert.ok(Object.keys(JSON.parse(stored.get('pokemon-atlas-guide-steps-v1'))).some(k=>k.startsWith('legends-za:help:day-night-respawns:content:')));

setLanguage('en');openGuideTab('start','scarlet');refreshGuides();
assert.match(root.innerHTML,/Getting started: Cabo Poco/);
assert.match(root.innerHTML,/DLC walkthroughs are not included yet/);
openGuideTab('help','legends-za');
assert.match(root.innerHTML,/Day, night and wild/);
openGuideTab('start','red');
assert.doesNotMatch(root.innerHTML,/class="guide-card /,'unsupported games must not borrow other games’ missions');

setLanguage('en');
const englishLoad=await import('../src/guides/guide-ui.js?english-index');
englishLoad.setupGuides();
setLanguage('ru');englishLoad.openGuideTab('gym','scarlet');
assert.deepEqual(search('арена Katy'),['gym-1'],'index both language labels even when the module first loads in English');
englishLoad.openGuideTab('extra','legends-za');
assert.match(root.innerHTML,/Особое задание · EX1/,'preserve existing EX mission identifiers');
setLanguage('en');englishLoad.openGuideTab('recipe','legends-za');
assert.match(root.innerHTML,/Prepare the donut with Ansha/,'recipe instructions follow language changes after module load');

// Two tabs may have stale local maps: each checkbox update merges into the
// newest persisted map and removal must retain unrelated marks.
const progressStore=new Map();
const shared={getItem:key=>progressStore.get(key)??null,setItem:(key,value)=>progressStore.set(key,value)};
const tabA=readProgress(shared,'progress'),tabB=readProgress(shared,'progress');
assert.deepEqual(tabA,tabB);
updateProgress(shared,'progress','legends-za:main:1',true);
updateProgress(shared,'progress','scarlet:gym:1',true);
assert.deepEqual(readProgress(shared,'progress'),{'legends-za:main:1':true,'scarlet:gym:1':true});
updateProgress(shared,'progress','legends-za:main:1',false);
assert.deepEqual(readProgress(shared,'progress'),{'scarlet:gym:1':true});
progressStore.set('progress','[]');
assert.throws(()=>updateProgress(shared,'progress','violet:gym:2',true),/Invalid guide progress/);
assert.equal(progressStore.get('progress'),'[]','do not overwrite malformed storage');
console.log('SV guide: sourced bilingual objectives, route links, isolated progress, search and Z-A additions verified.');
