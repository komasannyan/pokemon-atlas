// Team builder regression tests.
import './team.mjs'; // Initializes a verified 16-species mock universe and runs the preexisting suite.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {generateSuggestions, multiplier, teamCoverage, showdownExport} from '../src/team/team-engine.js';
import {itemLegal, movesLegal, getUniverse} from '../src/team/team-universe.js';

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
console.log('Team builder: three seeds, immunities, Thick Fat, Champions clauses and UI state verified.');
