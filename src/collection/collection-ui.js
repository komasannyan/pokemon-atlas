import {COLLECTION_GAMES,gameFor,fetchRegionalDex,gameEntries} from './collection-games.js';
import {STAT_KEYS,NATURES,ROLES,evaluateIndividual} from './collection-calc.js';
import {artUrl,numberLabel} from '../constants.js';
import {isEnglish} from '../i18n.js';

const STORAGE='pokemon-atlas-collection-v1', GAME_KEY='pokemon-atlas-collection-game-v1';
const $=sel=>document.querySelector(sel);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const txt=(ru,en)=>isEnglish()?en:ru;
const data={version:1,games:{}};
try{const raw=JSON.parse(localStorage.getItem(STORAGE)||'null');if(raw?.version===1&&raw.games&&typeof raw.games==='object')data.games=raw.games;}catch{}
const state={game:'violet',area:'all',filter:'all',search:'',sort:'dex',shown:60,dexes:null,dexError:false,activeId:null,editIndex:null,editing:false};
try{const saved=localStorage.getItem(GAME_KEY);if(saved&&COLLECTION_GAMES.some(g=>g.key===saved))state.game=saved;}catch{}
let dexProvider=()=>[],storageWarning='';
const getGame=()=>gameFor(state.game);
const getBox=()=>data.games[state.game]||(data.games[state.game]={});
const record=id=>getBox()[id]||(getBox()[id]={count:0,shiny:0,instances:[]});
const findMon=id=>dexProvider().find(p=>p.id===+id);
const niceName=p=>p?`${p.name}${!isEnglish()&&p.ru?' · '+p.ru:''}`:'#'+state.activeId;
const validCount=n=>Number.isInteger(n)&&n>=0&&n<=9999;
const amount=(id)=>Math.max(0,+getBox()[id]?.count||0);
const shinyAmount=(id)=>Math.max(0,+getBox()[id]?.shiny||0);
const save=()=>{try{localStorage.setItem(STORAGE,JSON.stringify(data));storageWarning='';return true;}catch{storageWarning=txt('Не удалось сохранить: хранилище браузера недоступно или заполнено. Сделай экспорт коллекции.','Saving failed: browser storage is unavailable or full. Export a backup.');return false;}};
function toast(message){const el=$('#col-notice');if(!el)return;el.textContent=message;el.hidden=false;setTimeout(()=>{if(el.textContent===message)el.hidden=true;},5000);}
const roleNames={general:['Универсальный','General'],physical:['Физический атакующий','Physical attacker'],special:['Специальный атакующий','Special attacker'],defensive:['Защитный','Defensive'],fast:['Скоростной','Fast attacker'],trickroom:['Trick Room (низкая Speed)','Trick Room (low Speed)']};
function chooseGame(){return `<label class="col-field"><span>${txt('Игра','Game')}</span><select id="col-game">${COLLECTION_GAMES.map(g=>`<option value="${g.key}" ${g.key===state.game?'selected':''}>${esc(g.label)}</option>`).join('')}</select></label>`;}
function chooseArea(){return `<label class="col-field"><span>${txt('Раздел Покедекса','Pokédex area')}</span><select id="col-area"><option value="all">${txt('Все разделы','All areas')}</option>${getGame().areas.map(a=>`<option value="${a.id}" ${String(state.area)===String(a.id)?'selected':''}>${esc(isEnglish()?a.en:a.ru)}${a.dlc?' · DLC':''}</option>`).join('')}<option value="pc" ${state.area==='pc'?'selected':''}>${txt('Весь мой ПК (включая вне декса)','My entire PC (including outside the dex)')}</option></select></label>`;}
function allRows(){if(!state.dexes)return [];return gameEntries(getGame(),state.dexes,state.area==='pc'?'all':state.area);}
function allIds(){return new Set(gameEntries(getGame(),state.dexes||{},'all').map(x=>x.id));}
function filteredRows(){
 const seen=new Map(allRows().map(x=>[x.id,x]));
 if(state.area==='pc')for(const [id,r] of Object.entries(getBox()))if((r.count||0)>0&&!seen.has(+id))seen.set(+id,{id:+id,number:null,areas:[]});
 let result=[...seen.values()];const search=state.search.toLocaleLowerCase().trim();
 result=result.filter(x=>{
  const p=findMon(x.id);if(!p)return false;
  if(search&&!`${p.name} ${p.ru||''} ${x.id} ${x.number||''}`.toLowerCase().includes(search))return false;
  if(state.filter==='caught'&&!amount(x.id))return false;
  if(state.filter==='missing'&&amount(x.id))return false;
  if(state.filter==='shiny'&&!shinyAmount(x.id))return false;
  return true;
 });
 if(state.sort==='name')result.sort((a,b)=>(findMon(a.id)?.name||'').localeCompare(findMon(b.id)?.name||''));
 else if(state.sort==='count')result.sort((a,b)=>amount(b.id)-amount(a.id)||a.id-b.id);
 else if(state.sort==='national')result.sort((a,b)=>a.id-b.id);
 else result.sort((a,b)=>(a.number??99999)-(b.number??99999)||a.id-b.id);
 return result;
}
function progressHTML(){
 const game=getGame();const all=gameEntries(game,state.dexes,'all');const unique=new Set(all.map(x=>x.id));const owned=[...unique].filter(id=>amount(id)>0).length;
 const allOwn=Object.values(getBox()).reduce((n,r)=>n+Math.max(0,+r.count||0),0);
 const shiny=Object.values(getBox()).reduce((n,r)=>n+Math.max(0,+r.shiny||0),0);
 const pct=unique.size?Math.round(owned/unique.size*100):0;
 return `<div class="col-stats"><div><small>${txt('Видов в Pokédex','Pokédex species')}</small><b>${owned} / ${unique.size}</b></div><div><small>${txt('Прогресс','Completion')}</small><b>${pct}%</b></div><div><small>${txt('Экземпляров в ПК','Owned specimens')}</small><b>${allOwn}</b></div><div><small>Shiny</small><b>✦ ${shiny}</b></div></div>
 <div class="col-progress-bar"><span style="width:${pct}%"></span></div>
 <div class="col-area-stats">${game.areas.map(a=>{const ids=(state.dexes?.[a.id]||[]).map(row=>row[1]);const c=ids.filter(id=>amount(id)>0).length;return `<button type="button" data-col-area="${a.id}" class="col-area-pill ${String(state.area)===String(a.id)?'selected':''}"><strong>${esc(isEnglish()?a.en:a.ru)}</strong>${a.dlc?'<small>DLC</small>':''}<span>${c} / ${ids.length}</span></button>`;}).join('')}</div>`;
}
function rowHTML(row){const p=findMon(row.id);const quantity=amount(row.id),shiny=shinyAmount(row.id),outside=!row.areas?.length;
 return `<div class="col-mon ${quantity?'col-caught':''}"><button type="button" class="col-mon-main" data-col-open="${p.id}" aria-label="${esc(p.name)}"><img loading="lazy" src="${artUrl(p.id)}" alt="${esc(p.name)}" onerror="this.style.opacity='.15'"><span class="col-mon-meta"><small>${outside?txt('ВНЕ РЕГИОНАЛЬНОГО ДЕКСА','OUTSIDE REGIONAL DEX'):'#'+String(row.number||p.id).padStart(3,'0')}</small><b>${esc(p.name)}</b>${!isEnglish()&&p.ru?`<small>${esc(p.ru)}</small>`:''}<small>${p.types.join(' / ')}</small></span></button>
 <div class="col-mon-actions"><button type="button" data-col-toggle="${p.id}" class="col-status ${quantity?'yes':''}" aria-label="${txt('Отметить поимку','Toggle caught')}">${quantity?'✓ '+quantity:txt('+ Пойман','+ Caught')}</button><button type="button" data-col-open="${p.id}" class="col-shiny-count ${shiny?'yes':''}" aria-label="Shiny">✦ ${shiny}</button></div></div>`;
}
function render(){const root=$('#collection-root');if(!root)return;const game=getGame();
 root.innerHTML=`<div class="col-head"><div><div class="section-kicker">PERSONAL POKÉDEX</div><h2>${txt('Моя коллекция Pokémon','My Pokémon collection')}</h2><p>${txt('Отдельный Pokédex для каждой игры и личный ПК с оценкой характеристик.','Game-specific Pokédex, personal PC and IV estimates.')}</p></div><div class="col-utility"><button type="button" id="col-export">${txt('Экспорт JSON','Export JSON')}</button><button type="button" id="col-import">${txt('Импорт','Import')}</button><input type="file" id="col-import-file" accept="application/json,.json" hidden></div></div>
 <p class="col-alert" id="col-notice" ${storageWarning?'':'hidden'}>${esc(storageWarning)}</p>
 <div class="col-controls">${chooseGame()}${chooseArea()}<label class="col-field"><span>${txt('Поиск','Search')}</span><input id="col-search" type="search" placeholder="${txt('Имя, номер, русский перевод…','Name or number…')}" value="${esc(state.search)}"></label><label class="col-field"><span>${txt('Показать','Show')}</span><select id="col-filter">${[['all',txt('Все','All')],['caught',txt('Пойманные','Caught')],['missing',txt('Не пойманные','Missing')],['shiny','Shiny']].map(([v,l])=>`<option value="${v}" ${state.filter===v?'selected':''}>${l}</option>`).join('')}</select></label><label class="col-field"><span>${txt('Сортировка','Sort')}</span><select id="col-sort">${[['dex',txt('Номер в дексе','Dex number')],['national',txt('Национальный номер','National number')],['name',txt('Имя','Name')],['count',txt('Количество','Quantity')]].map(([v,l])=>`<option value="${v}" ${state.sort===v?'selected':''}>${l}</option>`).join('')}</select></label></div>
 ${!state.dexes?`<div class="col-loading">${state.dexError?txt('Не удалось загрузить игровые Покедексы.','Failed to load game Pokédexes.'):`${txt('Загрузка региональных Покедексов…','Loading regional Pokédexes…')}`} ${state.dexError?'<button type="button" id="col-retry">↻ Retry</button>':''}</div>`:
 `${progressHTML()}<p class="col-method-note">${txt('Прогресс считается по региональным Pokédex выбранной игры, включая DLC. Версионные эксклюзивы, перенос, подарки и события могут требовать обмена или особых условий; присутствие в дексе не означает доступность в дикой природе. Записи вне декса учитываются только в ПК.','Progress follows the selected game’s regional Pokédex, including DLC. Version exclusives, trades, gifts and events may require special conditions; a dex entry does not imply a wild encounter. Outside-dex records count only toward your PC.')}</p>
 <details class="col-outside"><summary>${txt('Записать покемона в ПК вне регионального декса','Record Pokémon outside the regional Pokédex')}</summary><div class="col-outside-form"><input id="col-outside-name" placeholder="Mewtwo, 150, …"><button type="button" id="col-outside-add">${txt('Открыть карточку','Open record')}</button></div><small>${txt('Для полученных через обмен, HOME, события и других особых случаев. Доступность в конкретной игре здесь не проверяется.','For transfers, trades, events and special cases. Game-specific availability is not verified here.')}</small></details>
 <div class="col-results-line">${txt('Записей по фильтру','Matching species')}: <b id="col-results-count">0</b></div>
 <div id="col-grid" class="col-grid"></div><div class="col-more-wrap"><button id="col-more" type="button" hidden>${txt('Показать ещё','Show more')} ↓</button></div>`}
 <p class="col-private">${txt('Данные хранятся только в этом браузере. Для переноса между устройствами используй экспорт/импорт JSON.','Data stays in this browser. Use JSON export/import to transfer between devices.')}</p>`;
 renderRows();
}
function renderRows(){if(!state.dexes)return;const rows=filteredRows(),grid=$('#col-grid');if(!grid)return;grid.innerHTML=rows.slice(0,state.shown).map(rowHTML).join('')||`<p class="col-empty">${txt('Ничего не найдено. Попробуй другой фильтр.','No matches. Try another filter.')}</p>`;$('#col-results-count').textContent=rows.length;$('#col-more').hidden=rows.length<=state.shown;}
function quickToggle(id){const r=record(id);if(r.count>0){if(r.instances?.length||r.shiny){toast(txt('Сначала измени количество в карточке: здесь есть сохранённые экземпляры или Shiny.','Edit the record first: specimens or Shiny are saved.'));return;}r.count=0;}else r.count=1;save();render();}
function outsideAdd(){const input=$('#col-outside-name');if(!input)return;const q=input.value.trim().toLowerCase(),p=dexProvider().find(p=>String(p.id)===q||p.name.toLowerCase()===q||p.ru?.toLowerCase()===q);if(!p){toast(txt('Покемон не найден в загруженном Национальном Покедексе.','Pokémon not found in the loaded National Pokédex.'));return;}openModal(p.id);}
function openModal(id){if(!findMon(id))return;state.activeId=id;state.editIndex=null;state.editing=false;renderModal();const el=$('#collection-modal');el.hidden=false;document.body.classList.add('col-modal-open');}
function closeModal(){state.activeId=null;state.editing=false;$('#collection-modal').hidden=true;document.body.classList.remove('col-modal-open');}
function specimenDefault(){return {nickname:'',box:'',level:50,ability:'',nature:'Hardy',role:'general',evMode:'known',observed:['','','','','',''],evs:[0,0,0,0,0,0],shiny:false};}
function instanceHTML(x,i,p,game){const report=game.calc?evaluateIndividual(p,x):null;let rating=report?.score?`${report.lower===report.upper?report.score:`${report.lower}–${report.upper}`}/100`:'';
 return `<div class="col-instance"><div><b>${esc(x.nickname||p.name)} ${x.shiny?'✦':''}</b><small>Lv. ${x.level||'?'} · ${esc(x.nature||'—')} · ${esc(x.ability||'—')}${x.box?' · '+esc(x.box):''}</small>${rating?`<small>${txt('Оценка','Rating')}: ${rating}</small>`:''}</div><div class="col-instance-btns"><button type="button" data-col-edit="${i}">${txt('Изменить','Edit')}</button><button type="button" data-col-delete="${i}" class="col-danger">×</button></div></div>`;}
