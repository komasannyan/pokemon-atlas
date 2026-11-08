import assert from 'node:assert/strict';
import {ZA_MAIN_HANDBOOK} from '../src/guides/za-main-handbook.js';
import {ZA_SIDE_HANDBOOK} from '../src/guides/za-side-handbook.js';
import {readFileSync} from 'node:fs';
assert.equal(Object.keys(ZA_MAIN_HANDBOOK).length,42);
assert.equal(Object.keys(ZA_SIDE_HANDBOOK).length,119);
assert.ok(Object.values(ZA_SIDE_HANDBOOK).every(x=>x.startHint?.length>15&&x.location?.length>3&&x.startEn&&x.locationEn));
assert.match(ZA_MAIN_HANDBOOK[14].quick,/DYN4MO/);
assert.match(ZA_SIDE_HANDBOOK[76].quick,/Eelektrossite/);
const ui=readFileSync(new URL('../src/guides/guides-v09.js',import.meta.url),'utf8');
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
const {setupGuides,openGuideTab}=await import('../src/guides/guides-v09.js');
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
console.log('Guide dashboard, exact TM reward links, checklist counts and storage notices verified.');
