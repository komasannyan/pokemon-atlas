import assert from 'node:assert/strict';
import {CORE_GAMES,recordedInVersion,recordedVersions} from '../src/pokedex/game-availability.js';
import {cleanSource} from '../src/pokedex/translate-ru.js';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {COLLECTION_GAMES,gameFor} from '../src/collection/collection-games.js';
import {NATURES,ROLES,evaluateIndividual,inferIVs} from '../src/collection/collection-calc.js';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
assert.equal(CORE_GAMES.length,38);
assert.equal(new Set(CORE_GAMES.map(x=>x[0])).size,38);
assert(CORE_GAMES.some(g=>g[0]==='legends-za'));
const rows=[{location_area:{name:'route-1'},version_details:[{version:{name:'red'},max_chance:20,encounter_details:[{min_level:3,max_level:5,method:{name:'walk'}}]}]}];
assert.deepEqual([...recordedVersions(rows)],['red']);
assert.equal(recordedInVersion(rows,'red')[0].min,3);
assert.deepEqual(recordedInVersion(rows,'violet'),[]);
assert.equal(cleanSource('Some [flinch]{mechanic:flinch} here.\n'),'Some flinch here.');
assert(html.includes('data-view="abilities"'));
assert(html.includes('id="ability-list"'));
assert(html.includes('id="move-sort"'));
assert(html.includes('id="hero-genus"'));
assert.match(html,/src="\.\/src\/app\.js\?v=\d{3}"/);
assert(app.includes('translatedRussian('));
assert(app.includes('chooseHero(state.dex)'));
assert(app.includes('state.moveSort'));
assert(app.includes("from './pokedex/game-availability.js'"),'location availability logic should remain connected');

// Opening a saved specimen must render its details, including after a page reload.
const collectionRecord={count:1,shiny:0,instances:[{nickname:'Atlas specimen',level:50,nature:'Hardy',role:'general',observed:[],evs:[0,0,0,0,0,0]}]};
globalThis.localStorage={getItem:key=>key==='pokemon-atlas-collection-v1'?JSON.stringify({version:1,games:{violet:{1:collectionRecord}}}):null};
const clickHandlers=[];
const collectionRoot={innerHTML:'',addEventListener:(type,fn)=>{if(type==='click')clickHandlers.push(fn);}};
const modalContent={innerHTML:''},modal={hidden:true};
globalThis.document={
 documentElement:{lang:'ru'},body:{classList:{add(){},remove(){}}},addEventListener(){},
 querySelector:selector=>({'#collection-view':collectionRoot,'#collection-modal-content':modalContent,'#collection-modal':modal}[selector]||null)
};
globalThis.fetch=async()=>({ok:true,json:async()=>({dexes:{31:Array.from({length:400},(_,i)=>[i+1,i+1])}})});
const {setupCollection}=await import('../src/collection/collection-ui.js');
setupCollection(()=>[{id:1,name:'Bulbasaur',types:['grass','poison'],stats:[45,49,49,65,65,45],abilities:[]}]);
const openButton={dataset:{colOpen:'1'}};
assert.doesNotThrow(()=>clickHandlers[0]({target:{closest:()=>openButton}}));
assert.equal(modal.hidden,false);
assert.match(modalContent.innerHTML,/Atlas specimen/);
assert.match(modalContent.innerHTML,/data-col-edit="0"/);

