import assert from 'node:assert/strict';
import {ZA_MAIN_HANDBOOK} from '../src/guides/data/za/main-handbook.js';
import {ZA_SIDE_HANDBOOK} from '../src/guides/data/za/side-handbook.js';
import {tmRows} from '../src/guides/catalogs/za.js';
import {readFileSync} from 'node:fs';
assert.equal(Object.keys(ZA_MAIN_HANDBOOK).length,42);
assert.equal(Object.keys(ZA_SIDE_HANDBOOK).length,119);
assert.ok(Object.values(ZA_SIDE_HANDBOOK).every(x=>x.startHint?.length>15&&x.location?.length>3&&x.startEn&&x.locationEn));
assert.match(ZA_MAIN_HANDBOOK[14].quick,/DYN4MO/);
assert.match(ZA_SIDE_HANDBOOK[76].quick,/Eelektrossite/);
const ui=readFileSync(new URL('../src/guides/guide-ui.js',import.meta.url),'utf8');
assert.match(ui,/guide-quick/);assert.match(ui,/guide-neighbors/);assert.match(ui,/function stepProgress/);

// Exercise guide rendering and progress events without requiring a DOM dependency.
const handlers={},stored=new Map(),status={textContent:''},counter={textContent:''};
let blockStorage=false;
const results={innerHTML:'',querySelectorAll:()=>[],querySelector:()=>null};
const root={
 innerHTML:'',
 addEventListener:(name,handler)=>handlers[name]=handler,
 querySelector:selector=>selector==='#guide-results'?results:selector==='#guide-notice'?status:null
};
globalThis.localStorage={
 getItem:key=>stored.get(key)??null,
 setItem:(key,value)=>{if(blockStorage)throw Error('Storage disabled');stored.set(key,value);}
};
globalThis.document={getElementById:()=>root};
const {setupGuides,openGuideTab}=await import('../src/guides/guide-ui.js');
setupGuides();
assert.doesNotMatch(root.innerHTML,/\[object Object\]/,'dashboard must render section labels');
assert.match(root.innerHTML,/<small>Сюжет<\/small>/);
assert.match(root.innerHTML,/<small>Побочные<\/small>/);
openGuideTab('side');
const card=id=>root.innerHTML.match(new RegExp('id="guide-side-'+id+'"[\\s\\S]*?</article>'))?.[0];
assert.ok(card(29)?.includes('data-guide-jump="tm:85"'),'quest #29 must link to its TM reward');
assert.doesNotMatch(card(2),/data-guide-jump="tm:/,'quest #2 must not match #24/#29/#126');
assert.doesNotMatch(card(1),/data-guide-jump="tm:/,'quest #1 must not match main #10/#19 or DLC #138');
assert.match(card(29),/data-guide-count[^>]*>0\/\d+</,'checklist count should be visible');
assert.ok(card(34)?.includes('data-guide-jump="tm:31"'),'quest #34 must link to TM31 even without a № marker in legacy text');
assert.ok(card(26)?.includes('data-guide-jump="tm:57"'),'quest #26 must link to TM57 even without a № marker');
for(const [tm,side] of [[31,34],[43,46],[47,88],[48,96],[57,26]]){
 const reward=tmRows.find(row=>row.id===tm);
 assert.equal(reward.side,side,'catalogue normalizes the exact side mission');
 assert.equal(reward.method,'quest','a side mission reward is not a world find');
}

// Follow the visible reward link in both directions through the actual handlers.
const jump=value=>handlers.click({target:{closest:selector=>selector==='[data-guide-jump]'?{dataset:{guideJump:value}}:null}});
jump('tm:31');
assert.match(root.innerHTML,/id="guide-tm-31"[\s\S]*?data-guide-jump="side:34"/);
jump('side:34');
assert.match(root.innerHTML,/id="guide-side-34"[\s\S]*?data-guide-jump="tm:31"/);
jump('tm:57');
assert.match(root.innerHTML,/id="guide-tm-57"[\s\S]*?data-guide-jump="side:26"/);
jump('side:26');
assert.match(root.innerHTML,/id="guide-side-26"[\s\S]*?data-guide-jump="tm:57"/);
const step={
 dataset:{guideStep:'side:29:0'},checked:true,
 closest:selector=>selector==='li'?{classList:{toggle(){}}}:{querySelector:()=>counter}
};
blockStorage=true;
handlers.change({target:step});
assert.match(status.textContent,/не дал сохранить/,'storage failures should be announced immediately');
assert.match(counter.textContent,/^1\/\d+$/,'step count should update without a page rerender');
blockStorage=false;
step.checked=false;
handlers.change({target:step});
assert.equal(status.textContent,'','successful save should clear the storage warning');
assert.equal(counter.textContent,'0/'+ZA_SIDE_HANDBOOK[29].steps.length);

// Structured lookups identify the requested record, not every mission whose
// steps happen to mention the same number. Free text terms can appear apart.
const search=value=>{
 handlers.input({target:{id:'guide-query',value}});
 return [...results.innerHTML.matchAll(/id="guide-([^"]+)"/g)].map(match=>match[1]);
};
assert.deepEqual(search('TM001'),['tm-1']);
assert.deepEqual(search('ТМ №085'),['tm-85']);
assert.deepEqual(search('side mission #29'),['side-29']);
assert.deepEqual(search('Побочное задание №29'),['side-29']);
assert.deepEqual(search('main mission 14'),['main-14']);
assert.deepEqual(search('Wild Zone 20'),['zone-20']);
assert.deepEqual(search('TM161'),[],'unknown TM IDs should not return unrelated cards');
assert.deepEqual(search('!!!'),[],'punctuation must not act like an empty query');
assert.ok(search('Substitute TM').includes('tm-85'),'word order must not hide the requested move');
assert.ok(search('TM Fake Out').includes('tm-141'),'numeric TM prefix must not break multiword move search');
assert.ok(search('Задание №106').includes('side-106'));

handlers.change({target:{id:'guide-filter',value:'done'}});
openGuideTab('main');
assert.match(root.innerHTML,/id="guide-main-1"/,'opening a guide explicitly must clear a stale completion filter');
assert.match(root.innerHTML,/<option value="all" selected>/);
console.log('Guide dashboard, exact lookups, checklist counts, storage notices and explicit navigation verified.');
