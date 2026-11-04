// The detail overlay remains owned by app.js. This module produces safe HTML for its extensions.
import {normalizeVarieties,varietyLabel,evolutionTree,evolutionRequirements,formSnapshot,historySnapshots,generationLabel,readableStats,readableTypes,readableAbilities} from './pokedex-extended.js';
const html=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const msg=(en,ru,english)=>en?english:ru;
const img=id=>`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
export function formSelector(species,base,selection,loading,en,error){
 if(!species)return '';
 const forms=normalizeVarieties(species,base);
 if(forms.length<2)return '';
 const current=selection||forms.find(x=>x.isDefault)?.slug||forms[0].slug;
 return `<section class="form-panel" aria-label="${msg(en,'Выбор формы','Form selection')}">
 <div class="form-panel-head"><h3>${msg(en,'Формы и разновидности','Forms and varieties')}</h3><small>${forms.length} ${msg(en,'вариантов','varieties')}</small></div>
 <div class="form-selector" role="group" aria-label="${msg(en,'Выбор разновидности','Choose a variety')}">${forms.map(x=>`<button type="button" class="form-button" data-form-slug="${html(x.slug)}" aria-pressed="${x.slug===current}" ${loading?'disabled':''}>${html(x.name)}</button>`).join('')}</div>
 ${error?`<p class="form-inline-note form-error">${msg(en,'Не удалось загрузить эту форму; показаны последние доступные данные.','This form could not be loaded; showing the last available data.')}</p>`:''}
 <p class="form-inline-note">${msg(en,'Некоторые формы меняются только в бою или требуют особых условий. Наличие здесь не означает доступность формы в каждой игре.','Some forms are battle-only or require special conditions. Listing a form does not mean it is obtainable in every game.')}</p></section>`;
}
export function evolutionPage(chain,baseId,en){
 if(!chain)return `<div class="loading-detail">${msg(en,'Загружаем дерево эволюций…','Loading the evolution tree…')}</div>`;
 const rows=evolutionTree(chain);
 if(!rows.length)return `<p class="helper-note">${msg(en,'Нет доступных данных об эволюции.','No evolution data are available.')}</p>`;
 return `<div class="evo-panel"><h3>${msg(en,'Цепочка эволюций','Evolution chain')}</h3>
 <p class="evo-intro">${msg(en,'Полная цепочка по данным PokéAPI, включая альтернативные ветви и условия. Условия могут различаться в отдельных играх.','Full PokéAPI chain, including branches and requirements. Conditions can differ between games.')}</p>
 <div class="evo-branches">${rows.map(node=>`<div class="evo-step" style="padding-left:${Math.min(7,node.depth)*18}px" ${node.id===baseId?'aria-current="true"':''}>
 ${node.parent?`<span class="evo-arrow" aria-hidden="true">↳</span>`:''}
 <button type="button" class="evo-entry" data-open="${node.id}" aria-label="${html(node.slug)}"><img loading="lazy" src="${img(node.id)}" alt="" onerror="this.style.opacity='.15'"><span><strong>${html(node.slug.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()))}</strong><small>#${String(node.id).padStart(4,'0')}${node.baby?' · Baby':''}</small></span></button>
 ${node.parent?evolutionRequirements(node.details,en).map(info=>`<div class="evo-condition">${html(info)}</div>`).join(''):''}
 </div>`).join('')}</div></div>`;
}
export function historyPage(form,baseName,en){
 if(!form)return `<div class="loading-detail">${msg(en,'Загружаем исторические характеристики…','Loading past stats and types…')}</div>`;
 const current=formSnapshot(form),records=historySnapshots(form);
 const statHtml=xs=>xs.map(x=>`<span class="history-chip">${html(x.stat)} <b>${html(x.value)}</b></span>`).join('');
 const chipHtml=xs=>xs.map(x=>`<span class="history-chip">${html(x)}</span>`).join('');
 return `<h3>${msg(en,'История характеристик и типов','Stat and type history')}</h3>
 <p class="evo-intro">${html(varietyLabel(form.name,baseName))}. ${msg(en,'Текущие данные и исторические записи, которые предоставляет PokéAPI. Это не гарантирует полную историю каждой игры.','Current data and historical records exposed by PokéAPI. This is not a complete per-game changelog.')}</p>
 <section class="history-block"><div class="history-head"><strong>${msg(en,'Актуальные данные','Current data')}</strong><small>BST ${current?.bst??'—'}</small></div>
 <div class="history-chips">${statHtml(readableStats(form.stats))}</div><div class="history-chips">${chipHtml(readableTypes(form.types))}</div><div class="history-chips">${chipHtml(readableAbilities(form.abilities))}</div></section>
 ${records.map(x=>`<section class="history-block"><div class="history-head"><strong>${html(generationLabel(x.generation))}</strong><small>${msg(en,'Историческая запись','Historical record')}</small></div>
 ${x.stats?`<div class="history-chips">${statHtml(readableStats(x.stats))}</div>`:''}
 ${x.types?`<div class="history-chips">${chipHtml(readableTypes(x.types))}</div>`:''}
 ${x.abilities?`<div class="history-chips">${chipHtml(readableAbilities(x.abilities))}${x.abilities.some(a=>!a.ability)?`<span class="history-chip">${msg(en,'Отсутствовала одна из способностей','One ability slot was unavailable')}</span>`:''}</div>`:''}
 </section>`).join('')}
 ${!records.length?`<p class="helper-note">${msg(en,'Изменений характеристик, типов и способностей для этой формы в PokéAPI не зафиксировано.','PokéAPI does not list any past stat, type, or ability changes for this variety.')}</p>`:''}
 <p class="history-notice">${msg(en,'Отображаются только исторические записи источника. Если характеристика не показана в старой записи, это не означает, что её не существовало.','Only historical records from the source are shown. A missing stat in an old record does not imply that the stat did not exist.')}</p>`;
}