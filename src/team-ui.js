import {FORMATS, ROLE_NAMES, ROLE_DESC, availablePool, validSets} from './team-data.js';
import {generateSuggestions, showdownExport, championsText, teamCoverage, displaySpread} from './team-engine.js';
import {t,isEnglish, typeLabel} from './i18n.js';
import {artUrl,numberLabel} from './constants.js';

const $=(sel)=>document.querySelector(sel);
const e=(text)=>String(text??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const L=(ru,en)=>isEnglish()?en:ru;
const STORE='atlas-team-builder-v03';
let getDex=()=>[];
const state={format:'ou',size:6,seeds:[],roles:{},search:'',teams:[],selected:0,notice:''};
try{const saved=JSON.parse(localStorage.getItem(STORE)||'null');if(saved&&FORMATS[saved.format]){
 state.format=saved.format;state.size=Math.min(6,Math.max(FORMATS[state.format].min,Number(saved.size)||6));
 state.seeds=Array.isArray(saved.seeds)?saved.seeds.slice(0,2).map(Number):[];
 state.roles=saved.roles&&typeof saved.roles==='object'?saved.roles:{};
}}catch{}
function remember(){try{localStorage.setItem(STORE,JSON.stringify({format:state.format,size:state.size,seeds:state.seeds,roles:state.roles}));}catch{}}
const pool=()=>availablePool(state.format);
const byId=id=>pool().find(p=>p.id===id);
function roleLabel(role){return (ROLE_NAMES[role]||[role,role])[isEnglish()?1:0];}
function validRoles(id){return [...new Set(validSets(byId(id)||{sets:[]},state.format).map(s=>s.role))];}
function nameFor(entry){const ru=getDex().find(x=>x.id===entry.id)?.ru;return entry.name+(!isEnglish()&&ru&&ru.toLowerCase()!==entry.name.toLowerCase()?` · ${ru}`:'');}
function rolesMarkup(entry){const choice=state.roles[entry.id]||'auto';return `<label class="builder-role-label">${L('Роль в команде','Role in team')}<select data-team-role="${entry.id}"><option value="auto">${L('Подобрать автоматически','Auto-select role')}</option>${validRoles(entry.id).map(r=>`<option value="${r}" ${r===choice?'selected':''}>${e(roleLabel(r))}</option>`).join('')}</select></label>`;}
function selectedMarkup(){return state.seeds.map((id,i)=>{
 const entry=byId(id);if(!entry)return '';
 return `<div class="builder-seed"><img alt="" src="${artUrl(id)}" onerror="this.style.opacity='.15'"><div class="builder-seed-details"><b>${e(entry.name)}</b><small>${numberLabel(id)} · ${e(entry.types.map(typeLabel).join(' / '))}</small>${rolesMarkup(entry)}</div><button class="builder-remove" data-team-remove="${id}" title="${e(L('Удалить','Remove'))}" aria-label="${e(L('Убрать покемона','Remove Pokémon'))}">×</button></div>`;
 }).join('')||`<div class="builder-seed-empty">${L('Пусто. Можно начать с нуля — движок соберёт команду сам.','Empty. You can start from zero; the builder will suggest a team.')}</div>`;}
function scoreWarning(format){return FORMATS[format].champions
 ?L('Формат Pokémon Champions: отдельные Stat Points, без Tera, с ограничением одинаковых предметов и одной Mega Evolution в бою. Текущий список доступных видов и атак автоматически не сверяется.','Pokémon Champions uses Stat Points, no Tera, Item Clause and only one Mega Evolution per battle. Legal species and moves are not automatically verified.')
 :L('Экспериментальный подбор: билды — отправная точка. Перед рейтинговым боем проверь бан-лист, способности и атаки через валидатор Pokémon Showdown.','Experimental recommendations. Before laddering, check format bans, abilities and moves with the Pokémon Showdown validator.');}
const formatOptions=()=>Object.entries(FORMATS).map(([key,fmt])=>`<option value="${key}" ${key===state.format?'selected':''}>${e(isEnglish()?fmt.label:fmt.titleRu)}</option>`).join('');
function outputTeam(){if(!state.teams.length)return `<div class="builder-placeholder"><div class="builder-big-icon">⚔</div><h3>${L('Сначала подбери команду','Generate a team to begin')}</h3><p>${L('Можно добавить одного или двух покемонов, закрепить их роли или оставить оба слота пустыми.','You can choose zero, one or two Pokémon and optionally lock their roles.')}</p></div>`;
 const variant=state.teams[state.selected]||state.teams[0],fmt=FORMATS[state.format],roster=variant.roster,coverage=teamCoverage(roster);
 const threats=coverage.filter(x=>x.weak>=2).slice(0,4);
 return `<div class="builder-result">
 <div class="builder-variant-tabs">${state.teams.map((team,i)=>`<button type="button" data-team-variant="${i}" class="${state.selected===i?'active':''}">${[L('Баланс','Balanced'),L('Атака','Offense'),L('Контроль','Control')][['balanced','offense','control'].indexOf(team.plan)]||team.plan}</button>`).join('')}</div>
 <div class="builder-result-head"><div><h3>${L('Предложенная команда','Suggested team')} · ${roster.length}/6</h3><p>${e(isEnglish()?fmt.descriptionEn:fmt.descriptionRu)}</p></div><div class="builder-score">${L('Оценка синергии','Synergy heuristic')}<strong>${variant.score}</strong><small>${L('Сравнительный показатель, не % побед','Relative score; not a win rate')}</small></div></div>
 <div class="builder-team-grid">${roster.map((p,i)=>{
  const {entry,set}=p;
  return `<article class="builder-mon"><div class="builder-mon-top"><div class="builder-mon-art"><img alt="${e(entry.name)}" loading="lazy" src="${artUrl(entry.id)}" onerror="this.style.opacity='.1'"></div><div class="builder-mon-head"><small>${i+1} / ${roster.length} ${p.seed?`· ${L('ТВОЙ ВЫБОР','LOCKED')}`:''}</small><h4>${e(entry.name)}</h4><div class="builder-mon-types">${entry.types.map(x=>`<span>${e(typeLabel(x))}</span>`).join('')}</div></div></div>
    <div class="builder-role"><span>${e(roleLabel(set.role))}</span><small>${e((ROLE_DESC[set.role]||['',''])[isEnglish()?1:0])}</small></div>
    <div class="builder-facts"><div><small>${L('Предмет','Item')}</small><b>${e(set.item)}</b></div><div><small>${L('Способность','Ability')}</small><b>${e(set.ability)}${set.note?.startsWith('Mega Ability:')?` → ${e(set.note.slice(14).trim())}`:''}</b></div><div><small>${fmt.champions?'Stat Alignment':'Nature'}</small><b>${e(set.nature)}</b></div>${fmt.champions?'':`<div><small>Tera</small><b>${e(set.tera)}</b></div>`}<div class="wide"><small>${fmt.champions?'Stat Points':'EVs'}</small><b>${e(displaySpread(set.spread,fmt.champions))}</b></div></div>
    <div class="builder-move-pills">${set.moves.map(x=>`<span>${e(x)}</span>`).join('')}</div>
    <div class="builder-reasons">${p.why.map(x=>`<p>↳ ${e(x)}</p>`).join('')}</div>
   </article>`;
 }).join('')}</div>
 <div class="builder-team-bottom"><div><strong>${L('Слабые места команды','Shared weaknesses')}</strong><div class="builder-threats">${threats.length?threats.map(({type,weak,resist})=>`<span>${e(typeLabel(type))}: ${weak} ${L('уязв.','weak')} / ${resist} ${L('сопр.','resist')}</span>`).join(''):`<span>${L('Нет типов со слабостью у двух и более участников','No type shared by at least two weaknesses')}</span>`}</div></div><button id="builder-copy" type="button">${fmt.champions?L('Копировать сборку Champions','Copy Champions build'):L('Копировать в Showdown','Copy for Showdown')}</button></div>
 <p class="builder-warning">${e(scoreWarning(state.format))}</p>
 </div>`;
}
function render(){
 const root=$('#team-builder-root');if(!root)return;
 const candidates=pool();
 const format=FORMATS[state.format];
 state.seeds=state.seeds.filter(id=>!!byId(id)).slice(0,2);
 state.size=Math.max(format.min,Math.min(6,state.size));
 root.innerHTML=`<div class="builder-intro"><div class="builder-top-line"><div><div class="section-kicker">TEAM LAB · BETA</div><h2>${L('Конструктор команд','Team Builder')}</h2><p>${L('Выбери от 0 до 2 покемонов — Atlas предложит партнёров и варианты билдов под формат и роли.','Select 0–2 Pokémon and get format-aware teammates and role-specific sets.')}</p></div><div class="builder-beta">BETA · 0.3</div></div>
 <div class="builder-panel"><div class="builder-config-grid"><label>${L('Формат боя','Battle format')}<select id="team-format">${formatOptions()}</select></label><label>${L('Размер команды','Team size')}<select id="team-size">${[3,4,5,6].filter(n=>n>=format.min).map(n=>`<option value="${n}" ${n===state.size?'selected':''}>${n} / 6</option>`).join('')}</select></label></div>
 <p class="builder-format-note">${e(isEnglish()?format.descriptionEn:format.descriptionRu)}</p>
 <div class="builder-seeds-head"><h3>${L('Твои покемоны','Your starting Pokémon')} <span>${state.seeds.length}/2</span></h3><small>${L('Можешь зафиксировать роль каждого','Lock a role for each chosen Pokémon')}</small></div>
 <div class="builder-seeds">${selectedMarkup()}</div>
 <div class="builder-picker"><label><span>${L('Добавить покемона','Add Pokémon')} · ${L('тестовый пул','prototype pool')}: ${candidates.length}</span><input id="team-search" list="team-pokemon-options" value="${e(state.search)}" placeholder="${e(L('Начни вводить имя на русском или английском','Search English / Russian name'))}" ${state.seeds.length>=2?'disabled':''} autocomplete="off"></label><datalist id="team-pokemon-options">${candidates.filter(p=>!state.seeds.includes(p.id)).map(p=>`<option value="${e(p.name)}">${e(nameFor(p))}</option>`).join('')}</datalist><button id="team-add" ${state.seeds.length>=2?'disabled':''}>${L('Добавить','Add')}</button></div>
 <p class="builder-data-hint">${L('В бете используются вручную подготовленные наборы для выбранного формата, а не весь Национальный Покедекс. Поиск понимает доступные русские имена.','Beta uses curated format-specific sets rather than the entire National Pokédex. Russian names are supported where available.')}</p>
 <div class="builder-actions"><button id="team-generate" class="builder-primary">${L('Подобрать команду','Generate team')}</button><button id="team-reset" class="builder-reset">${L('Очистить выбор','Clear selection')}</button><span id="team-notice" aria-live="polite">${e(state.notice)}</span></div></div></div>
 ${outputTeam()}`;
}
function formatSelect(name){const norm=text=>String(text||'').toLowerCase().trim().replace(/[\s._\-]+/g,'');const value=norm(name);
 if(!value)return null;
 const results=pool().filter(p=>norm(p.name)===value||(getDex().find(x=>x.id===p.id)?.ru&&norm(getDex().find(x=>x.id===p.id)?.ru)===value)||String(p.id)===value);
 return results[0]||null;
}
function runBuilder(){state.notice='';state.teams=generateSuggestions({format:state.format,seedIds:state.seeds,roles:state.seeds.map(id=>state.roles[id]||'auto'),size:state.size,lang:isEnglish()?'en':'ru'});
 state.selected=0;
 if(!state.teams.length)state.notice=L('Для этой комбинации пока нет совместимых билдов. Измени формат или роли.','No compatible builds yet. Change format or roles.');render();
}
function addSeed(){const entry=formatSelect(state.search);if(!entry){state.notice=L('Не найден покемон в базе этого формата. Выбери вариант из подсказок.','Pokémon not in the prototype pool for this format; select a suggested entry.');render();$('#team-search')?.focus();return;}
 if(state.seeds.length<2&&!state.seeds.includes(entry.id)){state.seeds.push(entry.id);state.roles[entry.id]='auto';state.search='';state.notice='';state.teams=[];remember();render();}
}
async function copyTeam(){const team=state.teams[state.selected];if(!team)return;
 const value=FORMATS[state.format].champions?championsText(team.roster):showdownExport(team.roster,state.format);
 try{await navigator.clipboard.writeText(value);state.notice=L('Сборка скопирована.','Team copied.');}
 catch{const area=document.createElement('textarea');area.value=value;area.style.cssText='position:fixed;top:0;left:0;opacity:.01';document.body.append(area);area.select();const success=document.execCommand?.('copy');area.remove();state.notice=success?L('Сборка скопирована.','Team copied.'):L('Скопируй текст из окна:','Copy the text from the field:');if(!success){const out=$('#team-builder-root');out.insertAdjacentHTML('beforeend',`<textarea class="builder-export-text" readonly>${e(value)}</textarea>`);return;}}
 $('#team-notice').textContent=state.notice;
}
export function setupTeamBuilder(dexGetter){getDex=dexGetter;
 $('#team-builder-root').addEventListener('input',ev=>{if(ev.target.id==='team-search')state.search=ev.target.value;});
 $('#team-builder-root').addEventListener('change',ev=>{
  if(ev.target.id==='team-format'){state.format=ev.target.value;state.size=Math.max(FORMATS[state.format].min,state.size);state.seeds=state.seeds.filter(x=>!!byId(x));state.search='';state.teams=[];state.notice='';remember();render();}
  if(ev.target.id==='team-size'){state.size=+ev.target.value;state.teams=[];remember();render();}
  if(ev.target.dataset.teamRole){state.roles[ev.target.dataset.teamRole]=ev.target.value;state.teams=[];remember();render();}
 });
 $('#team-builder-root').addEventListener('keydown',ev=>{if(ev.target.id==='team-search'&&ev.key==='Enter'){ev.preventDefault();addSeed();}});
 $('#team-builder-root').addEventListener('click',ev=>{
  if(ev.target.closest('#team-add')){addSeed();return;}
  const del=ev.target.closest('[data-team-remove]');if(del){const id=+del.dataset.teamRemove;state.seeds=state.seeds.filter(x=>x!==id);delete state.roles[id];state.teams=[];remember();render();return;}
  if(ev.target.closest('#team-reset')){state.seeds=[];state.roles={};state.search='';state.notice='';state.teams=[];remember();render();return;}
  if(ev.target.closest('#team-generate')){runBuilder();return;}
  if(ev.target.closest('#builder-copy')){copyTeam();return;}
  const tab=ev.target.closest('[data-team-variant]');if(tab){state.selected=+tab.dataset.teamVariant;render();}
 });
 render();
}
export function refreshTeamBuilder(){if(state.teams.length)runBuilder();else render();}