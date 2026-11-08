import assert from 'node:assert/strict';
import {CORE_GAMES,recordedInVersion,recordedVersions} from '../src/pokedex/game-availability.js';
import {cleanSource} from '../src/pokedex/translate-ru.js';
import {readFileSync} from 'node:fs';
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
console.log('v0.6 navigation, game index, hero, localization and sort tests passed');
