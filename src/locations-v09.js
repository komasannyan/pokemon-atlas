import {CORE_GAMES,recordedInVersion} from './game-availability.js';
import {COLLECTION_GAMES,gameFor,gameEntries} from './collection-games.js';
import {ZA_ZONES,ZA_DATA_SOURCES,zaLocations} from './za-data.js';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const txt=(en,ru,a)=>en?a:ru;
const urls={
 wild:'https://www.serebii.net/legendsz-a/wildzones.shtml',
 guide:'https://pokemondb.net/legends-z-a',
 dlc:'https://www.serebii.net/legendsz-a/hyperspacelumiose.shtml'
};
const exact={
 'gible':{'8':{level:'24–25',alpha:'5% (Alpha, не общий шанс спавна)',detail:'Wild Zone 8, отдельная точка появления в скалистой зоне'}},
 'machop':{'8':{level:'24–26',alpha:'5% (Alpha, не общий шанс спавна)',detail:'Wild Zone 8'}},
 'numel':{'8':{level:'23–24',alpha:'5% (Alpha, не общий шанс спавна)',detail:'Wild Zone 8'}},
 'camerupt':{'8':{level:'39–40',alpha:'100% (Alpha)',detail:'Wild Zone 8, фиксированная Alpha-встреча'}}
};
function regionFlags(p,dexes,game){
 if(!game||!dexes)return [];
 return game.areas.filter(a=>(dexes[a.id]||[]).some(([num,id])=>id===p.id))
  .map(a=>({name:a.ru,dex:a.id,dlc:a.dlc,number:(dexes[a.id]||[]).find(x=>x[1]===p.id)?.[0]}));
}
function mapCard(p,game,code,dexes,entries,api,en,active){
 const flags=regionFlags(p,dexes,game);
 const encounters=recordedInVersion(entries,code);
 const indices=new Set((api?.game_indices||[]).map(x=>x.version?.name));
 const later=p.gen>game.gen;
 const v=later?en?'Not introduced':'Ещё не существовал':encounters.length?en?'Wild encounter recorded':'Встреча подтверждена в API':flags.length?en?'Regional Pokédex entry':'Есть в региональном дексе':indices.has(code)?en?'Game index recorded':'Есть запись игрового индекса':en?'Data incomplete':'Данных недостаточно';
 return '<button type="button" class="avail-game '+(active?'selected ':'')+(encounters.length?'has-encounter':'')+'" data-game="'+esc(code)+'"><strong>'+esc(game.label.replace(/^Pokémon /,''))+'</strong><small>'+esc(v)+'</small></button>';
}
export function locationMatrixHTML({p,gameKey,dexes,entries=[],api=null,en=false}){
 const byKey=new Map(COLLECTION_GAMES.map(g=>[g.key,g]));
 const game=gameFor(gameKey);
 const flags=regionFlags(p,dexes,game);
 const wild=recordedInVersion(entries,gameKey);
 const generationExcluded=p.gen>game.gen;
 const zones=gameKey==='legends-za'?zaLocations(p.name):[];
 const side=CORE_GAMES.map(([key])=>byKey.get(key)).filter(Boolean).map(g=>mapCard(p,g,g.key,dexes,entries,api,en,g.key===gameKey)).join('');
 const status='<p class="availability-note">'+(en?'Regional Pokédex inclusion is NOT proof of a wild encounter or independent obtainability. Absence of API records is NOT proof a species cannot be obtained.':'Запись в региональном Pokédex НЕ подтверждает возможность самостоятельной поимки. Отсутствие записи в PokéAPI НЕ доказывает недоступность покемона.')+'</p>';
 let main='';
 if(generationExcluded)main='<p class="availability-info">'+(en?'This species was introduced in a later generation, so it does not exist in this game.':'Этот вид появился только в более позднем поколении и в выбранной игре ещё не существовал.')+'</p>';
 else{
 const flagMarkup=flags.map(a=>'<span class="avail-chip">'+esc(a.name)+' #'+String(a.number).padStart(3,'0')+(a.dlc?' · DLC':'')+'</span>').join('');
 main='<div class="availability-summary"><h3>'+esc(game.label)+'</h3><div class="avail-chips">'+(flagMarkup||'<span class="avail-chip">'+(en?'No regional Pokédex entry':'Нет записи в региональном дексе')+'</span>')+'</div></div>';
 if(gameKey==='legends-za'){
   main+='<p class="availability-help">'+(en?'The map below lists verified Wild Zone species pools. Some Pokémon are obtained through quests, trades, evolution, special encounters or the Mega Dimension DLC.':'Ниже — проверенные списки покемонов в Wild Zones. Другие виды могут получаться по сюжету, эволюцией, обменом, через особые встречи или в Mega Dimension.')+'</p>';
   if(zones.length)main+='<div class="location-places">'+zones.map(z=>{
     const info=exact[p.name.toLowerCase()]?.[String(z.name.split(' ')[2])];
     const when=z.time==='day-hint'?(en?'Daytime often; varies by location':'Чаще днём; зависит от точки'):z.time==='night-hint'?(en?'Nighttime often; varies by location':'Чаще ночью; зависит от точки'):(en?'Day/night: not specified':'Время суток: не уточнено');
     return '<article class="avail-location"><div><b>'+esc(z.name)+'</b><small>'+(en?'Opens during main mission':'Открывается в основном задании')+' №'+z.unlock+'</small></div><p>'+esc(info?.detail||'Wild Zone '+z.name.split(' ')[2])+'. '+esc(when)+'</p><p>'+(en?'Level':'Уровень')+': <b>'+esc(info?.level||'—')+'</b> · '+(en?'Spawn rate':'Шанс появления')+': <b>'+(en?'Not published':'Не опубликован')+'</b>'+(info?.alpha?' · Alpha: '+esc(info.alpha):'')+'</p><a href="'+esc(z.source)+'" target="_blank" rel="noopener noreferrer">'+(en?'Source: Wild Zones':'Источник: Wild Zones')+'</a></article>';
    }).join('')+'</div>';
   else main+='<p class="availability-info">'+(en?'No verified Wild Zone spawn in the current dataset. This does not mean the Pokémon is unavailable. Check special encounters, quests, trades, evolution and DLC.':'В проверенной таблице Wild Zones встреча не указана. Это не означает недоступность: проверь задания, подарки, эволюцию, обмены и DLC.')+'</p>';
   if(flags.some(x=>x.dex===35))main+='<p class="availability-info">'+(en?'Listed in the Mega Dimension Hyperspace Pokédex; exact portals and appearance conditions depend on the DLC.':'Присутствует в Hyperspace Pokédex дополнения Mega Dimension. Условия конкретного портала требуют отдельной проверки.')+' <a href="'+urls.dlc+'" target="_blank" rel="noopener noreferrer">'+(en?'Hyperspace guide':'Справочник Hyperspace')+'</a></p>';
   main+='<p class="availability-help">'+(en?'Time cycle: day 04:00–20:00, night 20:00–04:00 (in-game); sit on a bench to skip cycles. A specific spawn chance is shown only when verified.':'В Z-A день: 04:00–20:00, ночь: 20:00–04:00 по внутриигровому времени. На скамейке можно сменить цикл; спавны обновятся. Процент появления указывается только при наличии подтверждённых данных.')+'</p><a href="'+ZA_DATA_SOURCES.day+'" target="_blank" rel="noopener noreferrer">'+(en?'Day/night mechanics':'Механика дня и ночи')+'</a>';
   main+='<div class="avail-guide-jump"><button type="button" data-guide-go="true">'+(en?'Open Legends: Z-A walkthrough and items':'Открыть гайд Legends: Z-A и предметы')+'</button></div>';
 }else if(wild.length){
   main+='<div class="location-places">'+wild.map(x=>'<article class="avail-location"><b>'+esc(x.location.replaceAll('-',' '))+'</b><p>'+(en?'Level':'Уровень')+': '+esc(x.min==null?'—':x.min===x.max?x.min:x.min+'–'+x.max)+' · '+(en?'Encounter methods':'Методы')+': '+esc(x.methods.join(', ')||'—')+'</p><p>'+(en?'Recorded max chance':'Максимальная вероятность в записи')+': '+esc(x.chance??'—')+'%</p></article>').join('')+'</div><p class="availability-help">'+(en?'Wild encounter records from PokéAPI only; gifts, transfers, DLC and special encounters may be missing.':'Показаны только встречи из PokéAPI. Подарки, переносы, события, DLC и некоторые особые методы получения могут отсутствовать.')+'</p>';
 }else main+='<p class="availability-info">'+(en?'No verified wild encounter record for this game. The data do not establish whether this Pokémon is obtainable via other methods.':'Нет подтверждённой записи о дикой встрече для этой игры. Возможность получения другими способами пока не проверена.')+'</p>';
 }
 return '<div class="availability-v09"><h3>'+(en?'Pokémon by game':'Покемон во всех играх')+' <small>· '+CORE_GAMES.length+'</small></h3>'+status+'<div class="availability-game-grid">'+side+'</div><div class="availability-selected">'+main+'</div></div>';
}