// Invalid and partially damaged backups must never silently replace a valid
// collection; a quota failure must keep the current in-memory data intact too.
const damagedSpecimens={count:2,shiny:0,instances:[collectionRecord.instances[0],null]};
const stored=new Map([['pokemon-atlas-collection-v1',JSON.stringify({version:1,games:{violet:{1:collectionRecord,2:null,3:damagedSpecimens}}})]]);
let refuseStorage=false,confirmCalls=0;
const notice={textContent:'',hidden:true},collectionPanel={innerHTML:''};
const context={
 COLLECTION_GAMES,gameFor,NATURES,ROLES,isEnglish:()=>false,
 localStorage:{getItem:key=>stored.get(key)||null,setItem(key,value){if(refuseStorage)throw Error('Quota exceeded');stored.set(key,value);}},
 document:{querySelector:selector=>selector==='#col-notice'?notice:selector==='#collection-root'?collectionPanel:null},
 window:{confirm(){confirmCalls++;return true;}},setTimeout(){},
};
const collectionSource=readFileSync(new URL('../src/collection/collection-ui.js',import.meta.url),'utf8');
runInNewContext(collectionSource.replace(/^import .*;\s*$/gm,'').replace(/^export /gm,'')+'\nfunction snapshot(){return JSON.stringify(data.games);};function persistLoaded(){return save();}',context);
const initialSnapshot=context.snapshot();
assert.equal(JSON.parse(initialSnapshot).violet[1].instances[0].nickname,'Atlas specimen','valid saved records survive a damaged sibling');
assert.equal(JSON.parse(initialSnapshot).violet[2],undefined);
assert.equal(JSON.parse(initialSnapshot).violet[3].count,2,'damaged specimen must not discard species counts');
assert.equal(JSON.parse(initialSnapshot).violet[3].instances.length,1);
assert.equal(JSON.parse(initialSnapshot).violet[3].instances[0].nickname,'Atlas specimen','valid specimens survive malformed neighbors inside the same species');
assert.equal(context.persistLoaded(),true);
assert.equal(JSON.parse(stored.get('pokemon-atlas-collection-v1')).games.violet[3].instances[0].nickname,'Atlas specimen','later saves must retain the recovered valid specimen');
const backup=games=>({schema:'pokemon-atlas-collection',version:1,games});
const unknownEV={...collectionRecord,instances:[{...collectionRecord.instances[0],evMode:'unknown',evs:[252,252,252,252,252,252]}]};
assert.equal(context.validateImport(backup({violet:{1:unknownEV}})).violet[1].instances[0].nickname,'Atlas specimen','unknown EV mode must retain records with stale ignored EV inputs');
for(const games of [{violet:{3:damagedSpecimens}},[],{violet:[]},{unknown:{}},{violet:{1:collectionRecord,2:null}},{violet:{1:{...collectionRecord,shiny:0,instances:[{level:50,shiny:true}]}}}]){
 await context.importJson({size:100,text:async()=>JSON.stringify(backup(games))});
 assert.equal(context.snapshot(),initialSnapshot,'reject the entire malformed backup without replacing existing data');
}
assert.equal(confirmCalls,0,'invalid backups must fail before replacement confirmation');
refuseStorage=true;
await context.importJson({size:100,text:async()=>JSON.stringify(backup({violet:{25:{count:1,shiny:0,instances:[]}}}))});
assert.equal(context.snapshot(),initialSnapshot,'failed persistence must restore the current collection');
assert.match(notice.textContent,/Не удалось сохранить/);
assert.equal(notice.hidden,false);
refuseStorage=false;
await context.importJson({size:100,text:async()=>JSON.stringify(backup({violet:{25:{count:1,shiny:0,instances:[]}}}))});
assert.equal(JSON.parse(context.snapshot()).violet[25].count,1,'a valid backup can be imported after storage recovers');
assert.equal(JSON.parse(stored.get('pokemon-atlas-collection-v1')).games.violet[25].count,1);

const mon={stats:[45,49,49,65,65,45]};
const record={level:50,nature:'Hardy',role:'general',observed:['', '', '', '', '', ''],evs:[0,0,0,0,0,0]};
assert.equal(evaluateIndividual(mon,{...record,level:50.5}).error,'inconsistent','fractional levels must not produce an IV rating');
for(const observed of [[100.5],[-1],['invalid']])assert.equal(evaluateIndividual(mon,{...record,observed}).error,'inconsistent');
assert.equal(inferIVs([1,90,45,30,30,40],50,'Hardy',[2],record.evs)[0].error,true,'Shedinja HP above one is impossible');
assert.equal(inferIVs([1,90,45,30,30,40],50,'Hardy',[1],record.evs)[0].unidentifiable,true);
console.log('v0.6 navigation, game index, hero, localization and sort tests passed');
