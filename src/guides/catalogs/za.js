// Assemble verified records and legacy fallbacks without browser or language state.
import {ZA_MAIN} from '../data/za/main-data.js';
import {ZA_SIDE} from '../data/za/side-data.js';
import {ZA_SIDE_LOCATIONS,sideUnlock,ZA_SIDE_SPECIAL_UNLOCK} from '../data/za/side-locations.js';
import {ZA_SIDE_STEPS} from '../data/za/side-steps.js';
import {ZA_DLC_MAIN} from '../data/za/dlc-data.js';
import {ZA_DLC_81} from '../data/za/dlc-all-side.js';
import {ZA_ZONES} from '../data/za/world.js';
import {ZA_TMS_ENRICHED} from '../data/za/tms-enriched.js';
import {ZA_SIDE_VERIFIED} from '../data/za/verified-catalog.js';
import {ZA_SIDE_CLARIFICATIONS} from '../data/za/mission-clarifications.js';
import {ZA_ZONE_SPAWNS} from '../data/za/wild-spawns.js';
import {ZA_MEGA,ZA_RESOURCES} from '../data/za/items-data.js';
import {ZA_MAIN_STEPS,ZA_BOSS_TIPS,ZA_GLOBAL_HELP} from '../data/za/walkthrough-details.js';
import {ZA_SIDE_DETAILED,ZA_REWARDS,ZA_EX_MISSIONS,ZA_DONUT_RECIPES} from '../data/za/extras.js';
import {ZA_DLC_DEEP,ZA_DLC_UNLOCKS,ZA_DLC_STORY_DEEP,ZA_FAQ_EXTENDED,ZA_COMPLETION_ROUTE} from '../data/za/dlc-handbook.js';
import {ZA_BASE_DEEP} from '../data/za/base-handbook.js';
import {ZA_MAIN_HANDBOOK} from '../data/za/main-handbook.js';
import {ZA_SIDE_HANDBOOK} from '../data/za/side-handbook.js';
import {ZA_PRACTICAL_GUIDE} from '../data/za/practical-guide.js';
const num=n=>String(n).padStart(3,'0');
const namesFix={45:'On Maintenance Duty',67:'Sylveon the Soother',92:'The Beldum Blockade'};
const sideRows=ZA_SIDE.map(x=>{
 const checked=ZA_SIDE_VERIFIED[x.id-1]||{};
 const handbook=ZA_SIDE_HANDBOOK[x.id];
 const detailed=ZA_SIDE_DETAILED[x.id];
 const short=ZA_SIDE_STEPS[x.id-1]||x.steps||'';
 return {...x,...handbook,kind:'side',name:checked.name||namesFix[x.id]||x.name,
  location:handbook?.location||checked.location||ZA_SIDE_LOCATIONS[x.id-1]||x.location,
  startHint:handbook?.startHint||checked.start||'',rank:handbook?.rank||checked.rank||'',
  steps:handbook?.steps||detailed?.steps||ZA_SIDE_CLARIFICATIONS[x.id]||ZA_BASE_DEEP[x.id]||String(short).split('|').filter(Boolean),
  reward:handbook?.reward||checked.reward||ZA_REWARDS[x.id]||x.reward||null,
  unlock:handbook?.unlockMain??checked.mission??sideUnlock(x.id),
  extraReq:handbook?.unlockExtra
    ||(checked.unlockExtra
    ?(/20 Reward Matches/i.test(checked.unlockExtra)?'Выиграй 20 Reward Matches в Infinite Z-A Royale':checked.unlockExtra)
    :ZA_SIDE_SPECIAL_UNLOCK[x.id]||null)};
});
const mainRows=ZA_MAIN.map(x=>{
 const checked=ZA_MAIN_HANDBOOK[x.id];
 return {...x,...checked,kind:'main',steps:checked?.steps||(ZA_MAIN_STEPS[x.id]||x.steps||'').split('|').filter(Boolean)};
});
const dlcRows=[...ZA_DLC_MAIN.map(x=>({...x,kind:'dlc-main',steps:ZA_DLC_STORY_DEEP[x.id]||(x.steps||'').split(/(?<=\.)\s+(?=[А-ЯЁ])/).filter(Boolean)})),...ZA_DLC_81.map(x=>({...x,kind:'dlc-side',extraReq:ZA_DLC_UNLOCKS[x.id]||null,steps:ZA_DLC_DEEP[x.id]||ZA_SIDE_DETAILED[x.id]?.steps||(x.steps||'').split(/(?<=\.)\s+(?=[А-ЯЁ])/).filter(Boolean)}))];
const exRows=ZA_EX_MISSIONS.map(x=>({...x,kind:'extra'}));
const bossRows=ZA_BOSS_TIPS.map(x=>({...x,kind:'boss',name:'Rogue Mega '+x.pokemon,steps:[x.tactic],location:mainRows.find(m=>m.id===x.id)?.location||null}));
const zoneRows=ZA_ZONES.map(z=>({...z,id:z.n,kind:'zone',name:'Wild Zone '+z.n,unlock:z.mission,location:z.area,spawnDetails:ZA_ZONE_SPAWNS.find(x=>x.n===z.n)?.spots||[],steps:['Открывается с началом основного задания №'+z.mission+'.','Район: '+z.area+'.','Список видов и ориентиры приведены ниже.']}));
const tmRows=ZA_TMS_ENRICHED.map(x=>{
 const match=x.location?.match(/побочн\S*\s+задани\S*\s*[№#]?\s*(\d+)/i);
 const side=x.side??(match?Number(match[1]):null);
 return {...x,...(side?{side,method:'quest'}:{}),id:x.n,kind:'tm',name:'TM'+num(x.n)+' · '+x.name,steps:[x.location],location:x.location,reward:null};
});
const itemRows=[...ZA_MEGA,...ZA_RESOURCES].map((x,i)=>({...x,id:i+1,kind:'item',name:x.name,steps:[x.location],location:x.location}));
const recipeRows=ZA_DONUT_RECIPES.map((x,i)=>({...x,id:i+1,kind:'recipe',location:'Hotel Z, кухня Ansha',steps:[{ru:'Приготовь пончик у Ansha после открытия соответствующего рецепта по сюжету.',en:'Prepare the donut with Ansha after unlocking its story recipe.'}] }));
const routeRows=ZA_COMPLETION_ROUTE.map(x=>({...x,kind:'route'}));
const helpRows=[...ZA_GLOBAL_HELP.map((x,i)=>({...x,id:i+1,guideTopic:x.id,kind:'help',location:'',steps:x.steps})),...ZA_FAQ_EXTENDED.map(x=>({...x,id:'faq-'+x.id,guideTopic:x.id,kind:'help',location:'',steps:x.steps,source:'https://www.serebii.net/legendsz-a/sidemissions.shtml'}))];
helpRows.push(...ZA_PRACTICAL_GUIDE);
const ALL=[...routeRows,...mainRows,...sideRows,...bossRows,...zoneRows,...tmRows,...itemRows,...dlcRows,...exRows,...recipeRows,...helpRows];
const TABS=[
 ['start','Маршрут','Route'],['main','Сюжет','Story'],['side','Побочные','Side quests'],['boss','Боссы','Bosses'],
 ['zone','Wild Zones','Wild Zones'],['tm','TM · 160','TMs · 160'],['item','Предметы','Items'],
 ['dlc','Mega Dimension','Mega Dimension'],['extra','EX-задания','EX missions'],
 ['recipe','Пончики DLC','DLC donuts'],['help','Помощь','Help']
];
export const ZA_SECTIONS={start:[...routeRows,...mainRows],main:mainRows,side:sideRows,boss:bossRows,zone:zoneRows,tm:tmRows,item:itemRows,dlc:dlcRows,extra:exRows,recipe:recipeRows,help:helpRows};
export {ALL as ZA_GUIDE,TABS as ZA_TABS,mainRows,sideRows,dlcRows,tmRows,helpRows,ZA_ZONES,ZA_PRACTICAL_GUIDE};
