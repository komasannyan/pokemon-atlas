// Team builder regression tests.
import './team.mjs'; // Initializes a verified 16-species mock universe and runs the preexisting suite.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {generateSuggestions, multiplier, teamCoverage, showdownExport} from '../src/team/team-engine.js';
import {itemLegal, movesLegal, getUniverse, configureUniverse, fullPool, setsFor, normalizeSelection} from '../src/team/team-universe.js';

assert.equal(multiplier('fire',['grass','poison'],'Thick Fat'),1,'Thick Fat must halve final type effectiveness');
assert.equal(multiplier('fire',['grass','steel'],'Thick Fat'),2,'dual-type weakness must be preserved');
assert.equal(multiplier('ice',['grass'],'Thick Fat'),1);
assert.equal(multiplier('fire',['grass'],'Dry Skin'),2.5,'Dry Skin increases Fire damage');
assert.equal(multiplier('ground',['electric'],'Levitate'),0);
assert.equal(multiplier('electric',['water'],'Lightning Rod'),0);
assert.equal(multiplier('water',['ground'],'Storm Drain'),0);
assert.equal(multiplier('steel',['fairy','rock']),4);

const u=getUniverse();
assert.ok(u,'team universe should be initialized by original test');
// A format change must reset a role that is no longer offered. Otherwise the
// select displays Auto while generation silently filters out every legal set.
const restored=normalizeSelection(['445',445,248,'bad',99999],{445:'mega',248:'physical'},'ou');
assert.deepEqual(restored.seeds,[445,248],'restore unique, available numeric species IDs');
assert.deepEqual(restored.roles,{445:'auto',248:'physical'});
assert.ok(generateSuggestions({format:'ou',seedIds:restored.seeds,roles:restored.seeds.map(id=>restored.roles[id])}).length);
assert.deepEqual(normalizeSelection(null,null,'ou'),{seeds:[],roles:{}});

// Curated sets replace unavailable moves from the live learnset. A replacement
// for an Assault Vest user must remain usable with the held item.
try{
 const swampert={id:260,name:'Swampert',types:['water','ground'],stats:[100,110,90,85,90,60],abilities:[{name:'Torrent'}]};
 configureUniverse([...u.dex,swampert],{...u.rules,tiers:{...u.rules.tiers,swampert:{tier:'UU',natDexTier:'UU',doublesTier:'DOU'}}},u.moves,{...u.learnsets,main:{...u.learnsets.main,swampert:u.learnsets.main.tyranitar}});
 const entry=fullPool('uu').find(p=>p.id===260);
 const vest=setsFor(entry,'uu').find(set=>set.item==='Assault Vest');
 assert.ok(vest,'keep the curated Assault Vest set when four damaging moves are available');
 assert.equal(vest.moves.length,4);
 assert.ok(vest.moves.every(name=>u.moves.find(move=>move.name===name)?.category!=='status'),'Assault Vest fallback must exclude Protect / Recover');
}finally{configureUniverse(u.dex,u.rules,u.moves,u.learnsets);}
const commonWeakness=[248,970,1000]; // Tyranitar + Glimmora + Gholdengo all weak to Ground.
const teams=generateSuggestions({format:'ou',seedIds:commonWeakness,size:6,lang:'ru'});
assert.ok(teams.length>0,'do not reject 3 explicitly selected Pokémon with a shared weakness');
for(const team of teams){
 assert.equal(team.roster.length,6);
 assert.deepEqual(team.roster.slice(0,3).map(p=>p.entry.id),commonWeakness);
 assert.equal(new Set(team.roster.map(p=>p.entry.id)).size,6);
 assert.ok(Number.isFinite(team.score));
 assert.ok(team.roster.every(p=>p.why.length>0));
 assert.ok(showdownExport(team.roster,'ou').includes('EVs: '));
 for(const {entry,set} of team.roster)assert.ok(movesLegal(set,entry,'ou',u),'all chosen moves must be known legal');
}
const defenders=teamCoverage(teams[0].roster);
assert.equal(defenders.length,18);
assert.ok(defenders.every(x=>Number.isInteger(x.weak)&&Number.isInteger(x.resist)));

// Full three-slot selection must also respect Champions item restrictions.
const doubles=generateSuggestions({format:'champions',seedIds:[970,959,823],size:6,lang:'en'});
assert.ok(doubles.length,'Champions 3-seed selection should generate a team');
for(const team of doubles){
 assert.deepEqual(team.roster.slice(0,3).map(p=>p.entry.id),[970,959,823]);
 assert.equal(new Set(team.roster.map(p=>p.set.item).filter(Boolean)).size,
              team.roster.filter(p=>p.set.item).length,'Champions item clause');
 for(const {entry,set} of team.roster){
  assert.ok(itemLegal(set.item,'champions',u.rules));
  assert.ok(movesLegal(set,entry,'champions',u));
 }
}
assert.throws(()=>generateSuggestions({format:'ou',seedIds:[248,530,970,1000]}),/zero to three/i);
const ui=readFileSync(new URL('../src/team/team-ui.js',import.meta.url),'utf8');
assert.match(ui,/atlas-team-builder-v03/,'persist existing team selection storage key');
assert.match(ui,/seeds\.length<3/,'UI must let third Pokémon be selected');
assert.match(ui,/seeds\.length>=3/,'UI must stop at three');
assert.match(ui,/slice\(0,3\)/,'three saved selections must be retained');
assert.match(ui,/state\.seeds\.length}\/3/,'UI shows correct selection count');
assert.match(ui,/scoreWarning/,'format legality warnings must remain visible');
// Exercise the actual UI module with a minimal DOM and a transient rules failure.
// Recovery should retry the loader in place, without refreshing the entire app.
const listeners={};
const root={innerHTML:'',addEventListener(name,listener){listeners[name]=listener;}};
let loadAttempts=0,loaded=null;
const uiContext={
 FORMATS:{ou:{min:3,label:'OU',titleRu:'OU'}},ROLE_NAMES:{},ROLE_DESC:{},
 fullPool:()=>[],setsFor:()=>[],getUniverse:()=>loaded,
 normalizeSelection:()=>({seeds:[],roles:{}}),
 loadUniverse:async()=>{if(++loadAttempts===1)throw Error('transient failure');loaded={};},
 isEnglish:()=>false,localStorage:{getItem:()=>null,setItem(){}},
 document:{querySelector:()=>root},window:{addEventListener(){}},console:{warn(){}}
};
runInNewContext(ui.replace(/^import .*;\s*$/gm,'').replace(/^export /gm,''),uiContext);
uiContext.setupTeamBuilder(()=>Array(1001).fill({}));
await new Promise(resolve=>setImmediate(resolve));
assert.match(root.innerHTML,/data-team-retry/,'failed rules loading offers a retry');
listeners.click({target:{closest:selector=>selector==='[data-team-retry]'?{}:null}});
await new Promise(resolve=>setImmediate(resolve));
assert.equal(loadAttempts,2,'retry button starts a new loading attempt');
assert.doesNotMatch(root.innerHTML,/data-team-retry|class="loading-row"/,'successful retry removes the loading error');
console.log('Team builder: three seeds, immunities, Thick Fat, Champions clauses and UI state verified.');
