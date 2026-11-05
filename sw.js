// Offline shell + cached data requests. Not a promise of offline access to every image or API result.
const SHELL='atlas-shell-v094';
const DATA='atlas-data-v094';
const IMAGES='atlas-images-v094';
const ASSETS=['./','./index.html','./styles.css','./styles-v02.css','./styles-v03.css','./manifest.webmanifest','./collection.css','./pokedex-v08.css','./styles-v09.css','./styles-guide-full.css','./src/pokedex-extended.js','./src/pokedex-extended-ui.js','./src/za-data.js','./src/za-main-data.js','./src/za-side-data.js','./src/za-side-locations.js','./src/za-side-steps.js','./src/za-dlc-data.js','./src/za-dlc-all-side.js','./src/za-tms-complete.js','./src/za-tms-enriched.js','./src/za-dlc-tm-acquisition.js','./src/za-verified-catalog.js','./src/za-wild-spawns.js','./src/za-mission-clarifications.js','./src/za-walkthrough-details.js','./src/za-guide-extras.js','./src/za-guide-handbook.js','./src/za-base-handbook.js','./src/za-main-handbook.js','./src/za-items-data.js','./src/locations-v09.js','./src/guides-v09.js','./src/collection-games.js','./src/collection-calc.js','./src/collection-ui.js','./src/collection-dex.json','./src/app.js','./src/data.js','./src/demo.js','./src/api.js','./src/constants.js','./src/i18n.js','./src/moves.js','./src/effects-ru.js','./src/abilities-ru-expanded.js','./src/team-data.js','./src/team-engine.js','./src/team-ui.js','./src/team-universe.js','./src/abilities.js','./src/game-availability.js','./src/translate-ru.js','./src/format-rules.json','./src/champions-learnsets.json','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(SHELL).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>![SHELL,DATA,IMAGES].includes(k)).map(k=>caches.delete(k)))),self.clients.claim()]));
});
async function limitCache(cache,max){const keys=await cache.keys();if(keys.length>max)await Promise.all(keys.slice(0,keys.length-max).map(k=>cache.delete(k)));}
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin===self.location.origin){
    event.respondWith(fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(SHELL).then(c=>c.put(req,copy));}return res;}).catch(()=>caches.match(req).then(x=>x||caches.match('./index.html'))));
    return;
  }
  const sprite=url.hostname==='raw.githubusercontent.com'&&url.pathname.includes('/PokeAPI/sprites/');
  const data=(url.hostname==='raw.githubusercontent.com'&&!sprite)||url.hostname==='pokeapi.co'||url.hostname==='play.pokemonshowdown.com';
  if(!sprite&&!data)return;
  const cacheName=sprite?IMAGES:DATA;
  event.respondWith((async()=>{
    const cache=await caches.open(cacheName);
    const cached=await cache.match(req);
    if(cached)return cached;
    try{
      const response=await fetch(req);
      if(response.ok){await cache.put(req,response.clone());limitCache(cache,sprite?150:48).catch(()=>{});}
      return response;
    }catch(e){return Response.error();}
  })());
});
