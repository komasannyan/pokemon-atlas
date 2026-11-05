// Pokémon Atlas 0.9.2 guide consistency checks.
// Run: node tests/za-guide-092.mjs
import assert from 'node:assert/strict';
import {ZA_ZONES,zaLocations} from '../src/guides/za-data.js';
import {ZA_SIDE_VERIFIED,ZA_ZONES_VERIFIED,ZA_TMS_VERIFIED} from '../src/guides/za-verified-catalog.js';
import {ZA_ZONE_SPAWNS} from '../src/guides/za-wild-spawns.js';
import {ZA_DLC_TM_ACQUISITION} from '../src/guides/za-dlc-tm-acquisition.js';
import {ZA_TMS_ENRICHED} from '../src/guides/za-tms-enriched.js';
import {ZA_SIDE_CLARIFICATIONS} from '../src/guides/za-mission-clarifications.js';
const consecutive=(arr,key,from=1)=>arr.every((x,i)=>x[key]===i+from);
assert.equal(ZA_ZONES.length,20);
assert.ok(consecutive(ZA_ZONES,'n'));
assert.ok(consecutive(ZA_ZONES_VERIFIED,'n'));
assert.ok(ZA_ZONES.every((z,i)=>z.mission===ZA_ZONES_VERIFIED[i].mission));
assert.ok(ZA_ZONES.every((z,i)=>JSON.stringify(z.names)===JSON.stringify(ZA_ZONES_VERIFIED[i].names)));
assert.equal(ZA_ZONES[19].mission,39);
assert.equal(ZA_ZONES[7].mission,10);
assert.ok(ZA_ZONES[13].names.includes('Helioptile'));
assert.ok(!ZA_ZONES[13].names.includes('Heliolisk'));
assert.ok(zaLocations('Gible').some(x=>x.unlock===10));
assert.ok(zaLocations('Flabébé').some(x=>x.name==='Wild Zone 3'));
assert.equal(ZA_ZONE_SPAWNS.length,20);
assert.ok(ZA_ZONE_SPAWNS.every((z,i)=>z.n===i+1&&z.spots.length>0));
assert.equal(ZA_ZONE_SPAWNS.reduce((n,z)=>n+z.spots.length,0),179);
assert.ok(ZA_ZONE_SPAWNS[1].spots.some(x=>x.name==='Staryu'&&x.when==='Night'));
assert.equal(ZA_SIDE_VERIFIED.length,119);
assert.ok(consecutive(ZA_SIDE_VERIFIED,'id'));
assert.ok(ZA_SIDE_VERIFIED.filter(x=>x.start).length>=118);
assert.equal(ZA_SIDE_VERIFIED[118].mission,39);
assert.ok(ZA_SIDE_VERIFIED[118].unlockExtra.includes('20 Reward Matches'));
assert.ok(Object.keys(ZA_SIDE_CLARIFICATIONS).length>=35);
assert.equal(ZA_TMS_VERIFIED.length,160);
assert.ok(consecutive(ZA_TMS_VERIFIED,'n'));
assert.equal(ZA_DLC_TM_ACQUISITION.length,53);
assert.ok(consecutive(ZA_DLC_TM_ACQUISITION,'n',108));
assert.equal(ZA_TMS_ENRICHED.length,160);
assert.ok(consecutive(ZA_TMS_ENRICHED,'n'));
assert.ok(ZA_TMS_ENRICHED.every((x,i)=>x.name===ZA_TMS_VERIFIED[i].name));
assert.equal(ZA_TMS_ENRICHED[129].side,173); // TM130 Charge Beam
assert.equal(ZA_TMS_ENRICHED[138].side,134); // TM139 Swagger
assert.equal(ZA_TMS_ENRICHED[141].cost,540); // TM142 First Impression
assert.equal(ZA_TMS_ENRICHED[149].cost,360); // TM150 Vacuum Wave
assert.equal(ZA_TMS_ENRICHED[157].side,186); // TM158 Blast Burn
console.log('Pokémon Atlas 0.9.2: verified ZA guides, TMs and zones OK');
