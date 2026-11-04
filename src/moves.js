import {parseCSV} from './data.js';
import {TYPES,toTitle} from './constants.js';

const CSV_BASE='https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/';
const STORE='atlas-moves-v2';
const TYPE_BY_ID={...Object.fromEntries(Object.entries(TYPES).map(([id,[key]])=>[Number(id),key])),10002:'shadow'};
const CLASS={1:'status',2:'physical',3:'special'};

export const RU_MOVE_NAMES={
 'earthquake':'Землетрясение','thunderbolt':'Удар молнии','thunder':'Гром','flamethrower':'Огнемёт','fire-blast':'Огненный взрыв',
 'ice-beam':'Ледяной луч','blizzard':'Метель','surf':'Сёрфинг','hydro-pump':'Гидронасос','water-gun':'Водяная пушка',
 'tackle':'Толчок','quick-attack':'Быстрая атака','protect':'Защита','detect':'Обнаружение','substitute':'Подмена',
 'dragon-claw':'Коготь дракона','dragon-pulse':'Драконий импульс','dragon-dance':'Танец дракона','swords-dance':'Танец мечей',
 'shadow-ball':'Теневой шар','psychic':'Психокинез','psychic-noise':'Психический шум','dark-pulse':'Тёмный импульс',
 'crunch':'Хруст','bite':'Укус','hyper-beam':'Гиперлуч','gigaton-hammer':'Гигантский молот',
 'make-it-rain':'Золотой дождь','nasty-plot':'Злой замысел','close-combat':'Ближний бой','aura-sphere':'Аурасфера',
 'moonblast':'Лунный взрыв','dazzling-gleam':'Ослепительный блеск','iron-head':'Железная голова','flash-cannon':'Световая пушка',
 'rock-slide':'Камнепад','stone-edge':'Каменное лезвие','stealth-rock':'Камни-ловушки',
 'rapid-spin':'Быстрое вращение','roost':'Насест','defog':'Рассеивание','brave-bird':'Храбрая птица',
 'body-press':'Пресс корпусом','u-turn':'Разворот','volt-switch':'Вольт-переключатель','knock-off':'Выбивание',
 'encore':'На бис','poison-jab':'Ядовитый удар','will-o-wisp':'Блуждающий огонёк','toxic':'Токсин',
 'sleep-powder':'Сонный порошок','leech-seed':'Семя-пиявка','solar-beam':'Солнечный луч',
 'extreme-speed':'Сверхскорость','sucker-punch':'Удар исподтишка','first-impression':'Первое впечатление',
 'icy-wind':'Ледяной ветер','air-slash':'Воздушный разрез','flame-charge':'Огненный рывок'
};

function fromCache(){try {const record=JSON.parse(localStorage.getItem(STORE));if(record?.length>=800)return record;}catch{}return null;}
function saveCache(rows){try{localStorage.setItem(STORE,JSON.stringify(rows));}catch{}}
let promise=null;
async function fetchCsv(name){const ctl=new AbortController(),timeout=setTimeout(()=>ctl.abort(),22000);try{const response=await fetch(CSV_BASE+name,{signal:ctl.signal});if(!response.ok)throw Error(`HTTP ${response.status}: ${name}`);return parseCSV(await response.text());}finally{clearTimeout(timeout);}}
export function fetchMoveDex(){
  if(promise)return promise;
  const cache=fromCache();if(cache){promise=Promise.resolve(cache);return promise;}
  promise=Promise.all([fetchCsv('moves.csv'),fetchCsv('move_names.csv'),fetchCsv('move_effect_prose.csv')]).then(([moves,names,effects])=>{
    const englishNames=new Map(names.filter(r=>r.local_language_id==='9').map(r=>[+r.move_id,r.name]));
    const prose=new Map(effects.filter(r=>r.local_language_id==='9').map(r=>[+r.move_effect_id,r.short_effect]));
    const result=moves.map(r=>({
      id:+r.id,slug:r.identifier,name:englishNames.get(+r.id)||toTitle(r.identifier),gen:+r.generation_id,
      type:TYPE_BY_ID[+r.type_id]||'unknown',category:CLASS[+r.damage_class_id]||'status',
      power:!r.power||r.power==='0'?null:+r.power,accuracy:!r.accuracy||r.accuracy==='0'?null:+r.accuracy,pp:r.pp===''?null:+r.pp,
      effectChance:r.effect_chance===''?null:+r.effect_chance,
      effect:prose.get(+r.effect_id)||''
    })).filter(r=>r.id>0).sort((a,b)=>a.id-b.id);
    if(result.length<800)throw Error('Incomplete move database');
    saveCache(result);return result;
  }).catch(e=>{promise=null;throw e;});
  return promise;
}
export const getRuMoveName=slug=>RU_MOVE_NAMES[slug]||'';
export const pickText=(entries,prop='effect',language='en')=>entries?.find(x=>x.language?.name===language&&x[prop])?.[prop]||'';
export const cleanText=text=>String(text||'').replace(/[\f\n\r]+/g,' ').replace(/\s+/g,' ').trim();
export function describeEffect(text, chance){return cleanText(text).replace(/\$effect_chance\b/g,chance==null?'?':String(chance));}
