import {TYPE_VALUES, GENERATIONS, STAT_NAMES, GAME_GROUPS, artUrl, numberLabel, toTitle} from './constants.js';
import {loadCachedDex, fetchNationalDex, saveDex, getDemo} from './data.js';
import {fetchPokemon, fetchEncounters, fetchSpecies, fetchMove, fetchAbility} from './api.js';
import {t, isEnglish, getLanguage, setLanguage, translateStatic, typeLabel, regionLabel, methodLabel, damageLabel} from './i18n.js';
import {fetchMoveDex, getRuMoveName, pickText, describeEffect, cleanText} from './moves.js';
import {ruMoveEffect, ruAbilityEffect, genericRuEffect,fullRuMoveInfo,fullRuAbilityInfo} from './effects-ru.js';
import {setupTeamBuilder,refreshTeamBuilder} from './team-ui.js';
import {fetchAbilityDex} from './abilities.js';
import {CORE_GAMES, recordedInVersion, recordedVersions} from './game-availability.js';
import {translatedRussian,cachedRussian,cleanSource,translationWarning} from './translate-ru.js';

const $=selector=>document.querySelector(selector);
const esc=text=>String(text??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=text=>String(text??'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[\s\-_.'’]/g,'');
const typeColors={normal:'#9a9ba5',fighting:'#c34c59',flying:'#7d9ed9',poison:'#a362b8',ground:'#b98e57',rock:'#aa955e',bug:'#8da83c',ghost:'#7760b3',steel:'#6b9ba7',fire:'#e4814b',water:'#5099d2',grass:'#65aa6d',electric:'#cda838',psychic:'#d6718d',ice:'#68b8c8',dragon:'#6775c8',dark:'#746b76',fairy:'#c67cba',shadow:'#5c547d'};
const dexCache=loadCachedDex();
const state={
  dex:dexCache||getDemo(),full:!!dexCache,moves:[],movesLoading:null,movesError:false,
  view:'catalog',search:'',generation:'all',types:[],sort:'number',shown:30,
  abilities:[],abilityError:false,abilityLoading:null,abilitySearch:'',abilityGeneration:'all',abilityShown:40,moveSort:'number',heroId:null,
  moveSearch:'',moveType:'all',moveClass:'all',moveGeneration:'all',moveShown:40,
  detail:null,detailTab:'overview',shiny:false,style:'art',moveGame:'scarlet-violet',method:'all',encounterGame:'',lastFocus:null,
  statusKey:'demoCollection',alertKey:'loadingDex'
};
let toastTimer=null,installEvent=null;
let favorites=new Set();
try{favorites=new Set(JSON.parse(localStorage.getItem('atlas-favorites-v1')||'[]'));}catch{}
setLanguage(getLanguage());

