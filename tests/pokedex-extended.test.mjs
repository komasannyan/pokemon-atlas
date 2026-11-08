import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {normalizeVarieties,formSnapshot,formArtwork,varietyLabel,evolutionTree,evolutionRequirements,historySnapshots,generationLabel} from '../src/pokedex/pokedex-extended.js';
import {formSelector,evolutionPage,historyPage} from '../src/pokedex/pokedex-extended-ui.js';
const species={varieties:[{pokemon:{name:'charizard-mega-y'},is_default:false},{pokemon:{name:'charizard'},is_default:true},{pokemon:{name:'charizard-mega-x'},is_default:false}]};
const v=normalizeVarieties(species,'Charizard');
assert.equal(v.length,3);assert.equal(v[0].name,'Charizard');assert.equal(v[1].name,'Charizard — Mega X');
assert.equal(varietyLabel('raichu-alola','Raichu'),'Raichu — Alola');
assert.match(formSelector(species,'Charizard','charizard-mega-y',false,false,false),/data-form-slug="charizard-mega-y"/);
assert.match(formSelector(species,'Charizard','charizard-mega-y',false,false,false),/aria-pressed="true"/);
const raw={id:10034,name:'charizard-mega-x',height:17,weight:1105,stats:[{stat:{name:'hp'},base_stat:78},{stat:{name:'attack'},base_stat:130},{stat:{name:'defense'},base_stat:111},{stat:{name:'special-attack'},base_stat:130},{stat:{name:'special-defense'},base_stat:85},{stat:{name:'speed'},base_stat:100}],abilities:[{slot:1,ability:{name:'tough-claws'},is_hidden:false}],types:[{slot:2,type:{name:'dragon'}},{slot:1,type:{name:'fire'}}],sprites:{other:{'official-artwork':{front_default:'regular.png',front_shiny:'shiny.png'}}},past_stats:[{generation:{name:'generation-vi'},stats:[{stat:{name:'attack'},base_stat:120}]}],past_types:[{generation:{name:'generation-v'},types:[{slot:1,type:{name:'fire'}}]}]};
const m=formSnapshot(raw);assert.equal(m.bst,634);assert.deepEqual(m.types,['fire','dragon']);assert.equal(m.height,1.7);assert.equal(m.abilities[0].name,'Tough Claws');assert.equal(formArtwork(raw,true,'art'),'shiny.png');
const chain={chain:{species:{name:'eevee',url:'https://pokeapi.co/api/v2/pokemon-species/133/'},evolves_to:[{species:{name:'vaporeon',url:'https://pokeapi.co/api/v2/pokemon-species/134/'},evolution_details:[{trigger:{name:'use-item'},item:{name:'water-stone'}}]},{species:{name:'sylveon',url:'https://pokeapi.co/api/v2/pokemon-species/700/'},evolution_details:[{trigger:{name:'level-up'},min_affection:2,known_move_type:{name:'fairy'}}]}]}};
const rows=evolutionTree(chain);assert.equal(rows.length,3);assert.equal(rows[2].parent,133);assert.match(evolutionRequirements(rows[1].details)[0],/Water Stone/);assert.match(evolutionRequirements(rows[2].details)[0],/привязанность/);
assert.match(evolutionPage(chain,133,false),/data-open="700"/);assert.match(evolutionPage(chain,133,false),/уров/);
assert.deepEqual(historySnapshots(raw).map(x=>x.generation),['generation-v','generation-vi']);assert.equal(generationLabel('generation-vii'),'VII (7)');
assert.match(historyPage(raw,'Charizard',false),/634/);assert.match(historyPage(raw,'Charizard',true),/Historical record/);
assert.doesNotMatch(formSelector({varieties:[{pokemon:{name:'pikachu'},is_default:true}]},'Pikachu','pikachu',false,false,false),/undefined/);
// Exercise the actual asynchronous panel renderers with out-of-order form
// responses: a late response or failure must not replace the selected form.
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const renderers=app.slice(app.indexOf('const currentDetailIs='),app.indexOf('function renderGallery'));
const panel={innerHTML:''},requests=new Map();
const state={detail:{id:6},detailTab:'moves',detailRender:0};
const context={
 state,$:()=>panel,t:key=>key,esc:String,
 fetchPokemon:id=>new Promise((resolve,reject)=>requests.set(id,{resolve,reject})),
 ensureMoves:async()=>[],GAME_GROUPS:{'scarlet-violet':'Scarlet / Violet'},
 fetchEncounters:async()=>[],fetchRegionalDex:async()=>({}),
 locationMatrixHTML:()=> 'current location records',isEnglish:()=>true
};
runInNewContext(renderers,context);
const previous=context.renderLearnset({id:6,pokemonId:6});
const current=context.renderLearnset({id:6,pokemonId:10034});
requests.get(10034).resolve({moves:[]});await current;
assert.match(panel.innerHTML,/movesNone/);
requests.get(6).reject(Error('old form failed'));await previous;
assert.match(panel.innerHTML,/movesNone/,'an obsolete failure must not overwrite the current form');

state.detailTab='locations';
const oldLocations=context.renderLocations({id:6,pokemonId:6});
state.detailTab='overview';state.detailRender++;
panel.innerHTML='overview';
requests.get(6).resolve({});await oldLocations;
assert.equal(panel.innerHTML,'overview','a late location response must not replace another tab');
console.log('Pokémon Atlas: forms, evolutions, history and out-of-order detail responses passed');
