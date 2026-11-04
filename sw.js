// Offline shell + cached data requests. Not a promise of offline access to every image or API result.
const SHELL='atlas-shell-v031';
const DATA='atlas-data-v031';
const IMAGES='atlas-images-v031';
const ASSETS=['./','./index.html','./styles.css','./styles-v02.css','./styles-v03.css','./manifest.webmanifest','./src/app.js','./src/data.js','./src/demo.js','./src/api.js','./src/constants.js','./src/i18n.js','./src/moves.js','./src/effects-ru.js','./src/team-data.js','./src/team-engine.js','./src/team-ui.js','./icons/icon-192.png','./icons/icon-512.png'];
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
  const data=(url.hostname==='raw.githubusercontent.com'&&!sprite)||url.hostname==='pokeapi.co';
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