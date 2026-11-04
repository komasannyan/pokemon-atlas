export const TYPES = {
  1:['normal','Обычный'],2:['fighting','Боевой'],3:['flying','Летающий'],4:['poison','Ядовитый'],
  5:['ground','Земляной'],6:['rock','Каменный'],7:['bug','Насекомый'],8:['ghost','Призрачный'],
  9:['steel','Стальной'],10:['fire','Огненный'],11:['water','Водный'],12:['grass','Травяной'],
  13:['electric','Электрический'],14:['psychic','Психический'],15:['ice','Ледяной'],
  16:['dragon','Драконий'],17:['dark','Тёмный'],18:['fairy','Волшебный']
};
export const TYPE_VALUES = Object.values(TYPES);
export const GENERATIONS = {
  1: 'Канто',2:'Джото',3:'Хоэнн',4:'Синно',5:'Юнова',6:'Калос',7:'Алола',8:'Галар',9:'Палдея'
};
export const STAT_NAMES = ['HP','Attack','Defense','Sp. Atk','Sp. Def','Speed'];
export const GAME_GROUPS = {
  'red-blue':'Red / Blue','yellow':'Yellow','gold-silver':'Gold / Silver','crystal':'Crystal',
  'ruby-sapphire':'Ruby / Sapphire','emerald':'Emerald','firered-leafgreen':'FireRed / LeafGreen',
  'diamond-pearl':'Diamond / Pearl','platinum':'Platinum','heartgold-soulsilver':'HeartGold / SoulSilver',
  'black-white':'Black / White','black-2-white-2':'Black 2 / White 2','x-y':'X / Y',
  'omega-ruby-alpha-sapphire':'Omega Ruby / Alpha Sapphire','sun-moon':'Sun / Moon',
  'ultra-sun-ultra-moon':'Ultra Sun / Ultra Moon','lets-go-pikachu-lets-go-eevee':"Let's Go Pikachu / Eevee",
  'sword-shield':'Sword / Shield','brilliant-diamond-and-shining-pearl':'Brilliant Diamond / Shining Pearl',
  'legends-arceus':'Legends: Arceus','scarlet-violet':'Scarlet / Violet'
};
export const MOVE_METHODS = {'level-up':'Уровень','machine':'TM / HM','egg':'Яйцо','tutor':'Наставник','form-change':'Смена формы'};
export const ART_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';
export const HOME_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home';
export const PIXEL_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
export const toTitle = value => String(value || '').replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
export const numberLabel = num => '#' + String(num).padStart(4,'0');
export function artUrl(id, shiny = false, style='art') {
  if (style === 'pixel') return `${PIXEL_BASE}/${shiny ? 'shiny/' : ''}${id}.png`;
  if (style === 'home') return `${HOME_BASE}/${shiny ? 'shiny/' : ''}${id}.png`;
  return `${ART_BASE}/${shiny ? 'shiny/' : ''}${id}.png`;
}
