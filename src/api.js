const BASE='https://pokeapi.co/api/v2';
const memory=new Map();
const pending=new Map();
async function getJson(path){
  if(memory.has(path))return memory.get(path);
  if(pending.has(path))return pending.get(path);
  const request=(async()=>{
    const ctl=new AbortController(); const timer=setTimeout(()=>ctl.abort(),16000);
    try{
      const response=await fetch(BASE+path,{signal:ctl.signal});
      if(!response.ok)throw new Error('HTTP '+response.status);
      const data=await response.json();memory.set(path,data);return data;
    }finally{clearTimeout(timer);}
  })();
  pending.set(path,request);
  try{return await request;}finally{pending.delete(path);}
}
export const fetchPokemon=id=>getJson(`/pokemon/${encodeURIComponent(id)}/`);
export const fetchEncounters=id=>getJson(`/pokemon/${encodeURIComponent(id)}/encounters/`);
export const fetchSpecies=id=>getJson(`/pokemon-species/${encodeURIComponent(id)}/`);
export const fetchMove=nameOrId=>getJson(`/move/${encodeURIComponent(nameOrId)}/`);
export const fetchAbility=nameOrId=>getJson(`/ability/${encodeURIComponent(nameOrId)}/`);

export const fetchEvolutionChain=id=>getJson(`/evolution-chain/${encodeURIComponent(id)}/`);
