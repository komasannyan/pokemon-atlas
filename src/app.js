import {TYPE_VALUES, GENERATIONS, STAT_NAMES, GAME_GROUPS, MOVE_METHODS, artUrl, numberLabel, toTitle} from './constants.js';
import {loadCachedDex, fetchNationalDex, saveDex, getDemo} from './data.js';
import {fetchPokemon, fetchEncounters} from './api.js';

const $=selector=>document.querySelector(selector);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=s=>String(s??'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[\s\-_.'’]/g,'');
const typeLabels=Object.fromEntries(TYPE_VALUES.map(t=>t));
const typeColors={normal:'#9a9ba5',fighting:'#c34c59',flying:'#7d9ed9',poison:'#a362b8',ground:'#b98e57',rock:'#aa955e',bug:'#8da83c',ghost:'#7760b3',steel:'#6b9ba7',fire:'#e4814b',water:'#5099d2',grass:'#65aa6d',electric:'#cda838',psychic:'#d6718d',ice:'#68b8c8',dragon:'#6775c8',dark:'#746b76',fairy:'#c67cba'};
const state={dex:loadCachedDex()||getDemo(),full:!!loadCachedDex(),view:'catalog',search:'',generation:'all',selectedTypes:[],sort:'number',shown:30,detail:null,detailTab:'overview',shiny:false,style:'art',moveGame:'scarlet-violet',method:'all',encounterGame:'',lastFocus:null};
let toastTimer=null,installEvent=null;
let favorites=new Set();
try{favorites=new Set(JSON.parse(localStorage.getItem('atlas-favorites-v1')||'[]'));}catch{}

