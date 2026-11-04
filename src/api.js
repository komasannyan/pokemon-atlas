const BASE='https://pokeapi.co/api/v2';
const memory=new Map();
async function getJson(path){
  if(memory.has(path))return memory.get(path);
  const ctl=new AbortController(); const timer=setTimeout(()=>ctl.abort(),16000);
  try{
    const response=await fetch(BASE+path,{signal:ctl.signal});
    if(!response.ok)throw new Error('HTTP '+response.status);
    const data=await response.json();memory.set(path,data);return data;
  }finally{clearTimeout(timer);}
}
export const fetchPokemon=id=>getJson(`/pokemon/${id}/`);
export const fetchEncounters=id=>getJson(`/pokemon/${id}/encounters/`);
export const fetchSpecies=id=>getJson(`/pokemon-species/${id}/`);
