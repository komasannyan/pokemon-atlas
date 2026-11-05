import {COLLECTION_GAMES} from './collection-games.js';
import {ZA_MAIN} from './za-main-data.js';
import {ZA_SIDE} from './za-side-data.js';
import {ZA_SIDE_LOCATIONS,sideUnlock,ZA_SIDE_SPECIAL_UNLOCK} from './za-side-locations.js';
import {ZA_SIDE_STEPS} from './za-side-steps.js';
import {ZA_DLC_MAIN} from './za-dlc-data.js';
import {ZA_DLC_81} from './za-dlc-all-side.js';
import {ZA_ZONES,ZA_TIME_CONDITIONS} from './za-data.js';
import {ZA_TMS_ENRICHED} from './za-tms-enriched.js';
import {ZA_SIDE_VERIFIED} from './za-verified-catalog.js';
import {ZA_SIDE_CLARIFICATIONS} from './za-mission-clarifications.js';
import {ZA_ZONE_SPAWNS} from './za-wild-spawns.js';
import {ZA_MEGA,ZA_RESOURCES} from './za-items-data.js';
import {ZA_MAIN_STEPS,ZA_BOSS_TIPS,ZA_GLOBAL_HELP} from './za-walkthrough-details.js';
import {ZA_SIDE_DETAILED,ZA_REWARDS,ZA_EX_MISSIONS,ZA_DONUT_RECIPES} from './za-guide-extras.js';
import {isEnglish} from './i18n.js';

