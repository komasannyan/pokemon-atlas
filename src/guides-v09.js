import {COLLECTION_GAMES} from './collection-games.js';
import {ZA_MAIN} from './za-main-data.js';
import {ZA_SIDE} from './za-side-data.js';
import {ZA_DLC_MAIN,ZA_DLC_SIDE,ZA_DLC_URLS} from './za-dlc-data.js';
import {ZA_ZONES,ZA_TMS,ZA_DATA_SOURCES} from './za-data.js';
import {ZA_MEGA,ZA_RESOURCES} from './za-items-data.js';
import {isEnglish} from './i18n.js';

const storage='pokemon-atlas-guide-progress-v1',pref='pokemon-atlas-guide-game-v1';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=(ru,en)=>isEnglish()?en:ru;
const state={game:'legends-za',tab:'main',search:'',shown:40,done:{}};
let root=null,findPokemon=null,openPokemon=null;
try{state.done=JSON.parse(localStorage.getItem(storage)||'{}')||{};if(typeof state.done!=='object'||Array.isArray(state.done))state.done={};}catch{state.done={};}
try{const x=localStorage.getItem(pref);if(COLLECTION_GAMES.some(g=>g.key===x))state.game=x;}catch{}
function key(type,id){return state.game+':'+type+':'+id;}
function complete(x){return !!state.done[key(x.type,x.id)];}
function save(){try{localStorage.setItem(storage,JSON.stringify(state.done));}catch{showMessage(text('Не удалось сохранить прогресс: хранилище браузера недоступно.','Could not save progress: browser storage unavailable.'));}}
function showMessage(s){const el=root?.querySelector('#guide-message');if(el)el.textContent=s;}
const tabs=[
 ['main','Сюжет','Story'],['side','Побочные','Side missions'],['bosses','Боссы','Bosses'],
 ['zones','Зоны','Wild zones'],['tm','TM','TMs'],['mega','Предметы','Items'],['dlc','Mega Dimension','Mega Dimension']
];
function activeRecords(){
 if(state.tab==='main')return ZA_MAIN;
 if(state.tab==='side')return ZA_SIDE;
 if(state.tab==='bosses')return ZA_MAIN.filter(x=>x.name.includes('Rogue Mega')||[14,19,24,30,35,37,40,41,42].includes(x.id));
 if(state.tab==='zones')return ZA_ZONES.map(z=>({id:z.n,type:'zone',name:'Wild Zone '+z.n,location:text('Основное задание №','Main mission #')+z.mission,steps:z.names.join(', '),source:ZA_DATA_SOURCES.zones,mission:z.mission,pokemon:z.names}));
 if(state.tab==='tm')return ZA_TMS.map(x=>({id:x.n,type:'tm',name:'TM'+String(x.n).padStart(3,'0')+' · '+x.name,location:x.location,steps:text('Место получения: ','Location: ')+x.location,source:x.source}));
 if(state.tab==='mega')return [...ZA_MEGA,...ZA_RESOURCES].map((x,i)=>({id:i+1,type:'item',name:x.name,location:x.location,steps:x.location,source:x.kind==='resource'?'https://www.powerpyx.com/pokemon-legends-z-a-all-evolution-item-locations/':'https://www.serebii.net/legendsz-a/megastones.shtml'}));
 return [...ZA_DLC_MAIN,...ZA_DLC_SIDE];
}
function sourceLink(x){
 const url=x.source||(x.type==='side'?'https://pokemondb.net/legends-z-a/missions':'https://www.serebii.net/legendsz-a/mainmissions.shtml');
 return '<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+text('Проверить подробности в источнике','Check detailed source')+'</a>';
}
function card(x){
 const marked=complete(x);
 const idText=(x.type==='side'||x.type==='main'||x.type==='dlc-side'||x.type==='dlc-main'?String(x.id).padStart(2,'0')+' · ':'');
 const missing=!x.steps;
 const zoneTags=x.pokemon?'<div class="guide-pokemon-grid">'+x.pokemon.map(name=>'<button type="button" data-guide-pokemon="'+esc(name)+'">'+esc(name)+'</button>').join('')+'</div>':'';
 const section=x.type==='main'?text('Сюжетное задание','Main mission'):x.type==='side'?text('Побочное задание','Side mission'):x.type==='dlc-main'?text('Сюжет DLC','DLC story'):x.type==='dlc-side'?text('Побочное DLC','DLC side mission'):x.type==='zone'?text('Дикая зона','Wild zone'):x.type==='tm'?'TM':text('Предмет','Item');
 return '<article class="guide-row '+(marked?'checked':'')+'"><label class="guide-tick" title="'+text('Отметить выполнение','Mark completed')+'"><input type="checkbox" data-guide-check="'+esc(x.type+':'+x.id)+'" '+(marked?'checked':'')+' aria-label="'+text('Завершено','Completed')+'"></label><details><summary><div class="guide-row-title"><small>'+esc(section)+' '+idText+'</small><strong>'+esc(x.name)+'</strong></div><span class="guide-arrow">⌄</span></summary><div class="guide-entry-content"><p><b>'+text('Где начать / найти: ','Where to start / find: ')+'</b>'+esc(x.location||text('Точная точка пока не сверена; смотри маркер задания на карте.','Exact location not yet verified; use the map quest marker.'))+'</p><p><b>'+text('Как пройти: ','How to complete: ')+'</b>'+esc(x.steps||text('Пошаговое прохождение этой миссии ещё не подтверждено. Внутриигровая карта отмечает доступное побочное задание синим значком; подробности смотри в источнике.','Detailed steps for this mission are not yet verified. Blue markers on the in-game map show available side quests; see source.'))+'</p>'+zoneTags+(x.reward?'<p><b>'+text('Награда: ','Reward: ')+'</b>'+esc(x.reward)+'</p>':'')+(x.type==='zone'?'<p class="guide-missing">'+text('Точные проценты появления по всем точкам не опубликованы. Проверь время суток и Alpha-встречи на странице зоны.','Complete spawn rates are not published. Check time of day and Alpha encounters on the zone page.')+'</p>':'')+(missing?'<p class="guide-missing">'+text('Детальная запись пока не заполнена; полное прохождение доступно во внешнем справочнике.','Detailed walkthrough pending; consult the linked source.')+'</p>':'')+sourceLink(x)+'</div></details></article>';
}
function rows(){
 const q=state.search.toLowerCase().trim();
 const all=activeRecords();
 const filtered=all.filter(x=>!q||[x.name,x.location,x.steps,x.reward,String(x.id)].some(v=>String(v||'').toLowerCase().includes(q)));
 const done=all.filter(complete).length;
 const current=filtered.slice(0,state.shown);
 return '<div class="guide-summary"><span>'+text('Найдено','Found')+': <b>'+filtered.length+'</b></span><span>'+text('Отмечено','Marked')+': <b>'+done+' / '+all.length+'</b></span></div>'+
 (state.tab==='side'?'<p class="guide-disclaimer">'+text('Все 119 побочных миссий доступны в списке; подробно проверенные шаги есть пока не у каждой. Незаполненные отмечены явно.','All 119 base-game side missions are listed; not every walkthrough has verified detailed steps yet. Missing information is clearly marked.')+'</p>':'')+
 (state.tab==='dlc'?'<p class="guide-disclaimer">'+text('DLC: 14 сюжетных миссий и проверенные дополнительные задания. Полный реестр побочных заданий DLC 120–200 ещё не заполнен; отсутствующие пункты не выдуманы.','DLC: 14 story missions and selected verified side missions. The complete DLC side-mission index 120–200 is not yet filled; entries are not fabricated.')+' <a href="'+ZA_DLC_URLS.side+'" target="_blank" rel="noopener noreferrer">'+text('Полный внешний список','External full list')+'</a></p>':'')+
 (state.tab==='tm'?'<p class="guide-disclaimer">'+text('Внесены 97 проверенных TM базовой игры. Дополнительные TM Mega Dimension и незаполненные номера будут добавлены после сверки.','97 verified base-game TM locations are included. Additional Mega Dimension TMs and missing entries need verification.')+'</p>':'')+
 (state.tab==='bosses'?'<p class="guide-disclaimer">'+text('В Legends: Z-A нет традиционных восьми гимов: основная боевая система — Z-A Royale и Rogue Mega-боссы. Тактики ориентировочные, не гарантируют лёгкую победу.','Legends: Z-A does not have eight traditional gyms: challenges center on the Z-A Royale and Rogue Mega bosses. Strategies are suggestions, not guarantees.')+'</p>':'')+
 (current.length?'<div class="guide-list">'+current.map(card).join('')+'</div>':'<div class="guide-empty">'+text('По этому запросу ничего не найдено.','No results for this search.')+'</div>')+
 (filtered.length>state.shown?'<button class="guide-more" type="button" id="guide-more">'+text('Показать ещё','Show more')+' ('+(filtered.length-state.shown)+')</button>':'');
}
function render(){
 if(!root)return;
 const game=COLLECTION_GAMES.find(x=>x.key===state.game);
 const active=state.game==='legends-za';
 root.innerHTML='<div class="guide-top"><div><div class="section-kicker">ATLAS GAME GUIDES</div><h2>'+text('Гайды по играм Pokémon','Pokémon game guides')+'</h2><p>'+text('Сюжет, задания, боссы, предметы, местонахождение и личный прогресс.','Story, missions, bosses, items, locations and your own progress.')+'</p></div><label class="guide-select">'+text('ИГРА','GAME')+'<select id="guide-game">'+COLLECTION_GAMES.map(g=>'<option value="'+esc(g.key)+'" '+(g.key===state.game?'selected':'')+'>'+esc(g.label)+'</option>').join('')+'</select></label></div>'+
 '<div class="guide-intro"><strong>'+esc(game?.label||'Pokémon')+'</strong><span>'+(active?text('Путеводитель · основная игра + Mega Dimension','Walkthrough · base game + Mega Dimension'):text('Страница подготовлена. Проверенное прохождение этой игры пока не внесено.','Page ready. This game walkthrough has not been populated yet.'))+'</span></div>'+
 (active?'<div class="guide-tabs">'+tabs.map(([key,ru,en])=>'<button type="button" data-guide-tab="'+key+'" class="'+(state.tab===key?'active':'')+'">'+esc(text(ru,en))+'</button>').join('')+'</div><label class="guide-search">'+text('Поиск по заданиям, боссам, TM и локациям','Search missions, bosses, TMs and locations')+'<input type="search" id="guide-search" autocomplete="off" placeholder="'+text('Название, номер или место…','Name, number, or location…')+'" value="'+esc(state.search)+'"></label><div id="guide-list">'+rows()+'</div>':'<div class="guide-empty">'+text('Для этой игры пока не добавлены проверенные задания. Мы не копируем сюда задания из другой версии.','No verified mission data has been added for this game. Missions from other games are not reused.')+'</div>')+
 '<div id="guide-message" role="status" class="guide-message"></div><p class="guide-footer">'+text('Галочки сохраняются в этом браузере. Гайд использует отдельные источники и не является официальным материалом Nintendo.','Checkmarks are saved in this browser. This guide uses independent sources and is not official Nintendo material.')+'</p>';
}
export function setupGuides({pokemonByName,onOpenPokemon}={}){
 root=document.getElementById('guides-view');
 findPokemon=pokemonByName;
 openPokemon=onOpenPokemon;
 if(!root)return;
 root.addEventListener('change',e=>{
  if(e.target.id==='guide-game'){state.game=e.target.value;state.search='';state.shown=40;try{localStorage.setItem(pref,state.game);}catch{}render();return;}
  if(e.target.dataset.guideCheck){const [type,id]=e.target.dataset.guideCheck.split(':');const k=key(type,id);if(e.target.checked)state.done[k]=true;else delete state.done[k];save();const row=e.target.closest('.guide-row');row?.classList.toggle('checked',e.target.checked);const sum=root.querySelector('.guide-summary');if(sum)sum.innerHTML='<span>'+text('Найдено','Found')+': <b>'+activeRecords().filter(x=>!state.search||[x.name,x.location,x.steps,x.reward,String(x.id)].some(v=>String(v||'').toLowerCase().includes(state.search.toLowerCase()))).length+'</b></span><span>'+text('Отмечено','Marked')+': <b>'+activeRecords().filter(complete).length+' / '+activeRecords().length+'</b></span>';return;}
 });
 root.addEventListener('input',e=>{if(e.target.id==='guide-search'){state.search=e.target.value;state.shown=40;const list=root.querySelector('#guide-list');if(list)list.innerHTML=rows();}});
 root.addEventListener('click',e=>{
  const tab=e.target.closest('[data-guide-tab]');if(tab){state.tab=tab.dataset.guideTab;state.search='';state.shown=40;render();return;}
  if(e.target.id==='guide-more'){state.shown+=40;const list=root.querySelector('#guide-list');if(list)list.innerHTML=rows();return;}
  const mon=e.target.closest('[data-guide-pokemon]');if(mon&&findPokemon&&openPokemon){
    const value=mon.dataset.guidePokemon.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    const p=(findPokemon()||[]).find(x=>x.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')===value);
    if(p)openPokemon(p.id);else showMessage(text('Покемон ещё не загружен в национальный Pokédex.','Pokémon is not yet loaded in the National Pokédex.'));
  }
 });
 render();
}
export function refreshGuides(){render();}
export function openGuideTab(tab='main',game='legends-za'){
 if(COLLECTION_GAMES.some(g=>g.key===game))state.game=game;
 if(tabs.some(x=>x[0]===tab))state.tab=tab;
 state.search='';state.shown=40;render();
}
