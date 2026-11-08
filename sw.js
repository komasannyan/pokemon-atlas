// Offline shell + cached data requests. Not a promise of offline access to every image or API result.
const SHELL='atlas-shell-v912';
const DATA='atlas-data-v912';
const IMAGES='atlas-images-v912';
const ASSETS=['./','./index.html','./css/styles.css','./css/styles-v02.css','./css/styles-v03.css','./manifest.webmanifest','./css/collection.css','./css/pokedex-v08.css','./css/styles-v09.css','./css/styles-guide-full.css','./src/pokedex/pokedex-extended.js','./src/pokedex/pokedex-extended-ui.js','./src/guides/za-data.js','./src/guides/za-main-data.js','./src/guides/za-side-data.js','./src/guides/za-side-locations.js','./src/guides/za-side-steps.js','./src/guides/za-dlc-data.js','./src/guides/za-dlc-all-side.js','./src/guides/za-tms-complete.js','./src/guides/za-tms-enriched.js','./src/guides/za-dlc-tm-acquisition.js','./src/guides/za-verified-catalog.js','./src/guides/za-wild-spawns.js','./src/guides/za-mission-clarifications.js','./src/guides/za-walkthrough-details.js','./src/guides/za-guide-extras.js','./src/guides/za-guide-handbook.js','./src/guides/za-base-handbook.js','./src/guides/za-main-handbook.js','./src/guides/za-side-handbook.js','./src/guides/za-items-data.js','./src/pokedex/locations-v09.js','./src/guides/guides-loader.js','./src/guides/guides-v09.js','./src/collection/collection-games.js','./src/collection/collection-calc.js','./src/collection/collection-ui.js','./src/collection/collection-dex.json','./src/app.js','./src/data.js','./src/demo.js','./src/api.js','./src/constants.js','./src/i18n.js','./src/pokedex/moves.js','./src/pokedex/effects-ru.js','./src/pokedex/abilities-ru-expanded.js','./src/team/team-data.js','./src/team/team-engine.js','./src/team/team-ui.js','./src/team/team-universe.js','./src/pokedex/abilities.js','./src/pokedex/game-availability.js','./src/pokedex/translate-ru.js','./src/team/format-rules.json','./src/team/champions-learnsets.json','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(SHELL).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('atlas-')&&![SHELL,DATA,IMAGES].includes(k)).map(k=>caches.delete(k)))),self.clients.claim()]));
});
async function limitCache(cache,max){const keys=await cache.keys();if(keys.length>max)await Promise.all(keys.slice(0,keys.length-max).map(k=>cache.delete(k)));}
const offlineResponse=()=>new Response('Offline: requested resource is not cached.',{
  status:503,statusText:'Service Unavailable',headers:{'Content-Type':'text/plain; charset=utf-8'}
});
// Network-first for same-origin resources. Never return HTML in place of a JS, CSS or JSON resource.
async function sameOrigin(event){
  const req=event.request;
  try{
    const res=await fetch(req);
    if(res.ok){
      const copy=res.clone();
      event.waitUntil(caches.open(SHELL).then(cache=>cache.put(req,copy)).catch(()=>{}));
    }
    return res;
  }catch(error){
    const cache=await caches.open(SHELL);
    const cached=await cache.match(req,{ignoreSearch:true});
    if(cached)return cached;
    if(req.mode==='navigate'){
      return (await cache.match('./index.html')) || (await cache.match('./')) || offlineResponse();
    }
    return offlineResponse();
  }
}
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin===self.location.origin){
    event.respondWith(sameOrigin(event));
    return;
  }
  const sprite=url.hostname==='raw.githubusercontent.com'&&url.pathname.includes('/PokeAPI/sprites/');
  const data=(url.hostname==='raw.githubusercontent.com'&&!sprite)||url.hostname==='pokeapi.co'||url.hostname==='play.pokemonshowdown.com';
  if(!sprite&&!data)return;
  const cacheName=sprite?IMAGES:DATA;
  event.respondWith((async()=>{
    let cache;
    try{
      cache=await caches.open(cacheName);
      const cached=await cache.match(req);
      if(cached)return cached;
    }catch{} // Cache Storage can be disabled or unavailable in private browsing.
    try{
      const response=await fetch(req);
      if(response.ok&&cache){
        const copy=response.clone();
        event.waitUntil(cache.put(req,copy).then(()=>limitCache(cache,sprite?150:48)).catch(()=>{}));
      }
      return response;
    }catch(e){return Response.error();}
  })());
});