function renderModal(){const root=$('#collection-modal-content'),p=findMon(state.activeId),game=getGame();if(!root||!p)return;
 const r=record(p.id),a=gameEntries(game,state.dexes||{},'all').find(x=>x.id===p.id);const extra=a?.areas.map(x=>isEnglish()?x.en:x.ru).join(' · ')||txt('Вне регионального декса (не влияет на прогресс)','Outside regional dex (does not affect progress)');
 root.innerHTML=`<div class="col-modal-header"><img src="${artUrl(p.id)}" alt="${esc(p.name)}"><div><small>${numberLabel(p.id)} · ${esc(extra)}</small><h2>${esc(niceName(p))}</h2><small>${esc(p.types.join(' / '))} · BST ${p.bst||'—'}</small></div><button class="col-close" type="button" id="col-close-modal" aria-label="Close">×</button></div>
 <div class="col-record-controls"><label>${txt('Всего экземпляров','Total specimens')}<input type="number" min="0" max="9999" id="col-count" value="${r.count||0}"></label><label>Shiny ✦<input type="number" min="0" max="9999" id="col-shiny" value="${r.shiny||0}"></label><button id="col-save-count" type="button">${txt('Сохранить количество','Save quantities')}</button></div>
 <div class="col-instance-head"><h3>${txt('Мои экземпляры','My specimens')} (${r.instances?.length||0})</h3><button type="button" id="col-new-specimen">+ ${txt('Записать экземпляр','Add specimen')}</button></div>
 <div class="col-instances">${(r.instances||[]).map((x,i)=>instanceHTML(x,i,p,game)).join('')||`<p class="col-hint">${txt('Можно просто отметить количество или добавить данные каждого экземпляра отдельно.','Track totals or add detailed records for individual specimens.')}</p>`}</div>
 <div id="col-specimen-editor">${state.editing?formHTML(p,r.instances?.[state.editIndex]||specimenDefault(),game):''}</div>`;
 if(state.editing)refreshEvaluation();
}
function formHTML(p,inst,game){const abilities=p.abilities||[];const natura=NATURES.map(n=>`<option value="${n.name}" ${n.name===inst.nature?'selected':''}>${n.name}</option>`).join('');
 const roleOptions=ROLES.map(role=>`<option value="${role}" ${role===inst.role?'selected':''}>${esc((roleNames[role]||[])[isEnglish()?1:0]||role)}</option>`).join('');
 const options=abilities.map(a=>`<option value="${esc(a.name)}" ${a.name===inst.ability?'selected':''}>${esc(a.name)}${a.hidden?' · Hidden':''}</option>`).join('');
 return `<form id="col-specimen-form" class="col-specimen-form"><h3>${state.editIndex==null?txt('Новый экземпляр','New specimen'):txt('Редактирование экземпляра','Edit specimen')}</h3>
 <div class="col-form-grid"><label>${txt('Прозвище','Nickname')}<input name="nickname" maxlength="60" value="${esc(inst.nickname||'')}"></label><label>${txt('Коробка ПК','PC box')}<input name="box" maxlength="40" placeholder="Box 3" value="${esc(inst.box||'')}"></label><label>${txt('Уровень','Level')}<input name="level" type="number" min="1" max="100" required value="${inst.level||50}"></label><label>${txt('Натура','Nature')}<select name="nature">${natura}</select></label><label>${txt('Способность','Ability')}<select name="ability"><option value="">—</option>${options}</select></label><label>${txt('Роль для оценки','Evaluation role')}<select name="role">${roleOptions}</select></label></div>
 <label class="col-check"><input type="checkbox" name="shiny" ${inst.shiny?'checked':''}> Shiny ✦</label>
 ${game.calc?`<label class="col-ev-choice">${txt('EV (действуют на любом уровне)','EVs (apply at every level)')}<select name="evMode"><option value="known" ${inst.evMode!=='unknown'?'selected':''}>${txt('Знаю EV (у нового без тренировок — нули)','Known EVs (freshly caught: zero)')}</option><option value="unknown" ${inst.evMode==='unknown'?'selected':''}>${txt('EV неизвестны — IV будут менее точными','Unknown EVs — wider IV ranges')}</option></select></label>
 <div class="col-stat-table"><div class="col-stat-th"><span>${txt('Характеристика','Stat')}</span><span>${txt('Базовая','Base')}</span><span>${txt('Фактическая','Observed')}</span><span>EV</span></div>${STAT_KEYS.map((n,i)=>`<div class="col-stat-tr"><label>${n}</label><span>${p.stats[i]??'—'}</span><input aria-label="${n} observed" type="number" min="1" max="999" name="stat${i}" placeholder="—" value="${esc(inst.observed?.[i]??'')}"><input aria-label="${n} EV" type="number" min="0" max="252" name="ev${i}" value="${esc(inst.evs?.[i]??0)}"></div>`).join('')}</div><div id="col-evaluation"></div>`:
 `<p class="col-note">${txt('Для этой игры обычная формула IV не применяется: Gen I–II используют DV/Stat Exp, Let’s Go — AV, Legends — другие системы. Запись сохраняется, но оценка IV отключена.','This game does not use the standard IV formula: Gen I–II have DV/Stat Exp, Let’s Go uses AV, and Legends games use different systems. You can save records, but IV estimation is unavailable.')}</p>`}
 <div class="col-form-actions"><button type="submit" class="col-primary">${txt('Сохранить экземпляр','Save specimen')}</button><button type="button" id="col-cancel-edit">${txt('Отмена','Cancel')}</button></div></form>`;
}
function readInstance(form){const fd=new FormData(form),str=x=>String(fd.get(x)||'').trim();
 return {nickname:str('nickname'),box:str('box'),level:+str('level'),nature:str('nature'),ability:str('ability'),role:str('role'),shiny:fd.get('shiny')!==null,evMode:str('evMode')||'known',observed:STAT_KEYS.map((_,i)=>str('stat'+i)),evs:STAT_KEYS.map((_,i)=>str('ev'+i)===''?0:+str('ev'+i))};
}
function evaluationHTML(info,p,game){if(!game.calc)return '';if(info.error==='invalid-ev')return `<p class="col-error">${txt('Проверь EV: 0–252 на характеристику, максимум 510 суммарно.','Check EVs: 0–252 per stat, maximum 510 total.')}</p>`;
 if(info.error==='inconsistent')return `<p class="col-error">${txt('Введённые значения несовместимы с формулой: проверь уровень, натуру, EV, форму и характеристики.','Stats do not match the formula. Check level, nature, EVs, form and observed values.')}</p>`;
 if(info.error)return `<p class="col-error">${txt('Базовые характеристики недоступны.','Base stats unavailable.')}</p>`;
 const rating=info.filled?`<div class="col-rating"><strong>${info.score}/100</strong><span>${txt('Оценка','Rating')}: ${info.lower}–${info.upper}/100 ${info.provisional?txt('(примерная)','(approx.)'):''}</span></div>`:`<p class="col-hint">${txt('Введи фактические характеристики покемона, чтобы вычислить возможные IV и оценку от 1 до 100.','Enter observed stats to calculate possible IVs and a 1–100 rating.')}</p>`;
 const ivs=info.ranges?.map((r,i)=>`<div class="col-iv-item"><small>${STAT_KEYS[i]}</small><b>${r?.error?'!':r?`${r.min}${r.min===r.max?'':'–'+r.max}`:'—'}</b></div>`).join('')||'';
 return `<section class="col-eval"><h4>${txt('Оценка экземпляра и IV','Specimen rating & IVs')}</h4>${rating}<div class="col-iv-list">${ivs}</div><p>${txt('Это оценка IV и соответствия натуры выбранной роли, а не показатель силы вида. Shiny и редкость не прибавляют баллы. На низких уровнях IV часто определяются лишь диапазоном. Без точных EV диапазон может быть широким. Гипертренировка и Mints меняют отображаемые статы: указывай эффективную натуру, а реальные IV гипертренированного покемона по ним не восстановить.','Rating reflects IV quality and nature fit for the selected role, not the species’ overall strength. Shiny does not increase the rating. Low levels and unknown EVs often yield broad IV ranges. Hyper Training and Mints change battle stats: use the effective nature, and do not treat hyper-trained stats as original IVs.')}</p>${getGame().gen<9?`<p class="col-caveat">${txt('Исторические базовые характеристики и изменённые формы могут отличаться от текущей базы; проверь расчёт перед использованием.','Historical base stats and alternate forms may differ from current data; verify results for this game.')}</p>`:''}</section>`;
}
function refreshEvaluation(){const form=$('#col-specimen-form'),p=findMon(state.activeId);if(!form||!p)return;const inst=readInstance(form),el=$('#col-evaluation');if(el)el.innerHTML=evaluationHTML(evaluateIndividual(p,inst),p,getGame());}
function saveSpecimen(form){const p=findMon(state.activeId);if(!p)return;const inst=readInstance(form);if(inst.level<1||inst.level>100){toast(txt('Укажи уровень от 1 до 100.','Level must be from 1 to 100.'));return;}
 if(getGame().calc){const result=evaluateIndividual(p,inst);if(result.error){toast(txt('Проверь характеристики и EV перед сохранением.','Check the stats and EVs before saving.'));return;}}
 const r=record(p.id);r.instances=r.instances||[];
 const previousShiny=r.instances.filter(x=>x.shiny).length;
 const untrackedShiny=Math.max(0,(r.shiny||0)-previousShiny);
 if(state.editIndex==null){r.instances.push(inst);r.count=Math.max(r.count||0,r.instances.length);}else r.instances[state.editIndex]=inst;
 r.shiny=untrackedShiny+r.instances.filter(x=>x.shiny).length;r.count=Math.max(r.count,r.shiny,r.instances.length);
 if(save()){state.editing=false;state.editIndex=null;renderModal();renderRows();refreshProgress();}
}
function refreshProgress(){// Refresh the calculated totals without resetting an open editor.
 const p=$('#collection-root .col-stats');if(!p)return;const tmp=document.createElement('div');tmp.innerHTML=progressHTML();const bar=$('.col-progress-bar'),areas=$('.col-area-stats');p.replaceWith(tmp.querySelector('.col-stats'));bar?.replaceWith(tmp.querySelector('.col-progress-bar'));areas?.replaceWith(tmp.querySelector('.col-area-stats'));
}
function exportJson(){const payload={schema:'pokemon-atlas-collection',version:1,exportedAt:new Date().toISOString(),games:data.games};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='pokemon-atlas-collection-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);}
function validateImport(json){if(json.schema!=='pokemon-atlas-collection'||json.version!==1||!json.games||typeof json.games!=='object')throw Error('Unexpected backup format');const clean={};
 for(const [game,box] of Object.entries(json.games)){if(!COLLECTION_GAMES.some(x=>x.key===game)||!box||typeof box!=='object')continue;clean[game]={};
 for(const [id,r] of Object.entries(box)){if(!/^\d+$/.test(id)||+id<1||+id>1025||!r||!validCount(r.count)||!validCount(r.shiny)||r.shiny>r.count||!Array.isArray(r.instances)||r.instances.length>9999||r.instances.length>r.count)continue;
 const instances=r.instances.slice(0,9999).filter(x=>x&&Number.isInteger(+x.level)&&+x.level>=1&&+x.level<=100).map(x=>({nickname:String(x.nickname||'').slice(0,60),box:String(x.box||'').slice(0,40),level:+x.level,nature:NATURES.some(n=>n.name===x.nature)?x.nature:'Hardy',ability:String(x.ability||'').slice(0,60),role:ROLES.includes(x.role)?x.role:'general',evMode:x.evMode==='unknown'?'unknown':'known',observed:Array.from({length:6},(_,i)=>String(x.observed?.[i]??'')),evs:Array.from({length:6},(_,i)=>Math.min(252,Math.max(0,+x.evs?.[i]||0))),shiny:!!x.shiny}));
 clean[game][id]={count:r.count,shiny:r.shiny,instances};
 }}return clean;
}
async function importJson(file){try{if(!file||file.size>5_000_000)throw Error('File too large');const incoming=validateImport(JSON.parse(await file.text()));if(!window.confirm(txt('Заменить текущую коллекцию данными из файла? Сначала сделай экспорт на всякий случай.','Replace your existing collection with this backup? Export your current data first.')))return;
 data.games=incoming;save();state.area='all';state.filter='all';state.search='';state.shown=60;render();toast(txt('Коллекция импортирована.','Collection imported.'));}catch(e){toast(txt('Неверный файл коллекции: ','Invalid collection file: ')+e.message);}}
export function setupCollection(provider){dexProvider=provider;const root=$('#collection-view');if(!root)return;
 root.innerHTML='<div id="collection-root"></div><div class="col-modal-backdrop" id="collection-modal" hidden><div class="col-modal-scrim" data-col-close></div><div class="col-modal-window" role="dialog" aria-modal="true"><div id="collection-modal-content"></div></div></div>';
 render();fetchRegionalDex().then(d=>{state.dexes=d;state.dexError=false;render();}).catch(e=>{console.error('Regional dex failed:',e);state.dexError=true;render();});
 root.addEventListener('change',e=>{const id=e.target.id;
 if(id==='col-game'){state.game=e.target.value;state.area='all';state.shown=60;try{localStorage.setItem(GAME_KEY,state.game);}catch{}render();}
 else if(id==='col-area'){state.area=e.target.value;state.shown=60;render();}
 else if(id==='col-filter'){state.filter=e.target.value;state.shown=60;renderRows();}
 else if(id==='col-sort'){state.sort=e.target.value;renderRows();}
 else if(id==='col-import-file'){importJson(e.target.files?.[0]);}
 else if(e.target.closest('#col-specimen-form'))refreshEvaluation();
 });
 root.addEventListener('input',e=>{
 if(e.target.id==='col-search'){state.search=e.target.value;state.shown=60;renderRows();}
 else if(e.target.closest('#col-specimen-form'))refreshEvaluation();
 });
 root.addEventListener('submit',e=>{if(e.target.id==='col-specimen-form'){e.preventDefault();saveSpecimen(e.target);}});
 root.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.colArea){state.area=b.dataset.colArea;state.shown=60;render();return;}
  if(b.dataset.colToggle){quickToggle(+b.dataset.colToggle);return;}
  if(b.dataset.colOpen){openModal(+b.dataset.colOpen);return;}
  if(b.dataset.colEdit!==undefined){state.editIndex=+b.dataset.colEdit;state.editing=true;renderModal();return;}
  if(b.dataset.colDelete!==undefined){const r=record(state.activeId),i=+b.dataset.colDelete;if(!window.confirm(txt('Удалить запись об этом экземпляре?','Delete this specimen?')))return;const [removed]=r.instances.splice(i,1);r.count=Math.max(r.instances.length,(r.count||0)-1);if(removed?.shiny)r.shiny=Math.max(r.instances.filter(x=>x.shiny).length,(r.shiny||0)-1);save();renderModal();renderRows();refreshProgress();return;}
  if(b.id==='col-close-modal'||b.hasAttribute('data-col-close')){closeModal();return;}
  if(b.id==='col-new-specimen'){state.editing=true;state.editIndex=null;renderModal();return;}
  if(b.id==='col-cancel-edit'){state.editing=false;state.editIndex=null;renderModal();return;}
  if(b.id==='col-save-count'){const r=record(state.activeId),count=+$('#col-count').value,shiny=+$('#col-shiny').value;if(!validCount(count)||!validCount(shiny)||shiny>count||count<(r.instances?.length||0)||shiny<(r.instances||[]).filter(x=>x.shiny).length){toast(txt('Количество должно быть не меньше записанных экземпляров и Shiny, а Shiny не больше общего количества.','Counts must cover all recorded specimens and Shiny, with Shiny no higher than total.'));return;}r.count=count;r.shiny=shiny;save();renderModal();renderRows();refreshProgress();return;}
  if(b.id==='col-outside-add'){outsideAdd();return;}
  if(b.id==='col-more'){state.shown+=60;renderRows();return;}
  if(b.id==='col-export'){exportJson();return;}
  if(b.id==='col-import'){$('#col-import-file')?.click();return;}
  if(b.id==='col-retry'){state.dexError=false;state.dexes=null;render();fetchRegionalDex().then(d=>{state.dexes=d;render();}).catch(()=>{state.dexError=true;render();});return;}
 });
 root.addEventListener('click',e=>{if(e.target.hasAttribute('data-col-close'))closeModal();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.activeId)closeModal();});
}
export function refreshCollection(){if($('#collection-root')){render();if(state.activeId)renderModal();}}