function typeTag(type){return `<span class="type-badge" style="background:${typeColors[type]||'#778'}"><span class="type-dot"></span>${esc(typeLabels[type]||toTitle(type))}</span>`;}
function comma(n){return new Intl.NumberFormat('ru-RU').format(n);}
function showToast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3200);}
function setStatus(msg,good=false){const el=$('#online-status');el.innerHTML=`<span class="status-dot"></span>${esc(msg)}`;el.className='online-status '+(good?'good':'warning');}
function setAlert(text){const el=$('#load-alert');if(text){el.hidden=false;el.textContent=text;}else el.hidden=true;}
function saveFavorites(){try{localStorage.setItem('atlas-favorites-v1',JSON.stringify([...favorites]));}catch{}updateFavoriteCount();}
function updateFavoriteCount(){$('#fav-count').textContent=favorites.size;}
function filteredDex(){
  const q=normalize(state.search);
  const out=state.dex.filter(p=>{
    if(state.view==='favorites'&&!favorites.has(p.id))return false;
    if(state.generation!=='all' && p.gen!==+state.generation)return false;
    if(state.selectedTypes.length&&!state.selectedTypes.every(t=>p.types.includes(t)))return false;
    if(q&&!([p.id,String(p.id).padStart(4,'0'),p.name,p.ru].some(s=>normalize(s).includes(q))))return false;
    return true;
  });
  if(state.sort==='number-desc')out.sort((a,b)=>b.id-a.id);
  else if(state.sort==='name')out.sort((a,b)=>a.name.localeCompare(b.name));
  else if(state.sort==='bst')out.sort((a,b)=>b.bst-a.bst||a.id-b.id);
  else out.sort((a,b)=>a.id-b.id);
  return out;
}
function renderTypes(){
  $('#type-filters').innerHTML=TYPE_VALUES.map(([key,label])=>`<button type="button" class="type-chip ${state.selectedTypes.includes(key)?'active':''}" data-type="${key}" style="--chip-color:${typeColors[key]}" aria-pressed="${state.selectedTypes.includes(key)}">${esc(label)}</button>`).join('');
}
function cardHTML(p){
  return `<article class="pokemon-card" style="--type-glow:${typeColors[p.types[0]]||'#8898a1'}40">
   <button type="button" class="card-open" data-open="${p.id}" aria-label="Открыть ${esc(p.name)}"><div class="pokemon-art"><span class="card-number">${numberLabel(p.id)}</span><img alt="${esc(p.name)}" loading="lazy" decoding="async" src="${artUrl(p.id)}" onerror="this.parentNode.classList.add('image-missing')"><span class="img-fallback">◈</span></div><div class="pokemon-info"><h3>${esc(p.name)}</h3><div class="pokemon-ru">${esc(p.ru||'Русский перевод уточняется')}</div><div class="pokemon-tags">${p.types.map(typeTag).join('')}</div><div class="card-bottom"><span>GEN ${['I','II','III','IV','V','VI','VII','VIII','IX'][p.gen-1]||'—'} · ${esc(GENERATIONS[p.gen]||'')}</span><b>BST ${p.bst||'—'}</b></div></div></button>
   <button class="favorite-button ${favorites.has(p.id)?'is-favorite':''}" data-favorite="${p.id}" aria-label="${favorites.has(p.id)?'Удалить из избранного':'Добавить в избранное'} ${esc(p.name)}" aria-pressed="${favorites.has(p.id)}" title="Избранное">${favorites.has(p.id)?'♥':'♡'}</button>
  </article>`;
}
function renderCards(){
  const results=filteredDex();
  $('#matched-count').textContent=comma(results.length);
  $('#side-count').textContent=state.full?comma(state.dex.length):'Демо';
  $('#hero-total').textContent=state.full?comma(state.dex.length):'1 025';
  $('#pokemon-grid').innerHTML=results.slice(0,state.shown).map(cardHTML).join('');
  $('#empty-state').hidden=results.length!==0;
  $('#load-more').hidden=results.length<=state.shown;
  $('#load-more').textContent=`Показать ещё (${comma(results.length-state.shown)} осталось) ↓`;
}
function view(view){
  state.view=view;
  $('#catalog-view').hidden=view==='roadmap';
  $('#roadmap-view').hidden=view!=='roadmap';
  $('#hero').hidden=view!=='catalog';
  document.querySelectorAll('.nav-link').forEach(e=>e.classList.toggle('active',e.dataset.view===view));
  $('#breadcrumb-page').textContent=view==='roadmap'?'ПЛАНЫ РАЗВИТИЯ':view==='favorites'?'ИЗБРАННЫЕ ПОКЕМОНЫ':'НАЦИОНАЛЬНЫЙ ПОКЕДЕКС';
  $('#list-title').textContent=view==='favorites'?'Избранные покемоны':'Национальный Покедекс';
  $('#list-subtitle').textContent=view==='favorites'?'Твоя сохранённая коллекция':'Все поколения Pokémon в одной коллекции';
  state.shown=30;
  if(view!=='roadmap')renderCards();
  window.scrollTo({top:0,behavior:'smooth'});
}
function resetFilters(){state.search='';state.generation='all';state.selectedTypes=[];state.sort='number';state.shown=30;$('#search').value='';$('#generation').value='all';$('#sort').value='number';renderTypes();renderCards();}
function toggleFavorite(id){
  if(favorites.has(id))favorites.delete(id);else favorites.add(id);
  saveFavorites();renderCards();
  const btn=$('#detail-fav');if(btn){btn.textContent=favorites.has(id)?'♥ В избранном':'♡ В избранное';btn.classList.toggle('active',favorites.has(id));}
  showToast(favorites.has(id)?'Добавлено в избранное':'Удалено из избранного');
}
function detailTop(p){
  const extra=p.legendary?'Легендарный покемон':p.mythical?'Мифический покемон':'';
  return `<div class="detail-top"><div class="detail-visual" style="--type-glow:${typeColors[p.types[0]]||'#8a95a5'}66"><div class="detail-toolbar"><button type="button" class="detail-icon-btn ${state.shiny?'active':''}" data-shiny="true">✦ Shiny ${state.shiny?'ON':'OFF'}</button><button type="button" class="detail-icon-btn" id="detail-fav" data-favorite="${p.id}">${favorites.has(p.id)?'♥ В избранном':'♡ В избранное'}</button></div><img class="detail-art" src="${artUrl(p.id,state.shiny,state.style)}" alt="${esc(p.name)}${state.shiny?' Shiny':''}" onerror="this.style.opacity='.15'"/></div><div class="detail-head"><div class="detail-no">${numberLabel(p.id)} · GENERATION ${p.gen}</div><h2 id="detail-title">${esc(p.name)}</h2><div class="detail-ru">${esc(p.ru||'Перевод не добавлен')}</div><div class="detail-tags">${p.types.map(typeTag).join('')}</div>${extra?`<div class="detail-special">✦ ${extra}</div>`:''}<div class="detail-meta"><div class="meta-cell"><small>ПОКОЛЕНИЕ</small><b>${esc(GENERATIONS[p.gen]||'—')}</b></div><div class="meta-cell"><small>СУММА СТАТОВ</small><b>${p.bst||'—'} BST</b></div><div class="meta-cell"><small>РОСТ</small><b>${p.height!=null?p.height+' м':'—'}</b></div><div class="meta-cell"><small>ВЕС</small><b>${p.weight!=null?p.weight+' кг':'—'}</b></div></div></div><button type="button" class="detail-close" data-close="true" aria-label="Закрыть">×</button></div>
  <div class="detail-tabs"><button class="detail-tab ${state.detailTab==='overview'?'active':''}" data-tab="overview">Обзор</button><button class="detail-tab ${state.detailTab==='moves'?'active':''}" data-tab="moves">Атаки</button><button class="detail-tab ${state.detailTab==='locations'?'active':''}" data-tab="locations">Где найти</button><button class="detail-tab ${state.detailTab==='gallery'?'active':''}" data-tab="gallery">Галерея</button></div>
  <div class="detail-body" id="detail-body"></div>`;
}
function openDetail(id,updateUrl=true){
  const p=state.dex.find(x=>x.id===id);
  if(!p)return;
  state.detail=p;state.detailTab='overview';state.shiny=false;state.style='art';state.moveGame='scarlet-violet';state.method='all';state.encounterGame='';
  state.lastFocus=document.activeElement;
  $('#detail-overlay').hidden=false;document.body.style.overflow='hidden';
  renderDetail();$('.detail-dialog').focus();
  if(updateUrl){const url=new URL(window.location.href);url.searchParams.set('pokemon',id);history.pushState({},'',url);}
}
function closeDetail(updateUrl=true){
  if(!state.detail)return;
  state.detail=null;$('#detail-overlay').hidden=true;document.body.style.overflow='';
  if(updateUrl){const url=new URL(window.location.href);url.searchParams.delete('pokemon');history.replaceState({},'',url);}
  state.lastFocus?.focus?.();
}
function renderDetail(){
  if(!state.detail)return;
  $('#detail-content').innerHTML=detailTop(state.detail);
  renderTab();
}
function evolutionHTML(p){
  const family=state.dex.filter(x=>p.chainId!=null&&x.chainId===p.chainId).sort((a,b)=>a.id-b.id);
  if(!family.length)return '<p class="helper-note">Полная цепочка эволюций станет доступна после загрузки основной базы.</p>';
  return `<div class="evo-chips">${family.map(x=>`<button type="button" class="evo-link ${x.id===p.id?'current':''}" data-open="${x.id}"><img loading="lazy" src="${artUrl(x.id)}" alt="" onerror="this.style.display='none'"><span>${esc(x.name)}</span></button>`).join('')}</div><p class="helper-note">Показаны родственники по эволюционной цепочке. Условия и ветвления появятся в расширенной версии.</p>`;
}
function renderOverview(p){
  const statList=p.stats.length===6?p.stats.map((v,i)=>`<div class="stat-row"><span>${STAT_NAMES[i]}</span><b>${v}</b><div class="stat-track" role="progressbar" aria-label="${STAT_NAMES[i]}" aria-valuenow="${v}" aria-valuemin="0" aria-valuemax="255"><div class="stat-fill" style="width:${Math.max(1,Math.min(100,100*v/255))}%"></div></div></div>`).join(''):'<p class="helper-note">Нет данных о характеристиках.</p>';
  $('#detail-body').innerHTML=`<div class="two-column"><div><h3>Базовые характеристики</h3>${statList}<div class="stat-sum">Суммарный показатель <b>${p.bst||'—'}</b></div></div><div><h3>Способности</h3><div class="ability-list">${p.abilities.length?p.abilities.map(a=>`<span class="ability-pill">${esc(a.name)}${a.hidden?'<small>HIDDEN</small>':''}</span>`).join(''):'<span class="helper-note">Нет данных о способностях.</span>'}</div><h3 style="margin-top:29px">Эволюционная семья</h3>${evolutionHTML(p)}<p class="helper-note">Типы, способности и характеристики относятся к базовой актуальной форме. Изменения между поколениями добавим отдельно.</p></div></div>`;
}
function renderTab(){
  const p=state.detail;if(!p)return;
  document.querySelectorAll('.detail-tab').forEach(e=>e.classList.toggle('active',e.dataset.tab===state.detailTab));
  if(state.detailTab==='overview')renderOverview(p);
  if(state.detailTab==='moves')renderMoves(p);
  if(state.detailTab==='locations')renderLocations(p);
  if(state.detailTab==='gallery')renderGallery(p);
}
function currentDetailIs(id,tab){return state.detail?.id===id&&state.detailTab===tab;}
async function renderMoves(p){
  $('#detail-body').innerHTML='<div class="loading-detail">Загружаем наборы атак из PokéAPI…</div>';
  try{
    const data=await fetchPokemon(p.pokemonId||p.id);
    if(!currentDetailIs(p.id,'moves'))return;
    const gameSet=new Set(data.moves.flatMap(m=>m.version_group_details.map(d=>d.version_group.name)));
    const groups=Object.keys(GAME_GROUPS).filter(g=>gameSet.has(g));
    if(!groups.length){$('#detail-body').innerHTML='<p class="helper-note">Для этого покемона база пока не содержит сведений об атаках.</p>';return;}
    if(!groups.includes(state.moveGame))state.moveGame=groups[groups.length-1];
    const selected=state.moveGame;
    const entries=data.moves.flatMap(m=>m.version_group_details.filter(d=>d.version_group.name===selected).map(d=>({name:toTitle(m.move.name),level:d.level_learned_at,method:d.move_learn_method.name})));
    const filtered=entries.filter(e=>state.method==='all'||e.method===state.method).sort((a,b)=>{
      const order=m=>({'level-up':0,'machine':1,'egg':2,'tutor':3}[m]??4);
      return order(a.method)-order(b.method)||a.level-b.level||a.name.localeCompare(b.name);
    });
    $('#detail-body').innerHTML=`<h3>Изучаемые атаки <span style="color:#7f92ac;font-weight:500">· ${filtered.length} записей</span></h3><div class="controls-line"><label>Игра: <select id="move-game">${groups.map(g=>`<option value="${g}" ${g===selected?'selected':''}>${esc(GAME_GROUPS[g])}</option>`).join('')}</select></label><label>Способ: <select id="move-method">${Object.entries({'all':'Все способы',...MOVE_METHODS}).map(([key,name])=>`<option value="${key}" ${state.method===key?'selected':''}>${esc(name)}</option>`).join('')}</select></label></div><div class="moves-list">${filtered.map(e=>`<div class="move-item"><span>${esc(e.name)}</span><small>${esc(MOVE_METHODS[e.method]||toTitle(e.method))}${e.method==='level-up'?' · Lv. '+e.level:''}</small></div>`).join('')||'<p class="helper-note">По выбранным условиям атак не найдено.</p>'}</div><p class="helper-note">Исторические наборы атак берутся из PokéAPI. Это не проверка легальности команды в конкретном формате, а список способов изучения по группам версий.</p>`;
  }catch(err){if(currentDetailIs(p.id,'moves'))$('#detail-body').innerHTML=`<p class="error-detail">Не удалось загрузить атаки. Проверь соединение и попробуй открыть вкладку снова. (${esc(err.message)})</p>`;}
}
async function renderLocations(p){
  $('#detail-body').innerHTML='<div class="loading-detail">Проверяем известные места встреч…</div>';
  try{
    const entries=await fetchEncounters(p.pokemonId||p.id);
    if(!currentDetailIs(p.id,'locations'))return;
    const gameSet=new Set(entries.flatMap(e=>e.version_details.map(d=>d.version.name)));
    const games=[...gameSet].sort();
    if(!games.length){$('#detail-body').innerHTML='<p class="helper-note">В PokéAPI нет записей о диких встречах с этим покемоном. Это не означает, что получить его невозможно: могут существовать эволюция, обмен, подарки, события и другие способы.</p>';return;}
    if(!games.includes(state.encounterGame))state.encounterGame=games[games.length-1];
    const game=state.encounterGame;
    const filtered=entries.flatMap(e=>e.version_details.filter(d=>d.version.name===game).map(d=>{
      const all=d.encounter_details||[];
      return {name:e.location_area.name,methods:[...new Set(all.map(x=>x.method.name))],min:all.length?Math.min(...all.map(x=>x.min_level)):null,max:all.length?Math.max(...all.map(x=>x.max_level)):null,chance:d.max_chance};
    }));
    $('#detail-body').innerHTML=`<h3>Места встреч <span style="color:#7f92ac;font-weight:500">· ${filtered.length}</span></h3><div class="controls-line"><label>Игра: <select id="encounter-game">${games.map(g=>`<option value="${esc(g)}" ${g===game?'selected':''}>${esc(toTitle(g))}</option>`).join('')}</select></label></div><div>${filtered.map(e=>`<div class="location-item"><strong>${esc(toTitle(e.name))}</strong><span>Уровень ${e.min===e.max?e.min:e.min+'–'+e.max} · ${esc(e.methods.map(toTitle).join(', ')||'Способ не указан')} · Макс. шанс в базе: ${e.chance}%</span></div>`).join('')||'<p class="helper-note">В этой игре встреч не найдено.</p>'}</div><p class="helper-note">Только дикие встречи из PokéAPI. Данные не включают гарантированно все обмены, яйца, подарки, рейды, DLC или сюжетные способы получения. Проценты зависят от условий встречи.</p>`;
  }catch(err){if(currentDetailIs(p.id,'locations'))$('#detail-body').innerHTML=`<p class="error-detail">Не удалось загрузить места встреч. Проверь соединение. (${esc(err.message)})</p>`;}
}
function renderGallery(p){
  const variants=[['Официальный арт',false,'art'],['Shiny-арт',true,'art'],['HOME',false,'home'],['HOME Shiny',true,'home'],['Пиксельный спрайт',false,'pixel'],['Shiny-спрайт',true,'pixel']];
  $('#detail-body').innerHTML=`<h3>Изображения и спрайты</h3><p class="helper-note">Изображения могут отсутствовать у некоторых покемонов и форм. HOME — готовые изображения, не интерактивные 3D-модели.</p><div class="gallery-grid">${variants.map(([label,shiny,style])=>`<div class="gallery-cell"><img loading="lazy" src="${artUrl(p.id,shiny,style)}" alt="${esc(p.name)} — ${esc(label)}" onerror="this.style.opacity='.12'"><strong>${esc(label)}</strong><small>PokéAPI Sprites</small></div>`).join('')}</div>`;
}