const KEY='pokemon-atlas-guide-progress-v1',STEP_KEY='pokemon-atlas-guide-steps-v1',GAME_KEY='pokemon-atlas-guide-game-v1';
const $=s=>document.querySelector(s);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tx=(ru,en)=>isEnglish()?en:ru;
const normalize=s=>String(s??'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ё/g,'е').replace(/[^a-zа-я0-9]+/g,'');
const num=n=>String(n).padStart(3,'0');
const namesFix={45:'On Maintenance Duty',67:'Sylveon the Soother',92:'The Beldum Blockade'};
const sideRows=ZA_SIDE.map(x=>{
 const checked=ZA_SIDE_VERIFIED[x.id-1]||{};
 const detailed=ZA_SIDE_DETAILED[x.id];
 const short=ZA_SIDE_STEPS[x.id-1]||x.steps||'';
 return {...x,kind:'side',name:checked.name||namesFix[x.id]||x.name,
  location:checked.location||ZA_SIDE_LOCATIONS[x.id-1]||x.location,
  startHint:checked.start||'',rank:checked.rank||'',
  steps:detailed?.steps||ZA_SIDE_CLARIFICATIONS[x.id]||String(short).split('|').filter(Boolean),
  reward:checked.reward||ZA_REWARDS[x.id]||x.reward||null,
  unlock:checked.mission||sideUnlock(x.id),
  extraReq:checked.unlockExtra
    ?(/20 Reward Matches/i.test(checked.unlockExtra)?'Выиграй 20 Reward Matches в Infinite Z-A Royale':checked.unlockExtra)
    :ZA_SIDE_SPECIAL_UNLOCK[x.id]||null};
});
const mainRows=ZA_MAIN.map(x=>({...x,kind:'main',steps:(ZA_MAIN_STEPS[x.id]||x.steps||'').split('|').filter(Boolean)}));
const dlcRows=[...ZA_DLC_MAIN.map(x=>({...x,kind:'dlc-main',steps:(x.steps||'').split(/(?<=\.)\s+(?=[А-ЯЁ])/).filter(Boolean)})),...ZA_DLC_81.map(x=>({...x,kind:'dlc-side',steps:ZA_SIDE_DETAILED[x.id]?.steps||(x.steps||'').split(/(?<=\.)\s+(?=[А-ЯЁ])/).filter(Boolean)}))];
const exRows=ZA_EX_MISSIONS.map(x=>({...x,kind:'extra'}));
const bossRows=ZA_BOSS_TIPS.map(x=>({...x,kind:'boss',name:'Rogue Mega '+x.pokemon,steps:[x.tactic],location:mainRows.find(m=>m.id===x.id)?.location||null}));
const zoneRows=ZA_ZONES.map(z=>({...z,id:z.n,kind:'zone',name:'Wild Zone '+z.n,unlock:z.mission,location:z.area,spawnDetails:ZA_ZONE_SPAWNS.find(x=>x.n===z.n)?.spots||[],steps:['Открывается с началом основного задания №'+z.mission+'.','Район: '+z.area+'.','Список видов и ориентиры приведены ниже.']}));
const tmRows=ZA_TMS_ENRICHED.map(x=>({...x,id:x.n,kind:'tm',name:'TM'+num(x.n)+' · '+x.name,steps:[x.location],location:x.location,reward:null}));
const itemRows=[...ZA_MEGA,...ZA_RESOURCES].map((x,i)=>({...x,id:i+1,kind:'item',name:x.name,steps:[x.location],location:x.location}));
const recipeRows=ZA_DONUT_RECIPES.map((x,i)=>({...x,id:i+1,kind:'recipe',location:'Hotel Z, кухня Ansha',steps:[tx('Приготовь пончик у Ansha после открытия соответствующего рецепта по сюжету.','Prepare the donut with Ansha after unlocking its story recipe.')] }));
const helpRows=ZA_GLOBAL_HELP.map((x,i)=>({...x,id:i+1,kind:'help',location:'',steps:x.steps}));
const ALL=[...mainRows,...sideRows,...bossRows,...zoneRows,...tmRows,...itemRows,...dlcRows,...exRows,...recipeRows,...helpRows];
const TABS=[
 ['start','Маршрут','Route'],['main','Сюжет','Story'],['side','Побочные','Side quests'],['boss','Боссы','Bosses'],
 ['zone','Wild Zones','Wild Zones'],['tm','TM · 160','TMs · 160'],['item','Предметы','Items'],
 ['dlc','Mega Dimension','Mega Dimension'],['extra','EX-задания','EX missions'],
 ['recipe','Пончики DLC','DLC donuts'],['help','Помощь','Help']
];
const state={game:'legends-za',tab:'start',query:'',filter:'all',shown:35,focus:null,completed:{},checkedSteps:{}};
let root=null,dexProvider=null,openDex=null,notice='';
try{const old=JSON.parse(localStorage.getItem(KEY)||'{}');if(old&&typeof old==='object'&&!Array.isArray(old))state.completed=old;}catch{}
try{const old=JSON.parse(localStorage.getItem(STEP_KEY)||'{}');if(old&&typeof old==='object'&&!Array.isArray(old))state.checkedSteps=old;}catch{}
try{const saved=localStorage.getItem(GAME_KEY);if(COLLECTION_GAMES.some(g=>g.key===saved))state.game=saved;}catch{}
function idOf(x){return x.kind+':'+x.id;}
function savedKey(x){const oldType=x.kind==='zone'?'zone':x.kind==='item'?'item':x.kind==='tm'?'tm':x.kind;return state.game+':'+oldType+':'+x.id;}
function done(x){return !!state.completed[savedKey(x)];}
function stepKey(x,i){return savedKey(x)+':'+i;}
function setStorage(key,data){try{localStorage.setItem(key,JSON.stringify(data));notice='';return true;}catch{notice=tx('Браузер не дал сохранить прогресс. Проверь свободное место и настройки хранения.','Unable to save progress. Check browser storage permissions and space.');return false;}}
function groupOf(x){return x.kind==='main'?'main':x.kind==='side'?'side':x.kind==='dlc-main'||x.kind==='dlc-side'?'dlc':x.kind;}
function labelOf(kind){const labels={main:['Основное задание','Main mission'],side:['Побочное задание','Side mission'],boss:['Босс','Boss'],zone:['Зона','Zone'],tm:['Техническая машина','Technical Machine'],item:['Предмет','Item'],'dlc-main':['Сюжет DLC','DLC story'],'dlc-side':['Побочное DLC','DLC side quest'],extra:['Особое задание','Extra mission'],recipe:['Рецепт','Recipe'],help:['Справка','Help']};return tx(...(labels[kind]||['Запись','Entry']));}
function tableFor(tab){
 if(tab==='main')return mainRows;
 if(tab==='side')return sideRows;
 if(tab==='boss')return bossRows;
 if(tab==='zone')return zoneRows;
 if(tab==='tm')return tmRows;
 if(tab==='item')return itemRows;
 if(tab==='dlc')return dlcRows;
 if(tab==='extra')return exRows;
 if(tab==='recipe')return recipeRows;
 if(tab==='help')return helpRows;
 if(tab==='start')return mainRows;
 return ALL;
}
function keywords(x){
 const values=[x.name,x.location,x.reward,x.extraReq,x.unlock,x.id,x.pokemon,x.types,x.weak,x.rank,x.startHint,x.region,x.recommended?.join(' '),x.area,x.for,x.steps?.join(' '),x.names?.join(' '),x.spawnDetails?.map(s=>s.name+' '+s.where+' '+s.when).join(' ')];
 return normalize(values.join(' '));
}
function filtered(){
 const q=normalize(state.query);
 const base=q?ALL:tableFor(state.tab);
 return base.filter(x=>(!q||keywords(x).includes(q))&&(state.filter==='all'||(state.filter==='pending'?!done(x):done(x))));
}
function badge(s){return '<span class="guide-tag">'+esc(s)+'</span>';}
function linksFor(x){
 const elems=[];
 if(x.kind==='main'){
  const nearby=ZA_ZONES.filter(z=>z.mission===x.id);
  if(nearby.length)elems.push('<p class="guide-related">'+tx('Открываются зоны: ','Zones unlocked: ')+nearby.map(z=>'<button type="button" data-guide-jump="zone:'+z.n+'">Wild Zone '+z.n+'</button>').join(' ')+'</p>');
  const related=sideRows.filter(s=>s.unlock===x.id);
  if(related.length)elems.push('<p class="guide-related">'+tx('Новые побочные задания: ','New side missions: ')+related.slice(0,18).map(s=>'<button type="button" data-guide-jump="side:'+s.id+'">№'+s.id+'</button>').join(' ')+(related.length>18?'…':'')+'</p>');
 }
 if(x.kind==='tm'){
   const match=x.location?.match(/задани[ея] №(\d+)/i);
   if(match)elems.push('<p class="guide-related">'+tx('Получить за задание: ','Quest reward: ')+'<button type="button" data-guide-jump="'+(x.dlc?'dlc-side':'side')+':'+match[1]+'">№'+match[1]+'</button></p>');
 }
 if(x.kind==='side'||x.kind==='dlc-side'){
   const matching=tmRows.filter(t=>t.location&&t.location.includes('№'+x.id)&&((x.kind==='dlc-side')===!!t.dlc));
   if(matching.length)elems.push('<p class="guide-related">'+tx('Связанные TM: ','Related TMs: ')+matching.map(t=>'<button type="button" data-guide-jump="tm:'+t.id+'">TM'+num(t.id)+'</button>').join(' ')+'</p>');
 }
 return elems.join('');
}
function objectiveSteps(x){
 let arr=Array.isArray(x.steps)?x.steps:[x.steps||''];
 arr=arr.filter(Boolean);
 if(x.kind==='side'||x.kind==='dlc-side'){
   // Mission-specific directions are supplied as standalone steps where checked.
   const place=x.location||'';
   return [tx('На карте найди голубой маркер побочного задания №'+x.id+' рядом с '+place+'. Если его нет — сначала выполни условия открытия.','Find the blue marker for side mission #'+x.id+' near '+place+'. If absent, check prerequisites.'),...arr,tx('После выполнения условий проверь, завершился ли квест. При необходимости поговори с заказчиком ещё раз.','Confirm the mission was completed; speak to the requester again if needed.')];
 }
 return arr;
}
function stepMarkup(x){
 const steps=objectiveSteps(x);
 if(!steps.length)return '<p class="guide-warning">'+tx('Пошаговые цели пока не установлены.','Detailed objectives not available yet.')+'</p>';
 return '<ol class="guide-steps">'+steps.map((step,i)=>'<li><label><input type="checkbox" data-guide-step="'+esc(idOf(x))+':'+i+'" '+(state.checkedSteps[stepKey(x,i)]?'checked':'')+'><span>'+esc(step)+'</span></label></li>').join('')+'</ol>';
}
function recipeMarkup(x){if(x.kind!=='recipe')return '';const r=x.requirements||{};return '<div class="guide-recipe">'+Object.entries(r).map(([k,v])=>'<span><small>'+esc(({sweet:'Sweet',sour:'Sour',spicy:'Spicy',bitter:'Bitter',fresh:'Fresh'})[k])+'</small><strong>'+v+'</strong></span>').join('')+'</div><p class="guide-muted">'+tx('Это минимальные суммы вкусов. Используй Hyper Berries с нужными значениями, превышать порог можно. Рецепт должен быть открыт по сюжету.','Minimum flavor totals. Use suitable Hyper Berries; exceeding them is fine. Recipe must be unlocked in the story.')+'</p>';}
function zoneMarkup(x){
 if(x.kind!=='zone')return '';
 const details=x.spawnDetails||[];
 const rows=details.map(sp=>{
   const name=sp.name.replace(/^Alpha /i,'');
   const isAlpha=sp.alpha;
   return '<tr><td><button type="button" data-guide-pokemon="'+esc(name)+'">'+esc(name)+'</button>'+(isAlpha?'<small class="guide-alpha">Alpha</small>':'')+'</td><td>'+esc(sp.where||'—')+'</td><td>'+esc(sp.when||'—')+'</td></tr>';
 }).join('');
 const list='<h4>'+tx('Все подтверждённые виды этой зоны','Verified species of this zone')+'</h4><div class="guide-pokemon-list">'+(x.names||[]).map(name=>'<button type="button" data-guide-pokemon="'+esc(name)+'">'+esc(name)+'</button>').join('')+'</div>';
 const spots=details.length?'<h4>'+tx('Конкретные точки появления и время','Spawn locations and times')+'</h4><div class="guide-table-scroll"><table class="guide-spawn-table"><thead><tr><th>Pokémon</th><th>'+tx('Где искать','Location')+'</th><th>'+tx('Время','Time')+'</th></tr></thead><tbody>'+rows+'</tbody></table></div>':'';
 return list+spots+'<p class="guide-muted">'+tx('Детальные точки появления указаны только для подтверждённых наблюдений; список видов шире, особенно в Wild Zone 20. Alpha-формы показаны отдельно. Шансы появления не придуманы.','Detailed spawn spots are only shown when verified. The species pool may be larger, especially in Wild Zone 20. Alpha spawns are separate; rates are not invented.')+'</p>';
}
function bossMarkup(x){
 if(x.kind!=='boss')return '';
 return '<div class="guide-boss-info"><div>'+tx('Тип босса','Boss type')+': <strong>'+esc(x.types)+'</strong></div><div>'+tx('Слабости','Weaknesses')+': <strong>'+esc(x.weak)+'</strong></div></div><h4>'+tx('Кого взять','Suggested Pokémon')+'</h4><div class="guide-pokemon-list">'+(x.recommended||[]).map(n=>'<button data-guide-pokemon="'+esc(n)+'" type="button">'+esc(n)+'</button>').join('')+'</div><p class="guide-muted">'+tx('Подбор основан на типах и практичной тактике, не гарантирует победы: в Z-A важно уклоняться самому и выбирать момент атаки.','Type-based guidance, not a guarantee: dodge manually and attack during safe windows.')+'</p>';
}
function topInfo(x){
 let a=[];
 if(x.kind==='main'||x.kind==='side')a.push(badge(tx('Основная игра','Base game')));
 if(['dlc-main','dlc-side','recipe'].includes(x.kind)||x.dlc)a.push(badge('Mega Dimension'));
 if(x.kind==='side'&&x.unlock)a.push(badge(tx('После осн. задания ','After main mission ')+x.unlock));
 if(x.kind==='side'&&x.rank&&x.rank!=='??')a.push(badge(tx('Ранг ','Rank ')+x.rank));
 if(x.kind==='zone')a.push(badge(tx('Открытие: миссия ','Unlock: main mission ')+x.mission));
 if(x.kind==='tm')a.push(badge('TM'+num(x.id)));
 if(x.kind==='tm'&&x.researchLevel)a.push(badge('Mable Research Lv. '+x.researchLevel));
 if(x.kind==='tm'&&x.cost)a.push(badge(x.cost+' Mega Shards'));
 if(x.kind==='extra')a.push(badge('Mystery Gift'));
 return a.join('');
}
function card(x){
 const key=idOf(x),highlight=state.focus===key,checked=done(x);
 return '<article class="guide-card '+(checked?'is-done ':'')+(highlight?'is-focused':'')+'" id="guide-'+esc(x.kind)+'-'+esc(x.id)+'">'+
  '<div class="guide-card-check"><input type="checkbox" data-guide-done="'+esc(key)+'" '+(checked?'checked':'')+' aria-label="'+tx('Отметить как выполненное','Mark completed')+'"></div>'+
  '<details '+(highlight?'open':'')+'><summary><span class="guide-card-heading"><small>'+esc(labelOf(x.kind))+' · '+esc(x.kind==='extra'?x.id:x.id)+'</small><strong>'+esc(x.name)+'</strong><span class="guide-card-tags">'+topInfo(x)+'</span></span><span class="guide-expand">⌄</span></summary><div class="guide-card-body">'+
  (x.location?'<div class="guide-info-line"><b>'+tx('ГДЕ ИСКАТЬ','WHERE TO GO')+'</b><p>'+esc(x.location)+'</p></div>':'')+
  (x.startHint?'<div class="guide-info-line"><b>'+tx('КАК НАЧАТЬ · NPC И ОРИЕНТИР','HOW TO START · NPC & LANDMARK')+'</b><p>'+esc(x.startHint)+'</p></div>':'')+
  (x.kind==='tm'&&x.region?'<div class="guide-info-line"><b>'+tx('ПРОВЕРЕННЫЙ РАЙОН / СПОСОБ','VERIFIED AREA / METHOD')+'</b><p>'+esc(x.region)+'</p></div>':'')+
  (x.extraReq||x.specialUnlock||x.kind==='extra'?'<div class="guide-info-line"><b>'+tx('УСЛОВИЯ','REQUIREMENTS')+'</b><p>'+esc(x.extraReq||x.specialUnlock||x.unlock||'—')+'</p></div>':'')+
  (x.kind==='main'&&x.id>1?'<div class="guide-info-line"><b>'+tx('ПЕРЕД НАЧАЛОМ','BEFORE STARTING')+'</b><p>'+tx('Заверши предыдущее сюжетное задание или обязательные параллельные цели.','Complete the previous main mission or required parallel objectives.')+'</p></div>':'')+
  ((x.kind==='recipe')?recipeMarkup(x):'')+
  (x.kind==='boss'?bossMarkup(x):'')+
  '<h4>'+tx('Что делать — по шагам','Step-by-step')+'</h4>'+stepMarkup(x)+
  (x.kind==='zone'?zoneMarkup(x):'')+
  (x.reward?'<div class="guide-info-line"><b>'+tx('НАГРАДА','REWARDS')+'</b><p>'+esc(x.reward)+'</p></div>':'')+
  (x.kind==='side'&&!x.reward?'<p class="guide-muted">'+tx('Точные награды этой миссии ещё не сверены.','Exact rewards are not yet verified for this mission.')+'</p>':'')+
  linksFor(x)+
 '</div></details></article>';
}
function pageItems(){
 const data=filtered(), shown=data.slice(0,state.shown);
 const marked=data.filter(done).length;
 return '<div class="guide-counter">'+tx('Найдено','Found')+': <b>'+data.length+'</b> · '+tx('Выполнено','Completed')+': <b>'+marked+'</b></div>'+
  (shown.length?'<div class="guide-cards">'+shown.map(card).join('')+'</div>':'<div class="guide-empty">'+tx('Ничего не найдено. Попробуй номер, название покемона, предмет или район.','Nothing found. Try a number, Pokémon, item or district.')+'</div>')+
  (data.length>state.shown?'<button type="button" class="guide-more" id="guide-more">'+tx('Показать ещё','Show more')+' ('+(data.length-state.shown)+')</button>':'');
}
function hero(){
 const counts=[['main',mainRows],['side',sideRows],['dlc',dlcRows],['tm',tmRows]];
 return '<div class="guide-dashboard">'+counts.map(([key,list])=>{
 const completed=list.filter(done).length,percent=Math.round(completed/list.length*100);
 const label={main:tx('Сюжет','Main story'),side:tx('Побочные','Side missions'),dlc:tx('Mega Dimension','Mega Dimension'),tm:'TM'};
 return '<button type="button" data-guide-tab="'+key+'" class="guide-progress-card"><small>'+label+'</small><strong>'+completed+' / '+list.length+'</strong><span class="guide-progressbar"><i style="width:'+percent+'%"></i></span></button>';
 }).join('')+'</div>';
}
function intro(){
 return '<div class="guide-hints"><strong>'+tx('Как пользоваться','How to use')+'</strong><p>'+tx('Введи название задания, покемона, TM, предмета или района: поиск работает по всем разделам Z-A. В карточках указаны проверенные условия и ориентиры, а неполные сведения отмечены.','Search a mission, Pokémon, TM, item or district across all Z-A sections. Open a card and follow each step.')+'</p></div>';
}
function render(){
 if(!root)return;
 const game=COLLECTION_GAMES.find(g=>g.key===state.game);
 const za=state.game==='legends-za';
 root.innerHTML='<div class="guide-head"><div><span class="section-kicker">ATLAS WALKTHROUGH</span><h2>'+tx('Гайды по играм','Game walkthroughs')+'</h2><p>'+tx('Прохождение, поисковик предметов и личный прогресс.','Walkthroughs, item finder and progress tracking.')+'</p></div>'+
 '<label>'+tx('ВЫБЕРИ ИГРУ','CHOOSE GAME')+'<select id="guide-game">'+COLLECTION_GAMES.map(g=>'<option value="'+esc(g.key)+'" '+(g.key===state.game?'selected':'')+'>'+esc(g.label)+'</option>').join('')+'</select></label></div>'+
 '<div class="guide-game-banner"><strong>'+esc(game?.label||'Pokémon')+'</strong><span>'+tx('Подробный путеводитель','In-depth walkthrough')+'</span></div>'+
 (za?hero()+intro()+
 '<label class="guide-global-search"><span>'+tx('ПОИСК ПО ВСЕМУ Z-A','SEARCH EVERYTHING IN Z-A')+'</span><input id="guide-query" type="search" autocomplete="off" placeholder="'+tx('Задание №106, Gible, Earthquake, Mega Stone…','Mission #106, Gible, Earthquake, Mega Stone…')+'" value="'+esc(state.query)+'"></label>'+
 '<div class="guide-tabs">'+TABS.map(([key,ru,en])=>'<button data-guide-tab="'+key+'" type="button" class="'+(state.tab===key?'active':'')+'">'+esc(tx(ru,en))+'</button>').join('')+'</div>'+
 '<div class="guide-bar"><span>'+(state.query?tx('Результаты по всем разделам','Results across all sections'):tx('Раздел: ','Section: ')+tx(...(TABS.find(x=>x[0]===state.tab)?.slice(1)||['',''])))+'</span><select id="guide-filter" aria-label="'+tx('Фильтр прогресса','Progress filter')+'"><option value="all" '+(state.filter==='all'?'selected':'')+'>'+tx('Все','All')+'</option><option value="pending" '+(state.filter==='pending'?'selected':'')+'>'+tx('Не выполнено','Not completed')+'</option><option value="done" '+(state.filter==='done'?'selected':'')+'>'+tx('Выполнено','Completed')+'</option></select></div>'+
 '<div id="guide-results">'+pageItems()+'</div>':
 '<div class="guide-empty">'+tx('Для выбранной игры пока нет полноценного проверенного гайда. Здесь не показываются задания из Legends: Z-A.','No fully verified guide for this game yet. Legends: Z-A missions are not reused here.')+'</div>')+
 '<div id="guide-notice" role="status" class="guide-message">'+esc(notice)+'</div>'+
 '<p class="guide-footer">'+tx('Галочки хранятся в этом браузере. Справочник составлен на основе игровых данных и проверенных источников; для некоторых редких находок пока нет точных координат или полного списка команд.','Checkmarks are stored in this browser. Some rare encounters lack verified precise coordinates or full opponent teams.')+'</p>';
 if(state.focus){const el=root.querySelector('#guide-'+CSSsafe(state.focus.replace(':','-')));el?.scrollIntoView?.({block:'nearest'});}
}
const CSSsafe=s=>s.replace(/[^a-zA-Z0-9-_]/g,'');
function renderResults(){
 const r=root?.querySelector('#guide-results');
 if(r){
  const open=new Set([...r.querySelectorAll('.guide-card details[open]')].map(d=>d.closest('.guide-card')?.id).filter(Boolean));
  r.innerHTML=pageItems();
  for(const id of open){const card=r.querySelector('#'+CSSsafe(id));card?.querySelector('details')?.setAttribute('open','');}
 }
 const progress=root?.querySelector('.guide-dashboard');
 if(progress)progress.outerHTML=hero();
 const title=root?.querySelector('.guide-bar span');if(title)title.textContent=state.query?tx('Поиск по всем разделам','Searching all sections'):tx('Раздел','Section');
}
function navigateTo(kind,id){
 const x=ALL.find(x=>x.kind===kind&&String(x.id)===String(id));if(!x)return;
 const tab=groupOf(x);state.tab=tab==='dlc'?'dlc':tab==='zone'?'zone':tab==='boss'?'boss':tab;
 state.query='';state.filter='all';state.focus=idOf(x);state.shown=45;
 const idx=tableFor(state.tab).findIndex(v=>idOf(v)===idOf(x));if(idx>=state.shown)state.shown=idx+1;
 render();
}
export function setupGuides({pokemonByName,onOpenPokemon}={}){
 root=document.getElementById('guides-view');
 dexProvider=pokemonByName||null;openDex=onOpenPokemon||null;
 if(!root)return;
 root.addEventListener('change',event=>{
  const el=event.target;
  if(el.id==='guide-game'){state.game=el.value;state.tab='start';state.query='';state.focus=null;state.shown=35;try{localStorage.setItem(GAME_KEY,state.game);}catch{}render();return;}
  if(el.id==='guide-filter'){state.filter=el.value;state.shown=35;state.focus=null;renderResults();return;}
  const key=el.dataset.guideDone;if(key){const row=ALL.find(x=>idOf(x)===key);if(!row)return;if(el.checked)state.completed[savedKey(row)]=true;else delete state.completed[savedKey(row)];setStorage(KEY,state.completed);el.closest('.guide-card')?.classList.toggle('is-done',el.checked);renderResults();return;}
  const step=el.dataset.guideStep;if(step){const idx=step.lastIndexOf(':'),k=step.slice(0,idx),n=+step.slice(idx+1),row=ALL.find(x=>idOf(x)===k);if(!row)return;const sk=stepKey(row,n);if(el.checked)state.checkedSteps[sk]=true;else delete state.checkedSteps[sk];setStorage(STEP_KEY,state.checkedSteps);el.closest('li')?.classList.toggle('is-done',el.checked);}
 });
 root.addEventListener('input',event=>{if(event.target.id==='guide-query'){state.query=event.target.value;state.shown=35;state.focus=null;renderResults();}});
 root.addEventListener('click',event=>{
  const tab=event.target.closest('[data-guide-tab]');if(tab){state.tab=tab.dataset.guideTab;state.query='';state.focus=null;state.shown=35;render();return;}
  const link=event.target.closest('[data-guide-jump]');if(link){const value=link.dataset.guideJump;const i=value.indexOf(':');if(i>0)navigateTo(value.slice(0,i),value.slice(i+1));return;}
  const more=event.target.closest('#guide-more');if(more){state.shown+=35;renderResults();return;}
  const mon=event.target.closest('[data-guide-pokemon]');if(mon&&dexProvider&&openDex){
   const key=normalize(mon.dataset.guidePokemon);
   const pokemon=(dexProvider()||[]).find(x=>normalize(x.name)===key);
   if(pokemon)openDex(pokemon.id);else{notice=tx('Национальный Pokédex ещё не загрузился или название формы отличается.','National Pokédex has not loaded or the form name differs.');const status=root.querySelector('#guide-notice');if(status)status.textContent=notice;}
  }
 });
 render();
}
export function refreshGuides(){if(root)render();}
export function openGuideTab(tab='start',game='legends-za'){
 state.game=COLLECTION_GAMES.some(g=>g.key===game)?game:'legends-za';
 state.tab=TABS.some(x=>x[0]===tab)?tab:'start';state.query='';state.focus=null;state.shown=35;render();
}
