import {COLLECTION_GAMES} from '../collection/collection-games.js';
import {isEnglish} from '../i18n.js';
import {ZA_GUIDE as ALL,ZA_TABS as TABS,ZA_SECTIONS,mainRows,sideRows,dlcRows,tmRows,helpRows,ZA_ZONES,ZA_PRACTICAL_GUIDE} from './catalogs/za.js';
import {SV_GUIDE,SV_TABS} from './catalogs/sv.js';
import {readProgress,updateProgress} from './guide-progress.js';

const KEY='pokemon-atlas-guide-progress-v1',STEP_KEY='pokemon-atlas-guide-steps-v1',GAME_KEY='pokemon-atlas-guide-game-v1';
const $=s=>document.querySelector(s);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tx=(ru,en)=>isEnglish()?en:ru;
const normalize=s=>String(s??'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ё/g,'е').replace(/[^a-zа-я0-9]+/g,'');
const num=n=>String(n).padStart(3,'0');
const GUIDE_GAMES=COLLECTION_GAMES.filter(game=>['legends-za','scarlet','violet'].includes(game.key));
const state={game:'legends-za',tab:'start',query:'',filter:'all',shown:35,focus:null,completed:{},checkedSteps:{}};
let root=null,dexProvider=null,openDex=null,notice='';
const isZA=()=>state.game==='legends-za';
const isSV=()=>['scarlet','violet'].includes(state.game);
const activeRows=()=>isZA()?ALL:isSV()?SV_GUIDE:[];
const activeTabs=()=>isSV()?SV_TABS:TABS;
const entryName=x=>tx(x.name,x.nameEn||x.name);
try{state.completed=readProgress(localStorage,KEY);}catch{}
try{state.checkedSteps=readProgress(localStorage,STEP_KEY);}catch{}
try{const saved=localStorage.getItem(GAME_KEY);if(COLLECTION_GAMES.some(g=>g.key===saved))state.game=saved;}catch{}
function idOf(x){return x.kind+':'+x.id;}
function savedKey(x){const oldType=x.kind==='zone'?'zone':x.kind==='item'?'item':x.kind==='tm'?'tm':x.kind;return state.game+':'+oldType+':'+x.id;}
function done(x){return !!state.completed[savedKey(x)];}
function stepDigest(s){
 let h=2166136261;
 for(const ch of String(s??'')){h=Math.imul(h^ch.charCodeAt(0),16777619);}
 return (h>>>0).toString(36);
}
function stepKey(x,i){
 const step=x.steps?.[i];
 if(isSV())return savedKey(x)+':content:'+stepDigest((step?.id||i)+':'+(step?.ru||step));
 if(x.kind==='help'&&step?.id)return savedKey(x)+':content:'+stepDigest(step.id+':'+step.ru);
 if(x.kind==='main'&&step?.id)return savedKey(x)+':v2:'+step.id;
 if(x.kind==='side'&&step?.id)return savedKey(x)+':v3:'+step.id+':'+stepDigest(step.ru);
 if(x.kind==='dlc-side')return savedKey(x)+':content:'+stepDigest(objectiveSteps(x)[i]);
 return savedKey(x)+':'+i;
}
function hasLegacyStepMarks(x){
 if(x.kind!=='main'&&x.kind!=='side'&&x.kind!=='dlc-side')return false;
 const prefix=savedKey(x)+':';
 return Object.keys(state.checkedSteps).some(key=>key.startsWith(prefix)&&( /^\d+$/.test(key.slice(prefix.length)) || (x.kind==='side'&&key.startsWith(prefix+'v2:'))));
}
function setProgress(key,entry,checked){
 let saved=false;
 try{state[key===KEY?'completed':'checkedSteps']=updateProgress(localStorage,key,entry,checked);notice='';saved=true;}
 catch{notice=tx('Браузер не дал сохранить прогресс. Проверь свободное место и настройки хранения.','Unable to save progress. Check browser storage permissions and space.');}
 const status=root?.querySelector('#guide-notice');if(status)status.textContent=notice;
 return saved;
}
function groupOf(x){return x.kind==='main'?'main':x.kind==='side'?'side':x.kind==='dlc-main'||x.kind==='dlc-side'?'dlc':x.kind;}
const KIND_LABELS={route:['Этап маршрута','Completion route'],main:['Основное задание','Main mission'],side:['Побочное задание','Side mission'],boss:['Босс','Boss'],zone:['Зона','Zone'],tm:['Техническая машина','Technical Machine'],item:['Предмет','Item'],'dlc-main':['Сюжет DLC','DLC story'],'dlc-side':['Побочное DLC','DLC side quest'],extra:['Особое задание','Extra mission'],recipe:['Рецепт','Recipe'],help:['Справка','Help'],gym:['Арена · Victory Road','Gym · Victory Road'],titan:['Титан · Path of Legends','Titan · Path of Legends'],star:['База · Starfall Street','Base · Starfall Street'],finale:['Завершение сюжетной ветки','Story conclusion'],postgame:['После титров','Postgame']};
function labelOf(kind){return tx(...(KIND_LABELS[kind]||['Запись','Entry']));}
function tableFor(tab){
 if(isSV())return SV_GUIDE.filter(x=>x.kind===(tab==='start'?'route':tab));
 if(!isZA())return [];
 return ZA_SECTIONS[tab]||ALL;
}
function keywords(x){
 const values=[x.name,x.nameEn,x.kind,...(KIND_LABELS[x.kind]||[]),x.location,x.locationEn,x.startEn,x.quick,x.quickEn,x.prep,x.reward,x.extraReq,x.unlock,x.id,x.pokemon,x.types,x.weak,x.rank,x.startHint,x.region,x.recommended?.join(' '),x.area,x.for,x.steps?.map(s=>typeof s==='string'?s:[s.ru,s.en].filter(Boolean).join(' ')).join(' '),x.names?.join(' '),x.spawnDetails?.map(s=>s.name+' '+s.where+' '+s.when).join(' '),x.tags,x.guideTopic,x.tip,x.battle,x.unlock,x.startHint];
 return normalize(values.join(' '));
}
const searchText=new Map([...ALL,...SV_GUIDE].map(x=>[x,keywords(x)]));
function numberedQuery(raw){
 const match=raw.match(/^(.*?)\s*[№#]?\s*(\d{1,3})$/);
 if(!match)return null;
 const prefix=normalize(match[1]),number=Number(match[2]);
 const kinds={
  tm:['tm'],тм:['tm'],
  side:['side','dlc-side'],sidemission:['side','dlc-side'],sidequest:['side','dlc-side'],побочноезадание:['side','dlc-side'],побочнаямиссия:['side','dlc-side'],
  main:['main'],mainmission:['main'],mainquest:['main'],основноезадание:['main'],основнаямиссия:['main'],
  zone:['zone'],wildzone:['zone'],зона:['zone'],
  gym:['gym'],арена:['gym'],titan:['titan'],титан:['titan'],star:['star'],база:['star'],
  mission:['main','side','dlc-main','dlc-side'],quest:['main','side','dlc-main','dlc-side'],задание:['main','side','dlc-main','dlc-side'],задания:['main','side','dlc-main','dlc-side'],миссия:['main','side','dlc-main','dlc-side']
 };
 return prefix===''?{number,kinds:null}:kinds[prefix]?{number,kinds:kinds[prefix]}:null;
}
function filtered(){
 const q=normalize(state.query), raw=state.query.trim();
 if(raw&&!q)return [];
 const numbered=numberedQuery(raw),number=numbered?.number??null;
 const terms=raw.split(/\s+/).map(normalize).filter(Boolean);
 const base=raw?activeRows():tableFor(state.tab);
 const matches=base.filter(x=>{
  const searchMatch=!raw||(numbered
   ?Number(x.id)===number&&(!numbered.kinds||numbered.kinds.includes(x.kind))
   :terms.every(term=>searchText.get(x).includes(term)));
  return searchMatch&&(state.filter==='all'||(state.filter==='pending'?!done(x):done(x)));
 });
 if(!q)return matches;
 const wantsTM=/^(?:tm|тм)/i.test(raw);
 return matches.sort((a,b)=>{
  const score=x=>(wantsTM&&x.kind==='tm'?80:0)+(number!==null&&Number(x.id)===number?60:0)+(normalize(x.name)===q?30:0)+(normalize(x.name).includes(q)?10:0);
  return score(b)-score(a);
 });
}
function badge(s){return '<span class="guide-tag">'+esc(s)+'</span>';}
function linksFor(x){
 const elems=[];
 if(isSV()){
  if(x.kind==='route'&&x.id==='paldea-order'){
   elems.push('<div class="guide-related"><h4>'+tx('Открыть этап маршрута','Open a route objective')+'</h4><ol class="guide-route-list">'+SV_GUIDE.filter(row=>row.order).sort((a,b)=>a.order-b.order).map(row=>'<li><button type="button" data-guide-jump="'+esc(idOf(row))+'">'+esc(entryName(row))+'</button></li>').join('')+'</ol></div>');
  }
  const links=(x.related||[]).map(([kind,id])=>{
   const ref=activeRows().find(row=>row.kind===kind&&String(row.id)===String(id));
   return ref?'<button type="button" data-guide-jump="'+esc(idOf(ref))+'">'+esc(entryName(ref))+'</button>':'';
  }).filter(Boolean);
  if(links.length)elems.push('<p class="guide-related">'+tx('Дальше по маршруту: ','Related route objectives: ')+links.join(' ')+'</p>');
  return elems.join('');
 }
 if(x.kind==='main'){
  const nearby=ZA_ZONES.filter(z=>z.mission===x.id);
  if(nearby.length)elems.push('<p class="guide-related">'+tx('Открываются зоны: ','Zones unlocked: ')+nearby.map(z=>'<button type="button" data-guide-jump="zone:'+z.n+'">Wild Zone '+z.n+'</button>').join(' ')+'</p>');
  const related=sideRows.filter(s=>s.unlock===x.id);
  if(related.length)elems.push('<p class="guide-related">'+tx('Новые побочные задания: ','New side missions: ')+related.slice(0,18).map(s=>'<button type="button" data-guide-jump="side:'+s.id+'">№'+s.id+'</button>').join(' ')+(related.length>18?'…':'')+'</p>');
 }
 if(x.kind==='tm'){
   const mission=x.side??x.location?.match(/задани[ея] №(\d+)/i)?.[1];
   if(mission)elems.push('<p class="guide-related">'+tx('Получить за задание: ','Quest reward: ')+'<button type="button" data-guide-jump="'+(x.dlc?'dlc-side':'side')+':'+mission+'">№'+mission+'</button></p>');
 }
 if(x.kind==='side'||x.kind==='dlc-side'){
   if(x.kind==='side'&&Number.isInteger(x.unlock)&&x.unlock>=1&&x.unlock<=42)
      elems.push('<p class="guide-related">'+tx('Для открытия: ','Unlocked after: ')+'<button type="button" data-guide-jump="main:'+x.unlock+'">'+tx('Основная миссия №','Main mission #')+x.unlock+'</button></p>');
   if(x.kind==='side'){
      const dependency=({31:30,32:31,118:117})[x.id];
      if(dependency)elems.push('<p class="guide-related">'+tx('Сначала выполни: ','First complete: ')+'<button type="button" data-guide-jump="side:'+dependency+'">'+tx('Побочное задание №','Side mission #')+dependency+'</button></p>');
   }
   const matching=tmRows.filter(t=>{
     const mission=t.side??t.location?.match(/побочн\S*\s+задани\S*\s+№\s*(\d+)/i)?.[1];
     return Number(mission)===x.id&&((x.kind==='dlc-side')===!!t.dlc);
   });
   if(matching.length)elems.push('<p class="guide-related">'+tx('Связанные TM: ','Related TMs: ')+matching.map(t=>'<button type="button" data-guide-jump="tm:'+t.id+'">TM'+num(t.id)+'</button>').join(' ')+'</p>');
 }
 if(x.related?.length){
  const links=x.related.map(([kind,id])=>{
   const ref=kind==='help'?helpRows.find(h=>h.guideTopic===id)?.id:id;
   const target=ALL.find(row=>row.kind===kind&&String(row.id)===String(ref));
   return target?'<button type="button" data-guide-jump="'+esc(kind+':'+ref)+'">'+esc(target.name)+'</button>':'';
  }).filter(Boolean);
  if(links.length)elems.push('<p class="guide-related">'+tx('Связанные статьи и задания: ','Related guides and missions: ')+links.join(' ')+'</p>');
 }
 if(x.kind==='main'||x.kind==='side'){
 const r=x.kind==='main'?mainRows:sideRows,buttons=[];
 if(r.some(y=>y.id===x.id-1))buttons.push('<button type="button" data-guide-jump="'+x.kind+':'+(x.id-1)+'">'+tx('← Предыдущее №','← Previous #')+(x.id-1)+'</button>');
 if(r.some(y=>y.id===x.id+1))buttons.push('<button type="button" data-guide-jump="'+x.kind+':'+(x.id+1)+'">'+tx('Следующее №','Next #')+(x.id+1)+' →</button>');
 if(buttons.length)elems.push('<p class="guide-related guide-neighbors">'+buttons.join(' ')+'</p>');
 }
 return elems.join('');
}
function objectiveSteps(x){
 let arr=Array.isArray(x.steps)?x.steps:[x.steps||''];
 arr=arr.filter(Boolean);
 if(x.kind==='side'&&!arr.some(s=>s&&typeof s==='object'&&s.id)){
   // Only old brief side quests need a generic marker hint; authored steps provide precise directions.
   const place=x.location||'';
   return [tx('Найди голубой маркер задания №'+x.id+' около '+place+'. Если маркера нет, проверь условия открытия.','Find the side-mission marker #'+x.id+' near '+place+'. If missing, check prerequisites.'),...arr];
 }
 // The DLC also includes distortion/portal quests that are not ordinary blue markers.
 // Do not prepend a universal and potentially false location hint.

 return arr;
}
function stepMarkup(x){
 const steps=objectiveSteps(x);
 if(!steps.length)return '<p class="guide-warning">'+tx('Пошаговые цели пока не установлены.','Detailed objectives not available yet.')+'</p>';
 return '<ol class="guide-steps">'+steps.map((step,i)=>{
  const body=typeof step==='string'?step:tx(step.ru,step.en||step.ru);
  return '<li><label><input type="checkbox" data-guide-step="'+esc(idOf(x))+':'+i+'" '+(state.checkedSteps[stepKey(x,i)]?'checked':'')+'><span>'+esc(body)+'</span></label></li>';
 }).join('')+'</ol>';
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
 if(isSV()){
  a.push(badge(tx('Основная игра · Paldea','Base game · Paldea')));
  if(x.order)a.push(badge(tx('Маршрут: этап ','Route: stage ')+x.order));
  if(x.level)a.push(badge(tx('Макс. уровень соперника: ','Highest opponent level: ')+x.level));
  return a.join('');
 }
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
function stepProgress(x){const steps=objectiveSteps(x);return {total:steps.length,checked:steps.filter((_,i)=>state.checkedSteps[stepKey(x,i)]).length};}
function card(x){
 const key=idOf(x),highlight=state.focus===key,checked=done(x),progress=stepProgress(x);
 return '<article class="guide-card '+(checked?'is-done ':'')+(highlight?'is-focused':'')+'" id="guide-'+esc(x.kind)+'-'+esc(x.id)+'">'+
  '<div class="guide-card-check"><input type="checkbox" data-guide-done="'+esc(key)+'" '+(checked?'checked':'')+' aria-label="'+tx('Отметить как выполненное','Mark completed')+'"></div>'+
  '<details '+(highlight?'open':'')+'><summary><span class="guide-card-heading"><small>'+esc(labelOf(x.kind))+(typeof x.id==='number'||x.kind==='extra'?' · '+esc(x.id):'')+'</small><strong>'+esc(entryName(x))+'</strong><span class="guide-card-tags">'+topInfo(x)+'<span class="guide-step-count" data-guide-count aria-label="'+tx('Выполнено шагов','Completed steps')+'">'+progress.checked+'/'+progress.total+'</span></span></span><span class="guide-expand">⌄</span></summary><div class="guide-card-body">'+
  (x.location?'<div class="guide-info-line"><b>'+tx('ГДЕ ИСКАТЬ','WHERE TO GO')+'</b><p>'+esc(tx(x.location,x.locationEn||x.location))+'</p></div>':'')+
  (x.startHint?'<div class="guide-info-line"><b>'+tx('КАК НАЧАТЬ · NPC И ОРИЕНТИР','HOW TO START · NPC & LANDMARK')+'</b><p>'+esc(tx(x.startHint,x.startEn||x.startHint))+'</p></div>':'')+
  (x.kind==='tm'&&x.region?'<div class="guide-info-line"><b>'+tx('ПРОВЕРЕННЫЙ РАЙОН / СПОСОБ','VERIFIED AREA / METHOD')+'</b><p>'+esc(x.region)+'</p></div>':'')+
  (x.extraReq||x.specialUnlock||x.kind==='extra'?'<div class="guide-info-line"><b>'+tx('УСЛОВИЯ','REQUIREMENTS')+'</b><p>'+esc(x.extraReq||x.specialUnlock||x.unlock||'—')+'</p></div>':'')+
  (x.kind==='main'&&x.unlock?'<div class="guide-info-line"><b>'+tx('УСЛОВИЕ ОТКРЫТИЯ','UNLOCK REQUIREMENT')+'</b><p>'+esc(x.unlock)+'</p></div>':'')+
  (x.kind==='side'&&x.unlock?'<div class="guide-info-line"><b>'+tx('ПОСЛЕ КАКОЙ СЮЖЕТНОЙ МИССИИ','STORY UNLOCK')+'</b><p>'+tx('Миссия №','Main mission #')+esc(x.unlock)+'</p></div>':'')+
  (x.kind==='main'&&x.id>1&&!x.unlock?'<div class="guide-info-line"><b>'+tx('ПЕРЕД НАЧАЛОМ','BEFORE STARTING')+'</b><p>'+tx('Заверши предыдущее сюжетное задание или обязательные параллельные цели.','Complete the previous main mission or required parallel objectives.')+'</p></div>':'')+
  ((x.kind==='recipe')?recipeMarkup(x):'')+
  (x.kind==='boss'?bossMarkup(x):'')+
  (x.kind==='main'&&x.battle?'<div class="guide-info-line"><b>'+tx('БОИ И ПОДГОТОВКА','BATTLES & PREPARATION')+'</b><p>'+esc(x.battle)+'</p></div>':'')+
  (x.prep?'<div class="guide-info-line guide-prep"><b>'+tx('ПОДГОТОВКА','PREPARE')+'</b><p>'+esc(tx(x.prep,x.prepEn||x.prep))+'</p></div>':'')+
  (x.quick?'<div class="guide-info-line guide-quick"><b>'+tx('КОРОТКИЙ ОТВЕТ','QUICK ANSWER')+'</b><p>'+esc(tx(x.quick,x.quickEn||x.quick))+'</p></div>':'')+
  '<h4>'+tx('Что делать — по шагам','Step-by-step')+'</h4>'+stepMarkup(x)+
  ((x.kind==='main'||x.kind==='side')&&x.tip?'<div class="guide-info-line"><b>'+tx('ЕСЛИ ЗАСТРЯЛ','IF YOU ARE STUCK')+'</b><p>'+esc(x.tip)+'</p></div>':'')+
  (hasLegacyStepMarks(x)?'<p class="guide-warning">'+tx('Шаги этого задания обновились. Старые отметки шагов сохранены в браузере, но не применяются к новым инструкциям, чтобы не отметить ошибочное действие. Отметка завершения всей миссии сохранена.','This quest checklist changed. Earlier step marks are kept in storage but not mapped to different instructions. Mission completion remains saved.')+'</p>':'')+
  ((x.kind==='main'||x.kind==='side')&&x.steps?.some(s=>typeof s==='object'&&!s.en)?'<p class="guide-muted">'+tx('Инструкции проверены по англоязычным источникам и пока доступны по-русски.','Mission walkthrough text is currently Russian-only; English translation is planned.')+'</p>':'')+
  (x.kind==='zone'?zoneMarkup(x):'')+
  (x.reward?'<div class="guide-info-line"><b>'+tx('НАГРАДА','REWARDS')+'</b><p>'+esc(x.reward)+'</p></div>':'')+
  (x.kind==='side'&&!x.reward?'<p class="guide-muted">'+tx('Точные награды этой миссии ещё не сверены.','Exact rewards are not yet verified for this mission.')+'</p>':'')+
  linksFor(x)+
  (x.sources?.length?'<p class="guide-source">'+tx('Источники: ','Sources: ')+x.sources.map((url,i)=>'<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc((url.match(/https?:\/\/([^/]+)/)||[])[1]||'Reference')+'</a>').join(' · ')+'</p>':
    x.source?'<p class="guide-source"><a href="'+esc(x.source)+'" target="_blank" rel="noopener noreferrer">'+tx('Проверить источник','Check source')+'</a></p>':'')+
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
 const counts=isSV()?['gym','titan','star','finale'].map(kind=>[kind,SV_GUIDE.filter(x=>x.kind===kind)]):[['main',mainRows],['side',sideRows],['dlc',dlcRows],['tm',tmRows]];
 return '<div class="guide-dashboard">'+counts.map(([key,list])=>{
 const completed=list.filter(done).length,percent=list.length?Math.round(completed/list.length*100):0;
 const label={main:tx('Сюжет','Main story'),side:tx('Побочные','Side missions'),dlc:tx('Mega Dimension','Mega Dimension'),tm:'TM',gym:'Victory Road',titan:'Path of Legends',star:'Starfall Street',finale:tx('Финалы веток','Story finales')}[key];
 return '<button type="button" data-guide-tab="'+key+'" class="guide-progress-card"><small>'+label+'</small><strong>'+completed+' / '+list.length+'</strong><span class="guide-progressbar"><i style="width:'+percent+'%"></i></span></button>';
 }).join('')+'</div>';
}
function intro(){
 if(isSV())return '<div class="guide-hints"><strong>'+tx('Начало гайда: основная игра','First guide section: the base game')+'</strong><p>'+tx('Начни с маршрута, затем открой нужную арену, титана или базу Team Star. Здесь собраны три сюжетные ветки, выход к The Way Home и первые задачи после титров; DLC пока не описаны. Порядок маршрута рекомендательный. Прогресс Scarlet, Violet и Z-A хранится отдельно.','Start with the route, then open a gym, Titan or Team Star base. This first section covers the three story paths, The Way Home and initial postgame tasks; DLC walkthroughs are not included yet. The route order is a recommendation. Scarlet, Violet and Z-A progress is tracked separately.')+'</p></div>';
 return '<div class="guide-hints"><strong>'+tx('Как пользоваться','How to use')+'</strong><p>'+tx('Введи название задания, его номер, покемона, предмет или свою проблему — например, «не появляется Marshadow», «999 монет» или «не открывается DLC». Открой карточку и отмечай этапы по мере прохождения.','Search a mission, number, Pokémon, item or problem (such as missing Marshadow, 999 coins or DLC unlocks). Open a card and check off steps.')+'</p><div class="guide-related">'+ZA_PRACTICAL_GUIDE.map(x=>'<button type="button" data-guide-jump="'+esc(idOf(x))+'">'+esc(entryName(x))+'</button>').join(' ')+'</div></div>';
}
function render(){
 if(!root)return;
 const game=COLLECTION_GAMES.find(g=>g.key===state.game);
 const supported=isZA()||isSV();
 root.innerHTML='<div class="guide-head"><div><span class="section-kicker">ATLAS WALKTHROUGH</span><h2>'+tx('Гайды по играм','Game walkthroughs')+'</h2><p>'+tx('Прохождение, поисковик предметов и личный прогресс.','Walkthroughs, item finder and progress tracking.')+'</p></div>'+
 '<label>'+tx('ДОСТУПНЫЕ ГАЙДЫ','AVAILABLE GUIDES')+'<select id="guide-game">'+(!supported?'<option value="'+esc(state.game)+'" selected disabled>'+esc(game?.label||state.game)+'</option>':'')+GUIDE_GAMES.map(g=>'<option value="'+esc(g.key)+'" '+(g.key===state.game?'selected':'')+'>'+esc(g.label)+'</option>').join('')+'</select></label></div>'+
 '<div class="guide-game-banner"><strong>'+esc(game?.label||'Pokémon')+'</strong><span>'+(supported?isSV()?tx('Основная игра · первый раздел','Base game · first section'):tx('Подробный путеводитель','In-depth walkthrough'):tx('Гайд пока не подготовлен','Guide not available yet'))+'</span></div>'+
 (supported?hero()+intro()+
 '<label class="guide-global-search"><span>'+(isSV()?tx('ПОИСК ПО SCARLET & VIOLET','SEARCH SCARLET & VIOLET'):tx('ПОИСК ПО ВСЕМУ Z-A','SEARCH EVERYTHING IN Z-A'))+'</span><input id="guide-query" type="search" autocomplete="off" placeholder="'+(isSV()?tx('Katy, Klawf, Team Star, Area Zero…','Katy, Klawf, Team Star, Area Zero…'):tx('Задание №106, Gible, Earthquake, Mega Stone…','Mission #106, Gible, Earthquake, Mega Stone…'))+'" value="'+esc(state.query)+'"></label>'+
 '<div class="guide-tabs">'+activeTabs().map(([key,ru,en])=>'<button data-guide-tab="'+key+'" type="button" class="'+(state.tab===key?'active':'')+'">'+esc(tx(ru,en))+'</button>').join('')+'</div>'+
 '<div class="guide-bar"><span>'+(state.query?tx('Результаты по всем разделам','Results across all sections'):tx('Раздел: ','Section: ')+tx(...(activeTabs().find(x=>x[0]===state.tab)?.slice(1)||['',''])))+'</span><select id="guide-filter" aria-label="'+tx('Фильтр прогресса','Progress filter')+'"><option value="all" '+(state.filter==='all'?'selected':'')+'>'+tx('Все','All')+'</option><option value="pending" '+(state.filter==='pending'?'selected':'')+'>'+tx('Не выполнено','Not completed')+'</option><option value="done" '+(state.filter==='done'?'selected':'')+'>'+tx('Выполнено','Completed')+'</option></select></div>'+
 '<div id="guide-results">'+pageItems()+'</div>':
 '<div class="guide-empty">'+tx('Для выбранной игры пока нет полноценного проверенного гайда. Задания других игр здесь не подставляются.','No fully verified guide for this game yet. Objectives from other games are not reused here.')+'</div>')+
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
 const x=activeRows().find(x=>x.kind===kind&&String(x.id)===String(id))||(kind==='help'?activeRows().find(x=>x.guideTopic===id):null);if(!x)return;
 const tab=groupOf(x);state.tab=tab==='route'?'start':tab;
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
  if(el.id==='guide-game'){state.game=el.value;state.tab='start';state.query='';state.filter='all';state.focus=null;state.shown=35;try{localStorage.setItem(GAME_KEY,state.game);}catch{}render();return;}
  if(el.id==='guide-filter'){state.filter=el.value;state.shown=35;state.focus=null;renderResults();return;}
  const key=el.dataset.guideDone;if(key){const row=activeRows().find(x=>idOf(x)===key);if(!row)return;if(el.checked)state.completed[savedKey(row)]=true;else delete state.completed[savedKey(row)];setProgress(KEY,savedKey(row),el.checked);el.closest('.guide-card')?.classList.toggle('is-done',el.checked);renderResults();return;}
  const step=el.dataset.guideStep;if(step){const idx=step.lastIndexOf(':'),k=step.slice(0,idx),n=+step.slice(idx+1),row=activeRows().find(x=>idOf(x)===k);if(!row||!Number.isInteger(n)||n<0||n>=objectiveSteps(row).length)return;const sk=stepKey(row,n);if(el.checked)state.checkedSteps[sk]=true;else delete state.checkedSteps[sk];setProgress(STEP_KEY,sk,el.checked);el.closest('li')?.classList.toggle('is-done',el.checked);const c=el.closest('.guide-card')?.querySelector('[data-guide-count]');if(c){const p=stepProgress(row);c.textContent=p.checked+'/'+p.total;}}
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
 state.tab=activeTabs().some(x=>x[0]===tab)?tab:'start';state.query='';state.filter='all';state.focus=null;state.shown=35;render();
}

// Other open tabs may change a different game's checklist while this one stays open.
if(typeof window!=='undefined')window.addEventListener('storage',event=>{
 if(event.key!==KEY&&event.key!==STEP_KEY&&event.key!==null)return;
 try{state.completed=readProgress(localStorage,KEY);state.checkedSteps=readProgress(localStorage,STEP_KEY);renderResults();}catch{}
});