const comma=n=>new Intl.NumberFormat(isEnglish()?'en-US':'ru-RU').format(n);
const typetag=type=>`<span class="type-badge" style="background:${typeColors[type]||'#76889c'}"><span class="type-dot"></span>${esc(typeLabel(type))}</span>`;
const formatValue=n=>n==null?'—':String(n);
const moveName=m=>esc(m?.name||toTitle(m?.slug||''));
const moveRu=m=>!isEnglish()&&getRuMoveName(m?.slug)?`<small class="move-ru-name">${esc(getRuMoveName(m.slug))}</small>`:'';
const abSlug=name=>String(name||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function showToast(key){const el=$('#toast');el.textContent=t(key);el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3200);}
function displayStatus(){const el=$('#online-status');el.innerHTML=`<span class="status-dot"></span>${esc(t(state.statusKey))}`;el.className='online-status '+(state.full?'good':'warning');const alert=$('#load-alert');alert.hidden=!state.alertKey;if(state.alertKey)alert.textContent=t(state.alertKey);}
function updateFavoriteCount(){$('#fav-count').textContent=favorites.size;}
function saveFavorites(){try{localStorage.setItem('atlas-favorites-v1',JSON.stringify([...favorites]));}catch{}updateFavoriteCount();}
function filteredDex(){
  const q=normalize(state.search);
  const list=state.dex.filter(p=>{
    if(state.view==='favorites'&&!favorites.has(p.id))return false;
    if(state.generation!=='all'&&p.gen!==+state.generation)return false;
    if(state.types.length&&!state.types.every(type=>p.types.includes(type)))return false;
    if(q&&![p.id,String(p.id).padStart(4,'0'),p.name,p.ru].some(s=>normalize(s).includes(q)))return false;
    return true;
  });
  if(state.sort==='number-desc')list.sort((a,b)=>b.id-a.id);
  else if(state.sort==='name')list.sort((a,b)=>a.name.localeCompare(b.name));
  else if(state.sort==='bst')list.sort((a,b)=>b.bst-a.bst||a.id-b.id);
  else list.sort((a,b)=>a.id-b.id);
  return list;
}
function renderTypes(){
  $('#type-filters').innerHTML=TYPE_VALUES.map(([key])=>`<button type="button" class="type-chip ${state.types.includes(key)?'active':''}" data-type="${key}" style="--chip-color:${typeColors[key]}" aria-pressed="${state.types.includes(key)}">${esc(typeLabel(key))}</button>`).join('');
}
function cardHTML(p){
  const isFav=favorites.has(p.id);
  const ru=!isEnglish()?`<div class="pokemon-ru">${esc(p.ru||'')}</div>`:'';
  return `<article class="pokemon-card" style="--type-glow:${typeColors[p.types[0]]||'#8898a1'}40">
   <button type="button" class="card-open" data-open="${p.id}" aria-label="${esc(t('open'))} ${esc(p.name)}"><div class="pokemon-art"><span class="card-number">${numberLabel(p.id)}</span><img alt="${esc(p.name)}" loading="lazy" decoding="async" src="${artUrl(p.id)}" onerror="this.parentNode.classList.add('image-missing')"><span class="img-fallback">◈</span></div><div class="pokemon-info"><h3>${esc(p.name)}</h3>${ru}<div class="pokemon-tags">${p.types.map(typetag).join('')}</div><div class="card-bottom"><span>GEN ${['I','II','III','IV','V','VI','VII','VIII','IX'][p.gen-1]||'—'} · ${esc(regionLabel(p.gen))}</span><b>BST ${p.bst||'—'}</b></div></div></button>
   <button class="favorite-button ${isFav?'is-favorite':''}" data-favorite="${p.id}" aria-label="${esc(t(isFav?'removeFav':'addFav'))} ${esc(p.name)}" aria-pressed="${isFav}">${isFav?'♥':'♡'}</button>
  </article>`;
}
function renderCards(){
  const found=filteredDex();
  $('#matched-count').textContent=comma(found.length);
  $('#side-count').textContent=state.full?comma(state.dex.length):t('demo');
  $('#hero-total').textContent=state.full?comma(state.dex.length):'1 025';
  $('#pokemon-grid').innerHTML=found.slice(0,state.shown).map(cardHTML).join('');
  $('#empty-state').hidden=found.length>0;
  $('#load-more').hidden=found.length<=state.shown;
  $('#load-more').textContent=`${t('showMore')} (${comma(Math.max(0,found.length-state.shown))} ${t('remaining')}) ↓`;
}
function resetFilters(){state.search='';state.generation='all';state.types=[];state.sort='number';state.shown=30;$('#search').value='';$('#generation').value='all';$('#sort').value='number';renderTypes();renderCards();}
function toggleFavorite(id){
  if(favorites.has(id))favorites.delete(id);else favorites.add(id);
  saveFavorites();renderCards();
  const btn=$('#detail-fav');if(btn){btn.textContent=favorites.has(id)?`♥ ${t('inFav')}`:`♡ ${t('toFav')}`;btn.classList.toggle('active',favorites.has(id));}
  showToast(favorites.has(id)?'addedFav':'removedFav');
}
function navigation(viewName,scroll=true){
  state.view=viewName;
  $('#catalog-view').hidden=!['catalog','favorites'].includes(viewName);
  $('#moves-view').hidden=viewName!=='moves';
  $('#abilities-view').hidden=viewName!=='abilities';
  $('#roadmap-view').hidden=viewName!=='roadmap';
  $('#builder-view').hidden=viewName!=='builder';
  $('#hero').hidden=viewName!=='catalog';
  document.querySelectorAll('.nav-link').forEach(el=>el.classList.toggle('active',el.dataset.view===viewName));
  const crumb=viewName==='favorites'?'crumbFav':viewName==='moves'?'crumbMoves':viewName==='abilities'?'crumbAbilities':viewName==='builder'?'crumbBuilder':viewName==='roadmap'?'crumbRoadmap':'crumbDex';
  $('#breadcrumb-page').textContent=t(crumb);
  $('#list-title').textContent=t(viewName==='favorites'?'favTitle':'dexTitle');
  $('#list-subtitle').textContent=t(viewName==='favorites'?'favSubtitle':'dexSubtitle');
  if(['catalog','favorites'].includes(viewName))renderCards();
  if(viewName==='moves'){ensureMoves();renderMoveCards();}
  if(viewName==='abilities'){ensureAbilities();renderAbilityCards();}
  if(scroll)window.scrollTo({top:0,behavior:'smooth'});
}
function moveFilterOptions(){
  const type=$('#move-type'),cat=$('#move-class'),gen=$('#move-generation');
  type.innerHTML=`<option value="all">${esc(t('allTypes'))}</option>`+[...TYPE_VALUES.map(([key])=>key),'shadow'].map(key=>`<option value="${key}">${esc(typeLabel(key))}</option>`).join('');
  cat.innerHTML=`<option value="all">${esc(t('allCategories'))}</option>`+['physical','special','status'].map(key=>`<option value="${key}">${esc(t(key))}</option>`).join('');
  gen.innerHTML=`<option value="all">${esc(t('allGenerations'))}</option>`+Array.from({length:9},(_,n)=>`<option value="${n+1}">${['I','II','III','IV','V','VI','VII','VIII','IX'][n]} · ${esc(regionLabel(n+1))}</option>`).join('');
  type.value=state.moveType;cat.value=state.moveClass;gen.value=state.moveGeneration;
}
function filteredMoves(){
  const q=normalize(state.moveSearch);
  const found=state.moves.filter(m=>(!q||normalize(m.name).includes(q)||normalize(m.slug).includes(q)||normalize(getRuMoveName(m.slug)).includes(q)||String(m.id)===q)
      &&(state.moveType==='all'||m.type===state.moveType)
      &&(state.moveClass==='all'||m.category===state.moveClass)
      &&(state.moveGeneration==='all'||m.gen===+state.moveGeneration));
  if(state.moveSort==='power-asc'||state.moveSort==='power-desc')found.sort((a,b)=>{const ap=a.power??Infinity,bp=b.power??Infinity;return (state.moveSort==='power-desc'?((b.power??-1)-(a.power??-1)):ap-bp)||a.id-b.id;});
  return found;
}
function moveStats(m){
  const power=formatValue(m?.power),accuracy=m?.accuracy==null?'—':`${m.accuracy}%`,pp=formatValue(m?.pp);
  return `<div class="move-card-stats"><span><small>${esc(t('power'))}</small><b>${esc(power)}</b></span><span><small>${esc(t('accuracy'))}</small><b>${esc(accuracy)}</b></span><span><small>PP</small><b>${esc(pp)}</b></span></div>`;
}
function moveDetailsHTML(m,extra=''){
  const original=m.effect?describeEffect(m.effect,m.effectChance):'';
  const info=!isEnglish()?fullRuMoveInfo(m,original):null;
  const ru=info?.text||'';
  const short=isEnglish()?original:(info?.verified?ru:cachedRussian(original)||t('russianPending'));
  const untranslated=!isEnglish()&&info&&!info.verified&&short!==t('russianPending');
  return `<details class="move-entry" data-move="${esc(m.slug)}" data-move-id="${m.id||''}"><summary><div class="move-list-identity"><span class="move-id">${m.id?'#'+String(m.id).padStart(3,'0'):''}</span><span class="move-main-name"><strong>${moveName(m)}</strong>${moveRu(m)}</span></div><div class="move-list-tags">${typetag(m.type)}<span class="class-badge class-${esc(m.category)}">${esc(damageLabel(m.category))}</span></div>${moveStats(m)}<span class="expand-chevron" aria-hidden="true">⌄</span></summary><div class="move-expanded"><div class="move-effect-text">${short?`<h4>${esc(t('effect'))}</h4><p>${esc(short)}</p>${untranslated?`<small class="foreign-note">${esc(t('englishEffect'))}</small>`:''}`:`<p>${esc(t('loadingEffect'))}</p>`}</div>${extra?`<div class="move-extra">${extra}</div>`:''}</div></details>`;
}
async function ensureMoves(){
  if(state.moves.length)return Promise.resolve(state.moves);
  if(state.movesLoading)return state.movesLoading;
  state.movesError=false;state.movesLoading=fetchMoveDex().then(list=>{state.moves=list;state.movesError=false;renderMoveCards();return list;}).catch(err=>{state.movesError=true;console.warn('Move catalogue unavailable:',err);renderMoveCards();return [];}).finally(()=>{state.movesLoading=null;});
  renderMoveCards();return state.movesLoading;
}
function renderMoveCards(){
  const alert=$('#moves-alert');
  if(!state.moves.length){
    $('#move-list').innerHTML='';$('#move-count').textContent='—';$('#move-more').hidden=true;$('#move-empty').hidden=true;
    alert.hidden=false;alert.textContent=t(state.movesError?'movesError':'movesLoading');return;
  }
  alert.hidden=true;
  const found=filteredMoves();$('#move-count').textContent=comma(found.length);
  $('#move-list').innerHTML=found.slice(0,state.moveShown).map(m=>moveDetailsHTML(m)).join('');
  $('#move-empty').hidden=found.length!==0;$('#move-more').hidden=found.length<=state.moveShown;
  $('#move-more').textContent=`${t('showMore')} (${comma(Math.max(0,found.length-state.moveShown))} ${t('remaining')}) ↓`;
}
function abilityOptions(){
 const el=$('#ability-generation');el.innerHTML=`<option value="all">${esc(t('allGenerations'))}</option>`+Array.from({length:9},(_,i)=>`<option value="${i+1}">${['I','II','III','IV','V','VI','VII','VIII','IX'][i]} · ${esc(regionLabel(i+1))}</option>`).join('');el.value=state.abilityGeneration;
}
function ensureAbilities(){
 if(state.abilities.length)return Promise.resolve(state.abilities);
 if(state.abilityLoading)return state.abilityLoading;
 state.abilityError=false;
 state.abilityLoading=fetchAbilityDex().then(a=>{state.abilities=a;renderAbilityCards();return a;}).catch(e=>{state.abilityError=true;console.warn('Abilities could not load',e);renderAbilityCards();return [];}).finally(()=>state.abilityLoading=null);
 renderAbilityCards();return state.abilityLoading;
}
function renderAbilityCards(){
 const alert=$('#abilities-alert');if(!state.abilities.length){$('#ability-list').innerHTML='';$('#ability-count').textContent='—';$('#ability-more').hidden=true;$('#ability-empty').hidden=true;alert.hidden=false;alert.textContent=t(state.abilityError?'abilitiesError':'abilitiesLoading');return;}
 alert.hidden=true;
 const q=normalize(state.abilitySearch);
 const records=state.abilities.filter(a=>(state.abilityGeneration==='all'||a.gen===+state.abilityGeneration)&&(!q||normalize(a.name).includes(q)||normalize(a.slug).includes(q)||String(a.id)===q));
 $('#ability-count').textContent=comma(records.length);
 $('#ability-list').innerHTML=records.slice(0,state.abilityShown).map(a=>{
  const verified=isEnglish()?null:fullRuAbilityInfo(a.slug,a.effect);
  const summary=isEnglish()?a.effect:verified?.verified?verified.text:(cachedRussian(a.effect)||t('russianPending'));
  return `<details class="ability-dex-card" data-ability="${esc(a.slug)}"><summary><div class="ability-dex-title"><small>#${String(a.id).padStart(3,'0')} · GEN ${a.gen||'—'}</small><strong>${esc(a.name)}</strong></div><span class="expand-chevron">⌄</span></summary><div class="ability-dex-expanded"><div class="ability-effect"><h4>${esc(t('effect'))}</h4><p>${esc(summary||t('loadingEffect'))}</p></div><div class="ability-owners"><h4>${esc(t('abilityOwners'))}</h4><p>${esc(t('abilityOwnersLoading'))}</p></div></div></details>`;
 }).join('');
 $('#ability-empty').hidden=records.length!==0;$('#ability-more').hidden=records.length<=state.abilityShown;
 $('#ability-more').textContent=`${t('showMore')} (${comma(Math.max(0,records.length-state.abilityShown))} ${t('remaining')}) ↓`;
}
function resetAbilityFilters(){state.abilitySearch='';state.abilityGeneration='all';state.abilityShown=40;$('#ability-search').value='';abilityOptions();renderAbilityCards();}
function resetMoveFilters(){state.moveSearch='';state.moveType='all';state.moveClass='all';state.moveGeneration='all';state.moveSort='number';state.moveShown=40;$('#move-search').value='';$('#move-sort').value='number';moveFilterOptions();renderMoveCards();}

