import {ZA_TMS_FULL} from './tms-complete.js';
import {ZA_TMS_VERIFIED} from './verified-catalog.js';
import {ZA_DLC_TM_ACQUISITION} from './dlc-tm-acquisition.js';

// The original detailed landmarks are retained for base-game TMs, while the
// DLC reward/shop methods and exact prices use independently checked records.
// Sources: https://www.serebii.net/legendsz-a/tm.shtml
//          https://www.psypokes.com/plza/mdtm.php
export const ZA_TMS_ENRICHED=ZA_TMS_FULL.map(item=>{
  const canonical=ZA_TMS_VERIFIED[item.n-1];
  if(!canonical||canonical.n!==item.n)throw Error('Missing verified TM '+item.n);
  const dlc=ZA_DLC_TM_ACQUISITION[item.n-108];
  if(!dlc)return {...item,name:canonical.name,region:canonical.region,checked:true};
  const location=dlc.method==='shop'
    ?'Торговец TM в Vert Sector 7 (возле Wild Zone 17) · '+dlc.cost+' Mega Shards'
    : 'Награда за побочное задание №'+dlc.side+
      (item.n===158?' (испытание Fire)':item.n===159?' (испытание Water)':item.n===160?' (испытание Grass)':'');
  return {...item,name:canonical.name,region:canonical.region,
    location,method:dlc.method,side:dlc.side,cost:dlc.cost,checked:true};
});