// UI events
$('#type-filters').addEventListener('click',e=>{
  const btn=e.target.closest('[data-type]');if(!btn)return;
  const type=btn.dataset.type;state.selectedTypes=state.selectedTypes.includes(type)?state.selectedTypes.filter(t=>t!==type):[...state.selectedTypes,type];state.shown=30;renderTypes();renderCards();
});
$('#search').addEventListener('input',e=>{state.search=e.target.value;state.shown=30;renderCards();});
$('#generation').addEventListener('change',e=>{state.generation=e.target.value;state.shown=30;renderCards();});
$('#sort').addEventListener('change',e=>{state.sort=e.target.value;state.shown=30;renderCards();});
$('#clear-filters').addEventListener('click',resetFilters);
$('#empty-reset').addEventListener('click',resetFilters);
$('#load-more').addEventListener('click',()=>{state.shown+=30;renderCards();});
document.querySelectorAll('.nav-link').forEach(btn=>btn.addEventListener('click',()=>view(btn.dataset.view)));
$('#pokemon-grid').addEventListener('click',e=>{
  const fav=e.target.closest('[data-favorite]');if(fav){toggleFavorite(+fav.dataset.favorite);return;}
  const btn=e.target.closest('[data-open]');if(btn)openDetail(+btn.dataset.open);
});
$('#detail-overlay').addEventListener('click',e=>{
  if(e.target.closest('[data-close]')){closeDetail();return;}
  const fav=e.target.closest('[data-favorite]');if(fav){toggleFavorite(+fav.dataset.favorite);return;}
  if(e.target.closest('[data-shiny]')){state.shiny=!state.shiny;renderDetail();return;}
  const tab=e.target.closest('[data-tab]');if(tab){state.detailTab=tab.dataset.tab;renderTab();return;}
  const pok=e.target.closest('[data-open]');if(pok){const id=+pok.dataset.open;const url=new URL(location.href);url.searchParams.set('pokemon',id);history.replaceState({},'',url);openDetail(id,false);return;}
});
$('#detail-overlay').addEventListener('change',e=>{
  if(e.target.id==='move-game'){state.moveGame=e.target.value;renderMoves(state.detail);}
  if(e.target.id==='move-method'){state.method=e.target.value;renderMoves(state.detail);}
  if(e.target.id==='encounter-game'){state.encounterGame=e.target.value;renderLocations(state.detail);}
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&state.detail){closeDetail();return;}
  if(e.key==='/'&&!state.detail&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)){e.preventDefault();if(state.view==='roadmap')view('catalog');$('#search').focus();}
});
window.addEventListener('popstate',()=>{
  const id=+new URL(location.href).searchParams.get('pokemon');
  if(!id)closeDetail(false);
  else if(state.detail?.id!==id)openDetail(id,false);
});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e;$('#install-btn').hidden=false;});
$('#install-btn').addEventListener('click',async()=>{if(installEvent){installEvent.prompt();await installEvent.userChoice;installEvent=null;$('#install-btn').hidden=true;}});
window.addEventListener('appinstalled',()=>{$('#install-btn').hidden=true;showToast('Pokémon Atlas установлен');});

// Render instantly using the last known catalog, or a small bundled sample.
renderTypes();updateFavoriteCount();renderCards();
if(state.full){setStatus('Каталог из кэша',true);setAlert(null);}else{setStatus('Демо-коллекция');setAlert('Загружаем Национальный Покедекс (1 025 видов). Пока доступна небольшая встроенная коллекция.');}
// Refresh in background, but never replace an available catalog with a failed network response.
fetchNationalDex().then(records=>{
  state.dex=records;state.full=true;saveDex(records);setStatus('Каталог загружен',true);setAlert(null);renderCards();
  const initialId=+new URL(location.href).searchParams.get('pokemon');
  if(initialId&&!state.detail)openDetail(initialId,false);
}).catch(error=>{
  console.warn('Не удалось обновить каталог:',error);
  if(!state.full){setStatus('Демо-режим');setAlert('Полный каталог пока недоступен. Для первой загрузки требуется интернет; работает демонстрационная коллекция.');}
  else setStatus('Каталог из кэша',true);
});
const initialId=+new URL(location.href).searchParams.get('pokemon');
if(initialId && state.dex.some(p=>p.id===initialId))openDetail(initialId,false);
if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
  window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(console.warn));
}