function chooseHero(records){
 const available=records.filter(p=>p.id>0&&p.id<=1025);if(!available.length)return;
 let last=0;try{last=+localStorage.getItem('atlas-last-hero-id')||0;}catch{}
 const pool=available.filter(p=>p.id!==last);const pokemon=pool[Math.floor(Math.random()*pool.length)]||available[0];
 state.heroId=pokemon.id;try{localStorage.setItem('atlas-last-hero-id',pokemon.id);}catch{}
 const img=$('#hero-pokemon');img.style.display='';img.src=artUrl(pokemon.id);img.alt=pokemon.name;
 $('#hero-number').textContent=numberLabel(pokemon.id);$('#hero-name').textContent=pokemon.name.toUpperCase();
 $('#hero-genus').textContent='THE POKÉMON';
 fetchSpecies(pokemon.id).then(data=>{
  if(state.heroId!==pokemon.id)return;
  const genus=data.genera?.find(x=>x.language.name==='en')?.genus;
  if(genus)$('#hero-genus').textContent='THE '+genus.toUpperCase();
 }).catch(()=>{});
}
function detailTop(p){
  const extra=p.legendary?t('legendary'):p.mythical?t('mythical'):'';
  return `<div class="detail-top"><div class="detail-visual" style="--type-glow:${typeColors[p.types[0]]||'#8a95a5'}66"><div class="detail-toolbar"><button type="button" class="detail-icon-btn ${state.shiny?'active':''}" data-shiny="true">✦ ${t('shiny')} ${state.shiny?'ON':'OFF'}</button><button type="button" class="detail-icon-btn" id="detail-fav" data-favorite="${p.id}">${favorites.has(p.id)?`♥ ${t('inFav')}`:`♡ ${t('toFav')}`}</button></div><img class="detail-art" src="${artUrl(p.id,state.shiny,state.style)}" alt="${esc(p.name)}" onerror="this.style.opacity='.15'"></div>
  <div class="detail-head"><div class="detail-no">${numberLabel(p.id)} · GENERATION ${p.gen}</div><h2 id="detail-title">${esc(p.name)}</h2>${!isEnglish()?`<div class="detail-ru">${esc(p.ru||'')}</div>`:''}<div class="detail-tags">${p.types.map(typetag).join('')}</div>${extra?`<div class="detail-special">✦ ${esc(extra)}</div>`:''}
  <div class="detail-meta"><div class="meta-cell"><small>${esc(t('gen'))}</small><b>${esc(regionLabel(p.gen))}</b></div><div class="meta-cell"><small>${esc(t('totalStats'))}</small><b>${p.bst||'—'} BST</b></div><div class="meta-cell"><small>${esc(t('height'))}</small><b>${p.height!=null?p.height+' m':'—'}</b></div><div class="meta-cell"><small>${esc(t('weight'))}</small><b>${p.weight!=null?p.weight+' kg':'—'}</b></div></div></div><button type="button" class="detail-close" data-close="true" aria-label="${esc(t('close'))}">×</button></div>
  <div class="detail-tabs"><button type="button" class="detail-tab ${state.detailTab==='overview'?'active':''}" data-tab="overview">${t('tabOverview')}</button><button type="button" class="detail-tab ${state.detailTab==='moves'?'active':''}" data-tab="moves">${t('tabMoves')}</button><button type="button" class="detail-tab ${state.detailTab==='locations'?'active':''}" data-tab="locations">${t('tabLocations')}</button><button type="button" class="detail-tab ${state.detailTab==='gallery'?'active':''}" data-tab="gallery">${t('tabGallery')}</button></div>
  <div class="detail-body" id="detail-body"></div>`;
}
function openDetail(id,updateUrl=true){
  const p=state.dex.find(x=>x.id===id);if(!p)return;
  state.detail=p;state.detailTab='overview';state.shiny=false;state.style='art';state.moveGame='scarlet-violet';state.method='all';state.encounterGame='';
  state.lastFocus=document.activeElement;$('#detail-overlay').hidden=false;document.body.style.overflow='hidden';renderDetail();$('.detail-dialog').focus();
  if(updateUrl){const url=new URL(location.href);url.searchParams.set('pokemon',id);history.pushState({},'',url);}
}
function closeDetail(updateUrl=true){
  if(!state.detail)return;state.detail=null;$('#detail-overlay').hidden=true;document.body.style.overflow='';
  if(updateUrl){const url=new URL(location.href);url.searchParams.delete('pokemon');history.replaceState({},'',url);}
  state.lastFocus?.focus?.();
}
function renderDetail(){if(state.detail){$('#detail-content').innerHTML=detailTop(state.detail);renderTab();}}
function evolutionHTML(p){
  const family=state.dex.filter(x=>p.chainId!=null&&x.chainId===p.chainId).sort((a,b)=>a.id-b.id);
  if(!family.length)return `<p class="helper-note">${esc(t('evoMissing'))}</p>`;
  return `<div class="evo-chips">${family.map(x=>`<button type="button" class="evo-link ${x.id===p.id?'current':''}" data-open="${x.id}"><img loading="lazy" src="${artUrl(x.id)}" alt="" onerror="this.style.display='none'"><span>${esc(x.name)}</span></button>`).join('')}</div><p class="helper-note">${esc(t('evoNote'))}</p>`;
}
function renderOverview(p){
  const stats=p.stats.length===6?p.stats.map((v,i)=>`<div class="stat-row"><span>${STAT_NAMES[i]}</span><b>${v}</b><div class="stat-track" role="progressbar" aria-label="${STAT_NAMES[i]}" aria-valuenow="${v}" aria-valuemin="0" aria-valuemax="255"><div class="stat-fill" style="width:${Math.max(1,Math.min(100,100*v/255))}%"></div></div></div>`).join(''):`<p class="helper-note">${esc(t('noData'))}</p>`;
  const abilities=(p.abilities||[]).map(a=>{const ru=!isEnglish()?fullRuAbilityInfo(abSlug(a.name)).text:'';return `<details class="ability-entry" data-ability="${esc(abSlug(a.name))}"><summary><span>${esc(a.name)}</span><small>${esc(t(a.hidden?'hiddenAbilitySlot':a.slot===2?'secondAbility':'firstAbility'))}</small><span class="expand-chevron">⌄</span></summary><div class="ability-effect">${ru?`<h4>${esc(t('effect'))}</h4><p>${esc(ru)}</p>`:esc(t('russianPending'))}</div></details>`;}).join('');
  $('#detail-body').innerHTML=`<div class="pokedex-description"><div class="pokedex-heading"><span>◈</span><h3>${esc(t('pokedexText'))}</h3></div><p id="pokedex-entry" data-species-id="${p.id}">${esc(t('pokedexLoading'))}</p><div class="pokedex-source" id="pokedex-source"></div></div>
  <div class="two-column"><div><h3>${esc(t('stats'))}</h3>${stats}<div class="stat-sum">${esc(t('statsTotal'))} <b>${p.bst||'—'}</b></div></div><div><h3>${esc(t('abilities'))}</h3><div class="ability-list">${abilities||`<span class="helper-note">${esc(t('noData'))}</span>`}</div><h3 style="margin-top:29px">${esc(t('evolution'))}</h3>${evolutionHTML(p)}<p class="helper-note">${esc(t('formNote'))}</p></div></div>`;
  loadPokedexDescription(p.id);
}
function pokedexRuFallback(id){
 const p=state.dex.find(p=>p.id===id);if(!p)return 'Запись Покедекса на русском пока недоступна.';
 return `${p.ru||p.name} — покемон ${p.gen}-го поколения. Тип: ${p.types.map(typeLabel).join(' и ')}. Рост: ${p.height??'—'} м, масса: ${p.weight??'—'} кг.`;
}
async function loadPokedexDescription(id){
  try{
    const species=await fetchSpecies(id);
    const candidate=(species.flavor_text_entries||[]).filter(x=>x.language?.name==='en');
    const chosen=candidate[candidate.length-1];const text=cleanText(chosen?.flavor_text||'');
    const target=$('#pokedex-entry');if(!target||+target.dataset.speciesId!==id||state.detailTab!=='overview')return;
    let prose=text||t('pokedexMissing'),machine=false,failed=false;
    if(!isEnglish()&&text){
      const saved=cachedRussian(text);
      if(saved){prose=saved;machine=true;}
      else{target.textContent=t('pokedexLoading');try{prose=await translatedRussian(text);machine=true;}catch(e){console.warn('Pokédex Russian translation unavailable',e);prose=`${pokedexRuFallback(id)} ${t('machineFailed')}`;failed=true;}}
    }
    if(!target.isConnected||+target.dataset.speciesId!==id||state.detailTab!=='overview')return;
    target.textContent=prose;
    const src=$('#pokedex-source');if(src){const game=chosen?.version?.name?toTitle(chosen.version.name):'';
      src.innerHTML=`${esc(game)}${game?' · ':''}${esc(t('pokedexOriginal'))}${machine?` · ${esc(t('machineNote'))}`:''}${!isEnglish()&&text?`<details class="original-effect"><summary>${esc(t('originalEnglish'))}</summary><p>${esc(text)}</p></details>`:''}`;
    }
  }catch(err){const target=$('#pokedex-entry');if(target&&+target.dataset.speciesId===id&&state.detailTab==='overview')target.textContent=t('pokedexError');}
}
function renderTab(){
  if(!state.detail)return;
  document.querySelectorAll('.detail-tab').forEach(el=>el.classList.toggle('active',el.dataset.tab===state.detailTab));
  if(state.detailTab==='overview')renderOverview(state.detail);
  else if(state.detailTab==='moves')renderLearnset(state.detail);
  else if(state.detailTab==='locations')renderLocations(state.detail);
  else if(state.detailTab==='gallery')renderGallery(state.detail);
}
const currentDetailIs=(id,tab)=>state.detail?.id===id&&state.detailTab===tab;
async function renderLearnset(p){
  $('#detail-body').innerHTML=`<div class="loading-detail">${esc(t('movesLoading'))}</div>`;
  try{
    const [data,moveIndex]=await Promise.all([fetchPokemon(p.pokemonId||p.id),ensureMoves()]);
    if(!currentDetailIs(p.id,'moves'))return;
    const indexed=new Map((moveIndex||[]).map(m=>[m.slug,m]));
    const gameSet=new Set(data.moves.flatMap(m=>m.version_group_details.map(d=>d.version_group.name)));
    const groups=Object.keys(GAME_GROUPS).filter(g=>gameSet.has(g));
    if(!groups.length){$('#detail-body').innerHTML=`<p class="helper-note">${esc(t('movesNone'))}</p>`;return;}
    if(!groups.includes(state.moveGame))state.moveGame=groups[groups.length-1];
    const entries=data.moves.flatMap(item=>item.version_group_details.filter(d=>d.version_group.name===state.moveGame).map(d=>({
      slug:item.move.name,method:d.move_learn_method.name,level:d.level_learned_at,
      ...(indexed.get(item.move.name)||{name:toTitle(item.move.name),slug:item.move.name,type:'normal',category:'status',power:null,accuracy:null,pp:null})
    })));
    const sortOrder=m=>({'level-up':0,'machine':1,'egg':2,'tutor':3}[m]??4);
    const filtered=entries.filter(e=>state.method==='all'||e.method===state.method).sort((a,b)=>sortOrder(a.method)-sortOrder(b.method)||a.level-b.level||a.name.localeCompare(b.name));
    const methods=['level-up','machine','egg','tutor','form-change'];
    const moveMarkup=filtered.map(m=>moveDetailsHTML(m,`${esc(methodLabel(m.method))}${m.method==='level-up'?' · Lv. '+m.level:''}`)).join('');
    $('#detail-body').innerHTML=`<h3>${esc(t('learnedMoves'))} <span class="muted-count">· ${filtered.length} ${esc(t('records'))}</span></h3><div class="controls-line"><label>${esc(t('game'))}: <select id="move-game">${groups.map(g=>`<option value="${esc(g)}" ${g===state.moveGame?'selected':''}>${esc(GAME_GROUPS[g])}</option>`).join('')}</select></label><label>${esc(t('method'))}: <select id="move-method"><option value="all" ${state.method==='all'?'selected':''}>${esc(t('allMethods'))}</option>${methods.map(key=>`<option value="${key}" ${state.method===key?'selected':''}>${esc(methodLabel(key))}</option>`).join('')}</select></label></div><div class="move-dex-list in-detail">${moveMarkup||`<p class="helper-note">${esc(t('movesFilteredNone'))}</p>`}</div><p class="helper-note">${esc(t('learnsetNote'))}</p>`;
  }catch(err){if(currentDetailIs(p.id,'moves'))$('#detail-body').innerHTML=`<p class="error-detail">${esc(t('movesError'))} (${esc(err.message)})</p>`;}
}
async function renderLocations(p){
 $('#detail-body').innerHTML=`<div class="loading-detail">${esc(t('locationsLoading'))}</div>`;
 try{
  const [entries,detail]=await Promise.all([fetchEncounters(p.pokemonId||p.id),fetchPokemon(p.pokemonId||p.id)]);
  if(!currentDetailIs(p.id,'locations'))return;
  const discovered=recordedVersions(entries);
  // Game indices are supplementary evidence only. Not every playable game is represented.
  const indexed=new Set((detail.game_indices||[]).map(x=>x.version.name));
  const options=CORE_GAMES.map(([code,name])=>({code,name,found:recordedInVersion(entries,code),index:indexed.has(code)}));
  const current=options.find(x=>x.code===state.encounterGame);
  if(!current){state.encounterGame=options.find(x=>x.found.length)?.code||options[options.length-1].code;}
  const selected=options.find(x=>x.code===state.encounterGame)||options[0];
  const known=options.filter(x=>x.found.length).length;
  const gallery=options.map(x=>`<button type="button" class="game-status ${x.code===state.encounterGame?'selected':''} ${x.found.length?'has-encounter':''}" data-game="${esc(x.code)}"><b>${esc(x.name)}</b><small>${esc(t(x.found.length?'gameWildKnown':x.index?'gameIndexKnown':'gameUnknown'))}</small></button>`).join('');
  const list=selected.found.map(e=>`<div class="location-item"><strong>${esc(toTitle(e.location))}</strong><span>${esc(t('level'))} ${e.min==null?'—':e.min===e.max?e.min:e.min+'–'+e.max} · ${esc(e.methods.map(toTitle).join(', ')||t('unknownMethod'))} · ${esc(t('maxChance'))}: ${esc(e.chance??'—')}%</span></div>`).join('');
  $('#detail-body').innerHTML=`<h3>${esc(t('gameCatalogTitle'))} <span class="muted-count">· ${CORE_GAMES.length}</span></h3><p class="helper-note">${esc(t('gamesOverviewNote'))}</p><div class="game-status-grid">${gallery}</div><h3>${esc(selected.name)} · ${esc(t('locationsTitle'))} <span class="muted-count">· ${selected.found.length}</span></h3><div class="game-location-list">${list||`<p class="helper-note">${esc(t('locationsNone'))}</p>`}</div>`;
 }catch(err){if(currentDetailIs(p.id,'locations'))$('#detail-body').innerHTML=`<p class="error-detail">${esc(t('locationsError'))} (${esc(err.message)})</p>`;}
}
function renderGallery(p){
  const variants=[['art',false,'art'],['artShiny',true,'art'],['HOME',false,'home'],['homeShiny',true,'home'],['pixel',false,'pixel'],['pixelShiny',true,'pixel']];
  $('#detail-body').innerHTML=`<h3>${esc(t('galleryTitle'))}</h3><p class="helper-note">${esc(t('galleryNote'))}</p><div class="gallery-grid">${variants.map(([key,shiny,style])=>`<div class="gallery-cell"><img loading="lazy" src="${artUrl(p.id,shiny,style)}" alt="${esc(p.name)} — ${esc(t(key))}" onerror="this.style.opacity='.12'"><strong>${esc(t(key))}</strong><small>PokéAPI Sprites</small></div>`).join('')}</div>`;
}
// Native HTML details preserve keyboard support and close on a second click.
async function openEffect(details){
 if(!details.open||details.dataset.loading==='yes')return;
 if(details.dataset.loaded==='yes')return;
 details.dataset.loading='yes';
 const ability=details.dataset.ability, target=details.querySelector(ability?'.ability-effect':'.move-effect-text');
 try{
  const data=ability?await fetchAbility(ability):await fetchMove(details.dataset.moveId||details.dataset.move);
  let effect=pickText(data.effect_entries,'effect')||pickText(data.effect_entries,'short_effect');
  if(!effect){const english=(data.flavor_text_entries||[]).filter(x=>x.language?.name==='en');effect=english.at(-1)?.flavor_text||'';}
  const original=cleanSource(describeEffect(effect,data.effect_chance));
  if(!target?.isConnected)return;
  const id=ability||data.name||details.dataset.move;
  const info=!isEnglish()?(ability?fullRuAbilityInfo(id,original):fullRuMoveInfo({slug:id,type:data.type?.name,category:data.damage_class?.name,effectChance:data.effect_chance},original)):null;
  let body=isEnglish()?original:(info?.verified?info.text:cachedRussian(original));
  let machine=false,failed=false;
  if(!isEnglish()&&!info?.verified&&original&&!body){
   target.innerHTML=`<p>${esc(t('pokedexLoading'))}</p>`;
   try{body=await translatedRussian(original);machine=true;}
   catch(e){failed=true;console.warn('Effect translation failed',id,e);body=t('machineFailed');}
  }else if(!isEnglish()&&!info?.verified&&body)machine=true;
  if(!target.isConnected||!details.open)return;
  const statChanges=!ability?data.stat_changes||[]:[];
  const extras=[];
  if(!ability&&data.effect_chance!=null)extras.push(`<span class="effect-meta-chip">${esc(t('secondaryChance'))}: <b>${data.effect_chance}%</b></span>`);
  if(statChanges.length)extras.push(`<span class="effect-meta-chip">${esc(t('statChanges'))}: ${statChanges.map(c=>`${esc(toTitle(c.stat.name))} ${c.change>0?'+':''}${c.change}`).join(', ')}</span>`);
  if(!ability&&data.priority)extras.push(`<span class="effect-meta-chip">${esc(t('priority'))}: ${data.priority>0?'+':''}${data.priority}</span>`);
  const originalSection=!isEnglish()&&original?`<details class="original-effect"><summary>${esc(t('originalEnglish'))}</summary><p>${esc(original)}</p></details>`:'';
  target.innerHTML=`<h4>${esc(t('effect'))}</h4><p>${esc(body||t('noEffect'))}</p>${extras.length?`<div class="effect-meta">${extras.join('')}</div>`:''}${machine?`<small class="foreign-note">${esc(t('machineNote'))}</small>`:''}${originalSection}`;
  if(ability){
   const owner=details.querySelector('.ability-owners');
   if(owner){
    const list=(data.pokemon||[]).slice().sort((a,b)=>(Number(a.pokemon.url.match(/\/(\d+)\/?$/)?.[1])||9999)-(Number(b.pokemon.url.match(/\/(\d+)\/?$/)?.[1])||9999));
    owner.innerHTML=`<h4>${esc(t('abilityOwners'))} <span class="muted-count">· ${list.length}</span></h4><div class="ability-owner-grid">${list.map(x=>`<div class="ability-owner"><strong>${esc(toTitle(x.pokemon.name))}</strong><small>${esc(t(x.is_hidden?'hiddenAbilitySlot':x.slot===2?'secondAbility':'firstAbility'))}</small></div>`).join('')||`<p>${esc(t('abilityOwnersMissing'))}</p>`}</div>`;
   }
  }
  details.dataset.loaded='yes';
 }catch(err){console.warn('Effect failed',err);if(target?.isConnected)target.innerHTML=`<p>${esc(t('errorEffect'))}</p>`;}
 finally{delete details.dataset.loading;}
}
function applyLanguage(){
  translateStatic();
  document.querySelectorAll('[data-region]').forEach(opt=>{const n=+opt.dataset.region;opt.textContent=`${['I','II','III','IV','V','VI','VII','VIII','IX'][n-1]} — ${regionLabel(n)}`;});
  renderTypes();moveFilterOptions();abilityOptions();displayStatus();renderCards();renderMoveCards();renderAbilityCards();navigation(state.view,false);refreshTeamBuilder();
  if(state.detail)renderDetail();
}
// Event handlers
setupTeamBuilder(()=>state.dex);
$('#language-switch').addEventListener('change',e=>{setLanguage(e.target.value);applyLanguage();});
$('#type-filters').addEventListener('click',e=>{const btn=e.target.closest('[data-type]');if(!btn)return;const type=btn.dataset.type;state.types=state.types.includes(type)?state.types.filter(t=>t!==type):[...state.types,type];state.shown=30;renderTypes();renderCards();});
$('#search').addEventListener('input',e=>{state.search=e.target.value;state.shown=30;renderCards();});
$('#generation').addEventListener('change',e=>{state.generation=e.target.value;state.shown=30;renderCards();});
$('#sort').addEventListener('change',e=>{state.sort=e.target.value;state.shown=30;renderCards();});
$('#clear-filters').addEventListener('click',resetFilters);$('#empty-reset').addEventListener('click',resetFilters);
$('#load-more').addEventListener('click',()=>{state.shown+=30;renderCards();});
$('#move-search').addEventListener('input',e=>{state.moveSearch=e.target.value;state.moveShown=40;renderMoveCards();});
for(const [id,field] of [['move-type','moveType'],['move-class','moveClass'],['move-generation','moveGeneration']]){$('#'+id).addEventListener('change',e=>{state[field]=e.target.value;state.moveShown=40;renderMoveCards();});}
$('#move-clear').addEventListener('click',resetMoveFilters);
$('#move-more').addEventListener('click',()=>{state.moveShown+=40;renderMoveCards();});
$('#move-sort').addEventListener('change',e=>{state.moveSort=e.target.value;state.moveShown=40;renderMoveCards();});
$('#ability-search').addEventListener('input',e=>{state.abilitySearch=e.target.value;state.abilityShown=40;renderAbilityCards();});
$('#ability-generation').addEventListener('change',e=>{state.abilityGeneration=e.target.value;state.abilityShown=40;renderAbilityCards();});
$('#ability-clear').addEventListener('click',resetAbilityFilters);
$('#ability-more').addEventListener('click',()=>{state.abilityShown+=40;renderAbilityCards();});
document.querySelectorAll('.nav-link').forEach(btn=>btn.addEventListener('click',()=>navigation(btn.dataset.view)));
$('#pokemon-grid').addEventListener('click',e=>{const fav=e.target.closest('[data-favorite]');if(fav){toggleFavorite(+fav.dataset.favorite);return;}const btn=e.target.closest('[data-open]');if(btn)openDetail(+btn.dataset.open);});
$('#detail-overlay').addEventListener('click',e=>{
  if(e.target.closest('[data-close]')){closeDetail();return;}
  const fav=e.target.closest('[data-favorite]');if(fav){toggleFavorite(+fav.dataset.favorite);return;}
  if(e.target.closest('[data-shiny]')){state.shiny=!state.shiny;renderDetail();return;}
  const tab=e.target.closest('[data-tab]');if(tab){state.detailTab=tab.dataset.tab;renderTab();return;}
  const game=e.target.closest('[data-game]');if(game){state.encounterGame=game.dataset.game;renderLocations(state.detail);return;}
  const pok=e.target.closest('[data-open]');if(pok){const id=+pok.dataset.open;const url=new URL(location.href);url.searchParams.set('pokemon',id);history.replaceState({},'',url);openDetail(id,false);}
});
$('#detail-overlay').addEventListener('change',e=>{
  if(e.target.id==='move-game'){state.moveGame=e.target.value;renderLearnset(state.detail);}
  if(e.target.id==='move-method'){state.method=e.target.value;renderLearnset(state.detail);}
  if(e.target.id==='encounter-game'){state.encounterGame=e.target.value;renderLocations(state.detail);}
});
document.addEventListener('toggle',e=>{if(e.target.matches('details[data-ability], details[data-move]')&&e.target.open)openEffect(e.target);},true);
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&state.detail){closeDetail();return;}
  if(e.key==='/'&&!state.detail&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)){e.preventDefault();if(!['catalog','favorites','moves','abilities'].includes(state.view))navigation('catalog');$(state.view==='moves'?'#move-search':state.view==='abilities'?'#ability-search':'#search').focus();}
});
window.addEventListener('popstate',()=>{const id=+new URL(location.href).searchParams.get('pokemon');if(!id)closeDetail(false);else if(state.detail?.id!==id)openDetail(id,false);});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e;$('#install-btn').hidden=false;});
$('#install-btn').addEventListener('click',async()=>{if(installEvent){installEvent.prompt();await installEvent.userChoice;installEvent=null;$('#install-btn').hidden=true;}});
window.addEventListener('appinstalled',()=>{$('#install-btn').hidden=true;showToast('installed');});

// Initial UI is usable even if remote APIs are temporarily unavailable.
applyLanguage();
chooseHero(state.dex);
updateFavoriteCount();
if(state.full){state.statusKey='catalogCache';state.alertKey=null;}
displayStatus();
fetchNationalDex().then(records=>{
  state.dex=records;state.full=true;window.dispatchEvent(new CustomEvent('atlas:dex-ready'));saveDex(records);if(!dexCache)chooseHero(records);state.statusKey='catalogLoaded';state.alertKey=null;displayStatus();renderCards();
  const id=+new URL(location.href).searchParams.get('pokemon');if(id&&!state.detail)openDetail(id,false);
}).catch(err=>{
  console.warn('Could not update the National Dex:',err);
  state.statusKey=state.full?'catalogCache':'demoMode';state.alertKey=state.full?null:'failedDex';displayStatus();
});
const initialId=+new URL(location.href).searchParams.get('pokemon');
if(initialId&&state.dex.some(p=>p.id===initialId))openDetail(initialId,false);
if('serviceWorker' in navigator&&(location.protocol==='https:'||['localhost','127.0.0.1'].includes(location.hostname))){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js?v=06').catch(console.warn));}