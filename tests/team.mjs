import {strict as assert} from 'node:assert';
import {configureUniverse,fullPool,speciesLegal,itemLegal,setsFor,movesLegal} from '../src/team-universe.js';
import {generateSuggestions,showdownExport,championsText,spread} from '../src/team-engine.js';
import {fullRuMoveInfo,fullRuAbilityInfo,effectCoverage} from '../src/effects-ru.js';
const ids=[248,530,445,970,1000,823,959,282,6,3,1,150,1007,1008,658,130];
const names=['Tyranitar','Excadrill','Garchomp','Glimmora','Gholdengo','Corviknight','Tinkaton','Gardevoir','Charizard','Venusaur','Bulbasaur','Mewtwo','Koraidon','Miraidon','Greninja','Gyarados'];
const types=[['rock','dark'],['ground','steel'],['dragon','ground'],['rock','poison'],['steel','ghost'],['flying','steel'],['fairy','steel'],['psychic','fairy'],['fire','flying'],['grass','poison'],['grass','poison'],['psychic'],['fighting','dragon'],['electric','dragon'],['water','dark'],['water','flying']];
const dex=ids.map((id,i)=>({id,name:names[i],ru:names[i],stats:[90,105,80,100,75,90],types:types[i],abilities:[{name:'Pressure'}],legendary:[150,1007,1008].includes(id),mythical:false}));
const noChamp=new Set(['mewtwo','koraidon','miraidon','bulbasaur']);
const rules={championsItems:['abomasite','glimmoranite','charizarditex','charizarditey'],champions:{},tiers:{}};
for (const p of dex){const k=p.name.toLowerCase();rules.tiers[k]={tier:k==='mewtwo'||k==='koraidon'||k==='miraidon'?'Uber':k==='bulbasaur'?'LC':k==='venusaur'?'UU':'OU',doublesTier:'DOU',natDexTier:'OU'};rules.champions[k]=noChamp.has(k)?{tier:'Illegal',isNonstandard:'Past'}:{tier:'OU',doublesTier:'DOU'};}
const basic=[['Protect','normal','status',null],['Earthquake','ground','physical',100],['Crunch','dark','physical',80],['Rock Slide','rock','physical',75],['Iron Head','steel','physical',80],['Shadow Ball','ghost','special',80],['Flamethrower','fire','special',90],['Thunderbolt','electric','special',90],['Surf','water','special',90],['Psychic','psychic','special',90],['Moonblast','fairy','special',95],['Sludge Bomb','poison','special',90],['Stealth Rock','rock','status',null],['Rapid Spin','normal','physical',50],['U-turn','bug','physical',70],['Recover','normal','status',null],['Tailwind','flying','status',null],['Swords Dance','normal','status',null],['Nasty Plot','dark','status',null]];
const moves=basic.map(([name,type,category,power],i)=>({id:i+1,name,type,category,power,accuracy:100,pp:15}));
const all=Object.fromEntries(moves.map(x=>[x.name.toLowerCase().replace(/[^a-z]/g,''),['9M']]));
const learnsets={main:Object.fromEntries(dex.map(p=>[p.name.toLowerCase(),{learnset:all}])),champions:Object.fromEntries(dex.filter(p=>!noChamp.has(p.name.toLowerCase())).map(p=>[p.name.toLowerCase(),Object.keys(all)]))};
configureUniverse(dex,rules,moves,learnsets);
assert.equal(fullPool('casual').length,dex.length,'every dex species available in casual');
assert.equal(fullPool('champions').length,dex.length-noChamp.size,'Champions whitelist');
assert.equal(fullPool('ou').some(x=>x.name==='Mewtwo'),false,'No Ubers in OU');
assert.equal(fullPool('uu').some(x=>x.name==='Tyranitar'),false,'No OU in UU');
assert.equal(itemLegal('Assault Vest','champions',rules),false);
assert.equal(itemLegal('Choice Band','champions',rules),false);
assert.equal(itemLegal('Focus Sash','champions',rules),true);
assert.equal(itemLegal('Sitrus Berry','champions',rules),true);
assert.equal(itemLegal('Glimmoranite','champions',rules),true);
assert.equal(itemLegal('Invented Item','champions',rules),false);
assert(setsFor(fullPool('ou')[0],'ou').length>0);
const party=generateSuggestions({format:'champions',size:6,seedIds:[970],lang:'ru'});
assert(party.length, 'Champion team should generate');
for(const team of party){
 assert.equal(team.roster.length,6);
 assert.equal(new Set(team.roster.map(x=>x.entry.id)).size,6);
 assert.equal(new Set(team.roster.map(x=>x.set.item).filter(Boolean)).size,team.roster.filter(x=>x.set.item).length,'item clause');
 assert(team.roster.every(x=>!x.entry.legendary));
 for(const {entry,set} of team.roster){assert(itemLegal(set.item,'champions',rules));assert(movesLegal(set,entry,'champions',{learnsets}));assert.equal(set.moves.length,4);}
}
assert.equal(showdownExport(party[0].roster,'champions'),'');
assert(championsText(party[0].roster).includes('Stat Points'));
assert.equal(Object.values(spread('spa',true)).reduce((a,b)=>a+b,0),66);
const singles=generateSuggestions({format:'ou',size:6,seedIds:[248,530]});
assert(singles.length&&singles[0].roster.length===6);
assert(singles[0].roster[0].entry.id===248&&singles[0].roster[1].entry.id===530);
assert(showdownExport(singles[0].roster,'ou').includes('EVs: '));
assert(fullRuMoveInfo({slug:'earthquake'}).text.includes('урон'));
assert(fullRuAbilityInfo('sand-stream').text.includes('песчаную'));
console.log('v0.4: format filtering, learnsets, items, synergies and translations passed',effectCoverage());
