// Verify offline safety in a fake Service Worker environment, including the GitHub Pages /pokemon-atlas/ scope.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const BASE='https://atlas.test/pokemon-atlas/';
const source=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
const cacheName=key=>source.match(new RegExp("const "+key+"='([^']+)'"))?.[1];
const SHELL=cacheName('SHELL'),DATA=cacheName('DATA'),IMAGES=cacheName('IMAGES');
assert.ok(SHELL&&DATA&&IMAGES);
const absolute=url=>new URL(url,BASE).href;
class FakeCache{
  constructor(){this.map=new Map();}
  async put(req,res){if(this.failWrites)throw new Error('Quota exceeded');this.map.set(typeof req==='string'?absolute(req):req.url,res.clone());}
  async match(req,{ignoreSearch=false}={}){
    if(this.failReads)throw new Error('Cache unavailable');
    const key=typeof req==='string'?absolute(req):req.url;
    let value=this.map.get(key);
    if(!value&&ignoreSearch){
      const wanted=new URL(key);
      for(const [k,v] of this.map){
        const saved=new URL(k);
        if(saved.origin===wanted.origin&&saved.pathname===wanted.pathname){value=v;break;}
      }
    }
    return value?.clone();
  }
  async addAll(urls){for(const url of urls)this.map.set(absolute(url),new Response('precached '+url));}
  async keys(){return [...this.map.keys()].map(url=>({url}));}
  async delete(req){return this.map.delete(typeof req==='string'?absolute(req):req.url);}
}
function environment(){
  const stores=new Map(),listeners={},network=new Map();
  const env={stores,listeners,network,online:true};
  const caches={
    open:async name=>{if(env.storageUnavailable)throw new Error('Cache disabled');if(!stores.has(name))stores.set(name,new FakeCache());return stores.get(name);},
    keys:async()=>[...stores.keys()],
    delete:async name=>stores.delete(name),
    match:async(req,options)=>{for(const c of stores.values()){const hit=await c.match(req,options);if(hit)return hit;}}
  };
  const fakeFetch=async req=>{
    if(!env.online)throw new TypeError('Network offline');
    const value=network.get(req.url);
    return value===undefined?new Response('not found',{status:404}):new Response(value,{status:200});
  };
  const self={location:new URL('sw.js',BASE),addEventListener:(type,fn)=>{listeners[type]=fn},skipWaiting(){},clients:{claim:async()=>{}}};
  vm.runInNewContext(source,{self,caches,fetch:fakeFetch,Response,URL,Request,Promise,console});
  return env;
}
async function lifecycle(env,type){
  const tasks=[];env.listeners[type]({waitUntil:p=>tasks.push(Promise.resolve(p))});
  await Promise.all(tasks);
}
async function dispatch(env,req){
  let promise=null;const tasks=[];
  env.listeners.fetch({request:req,respondWith:p=>{promise=Promise.resolve(p)},waitUntil:p=>tasks.push(Promise.resolve(p))});
  if(!promise)return{ignored:true};
  const res=await promise;
  await Promise.all(tasks);
  return{res};
}
const get=(path,mode='no-cors')=>({method:'GET',url:absolute(path),mode});
{
  const env=environment();
  env.network.set(absolute('src/app.js?v=098'),'export default 1');
  const {res}=await dispatch(env,get('src/app.js?v=098'));
  assert.equal(res.status,200);assert.equal(await res.text(),'export default 1');
  assert.ok(await env.stores.get(SHELL).match(get('src/app.js?v=098')));
}
{
  const env=environment();await lifecycle(env,'install');env.online=false;
  for(const path of ['src/app.js','css/styles.css','src/guides/guides-loader.js','src/guides/za-side-handbook.js','src/guides/sv-guide-data.js','src/guides/za-practical-guide.js']){
    const {res}=await dispatch(env,get(path+'?v=098'));
    assert.equal(res.status,200,path);
    assert.equal(await res.text(),'precached ./'+path,'offline asset must not become HTML');
  }
  const {res}=await dispatch(env,get('src/missing.js'));
  assert.equal(res.status,503);
  assert.match(res.headers.get('Content-Type'),/text\/plain/);
  assert.doesNotMatch(await res.text(),/index\.html/);
}
{
  const env=environment();await lifecycle(env,'install');env.online=false;
  for(const path of ['missing.js','css/missing.css','src/collection/absent.json']){
    const {res}=await dispatch(env,get(path));
    assert.equal(res.status,503,path);
  }
  const {res}=await dispatch(env,get('imaginary/page','navigate'));
  assert.equal(res.status,200);
  assert.equal(await res.text(),'precached ./index.html');
}
{
  const env=environment();env.online=false;
  assert.equal((await dispatch(env,get('page','navigate'))).res.status,503);
}
{
  const env=environment();
  assert.ok((await dispatch(env,{method:'POST',url:absolute('src/app.js'),mode:'cors'})).ignored);
  assert.ok((await dispatch(env,{method:'GET',url:'https://unrelated.org/track.js',mode:'cors'})).ignored);
}
{
  const env=environment();
  const sprite='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png';
  const api='https://pokeapi.co/api/v2/pokemon/1';
  env.network.set(sprite,'image data');env.network.set(api,'{"name":"bulbasaur"}');
  assert.equal((await dispatch(env,{method:'GET',url:sprite,mode:'no-cors'})).res.status,200);
  assert.equal((await dispatch(env,{method:'GET',url:api,mode:'cors'})).res.status,200);
  env.online=false;
  assert.equal(await (await dispatch(env,{method:'GET',url:sprite,mode:'no-cors'})).res.text(),'image data');
  assert.ok(env.stores.has(IMAGES)&&env.stores.has(DATA));
  assert.equal((await dispatch(env,{method:'GET',url:'https://pokeapi.co/api/v2/pokemon/2',mode:'cors'})).res.type,'error');
}
{
  const env=environment();
  for(const name of ['atlas-shell-v050','atlas-data-v050',SHELL,'someone-elses-app-v2'])env.stores.set(name,new FakeCache());
  await lifecycle(env,'activate');
  assert.deepEqual([...env.stores.keys()].sort(),[SHELL,'someone-elses-app-v2'].sort(),'cleanup must not delete other apps caches');
}
// Storage is optional: a valid online response must survive quota, private-mode
// storage restrictions and a broken cache entry.
for(const failure of ['open','read','write']){
  const env=environment(),cache=new FakeCache();
  env.stores.set(DATA,cache);
  env.storageUnavailable=failure==='open';
  cache.failReads=failure==='read';cache.failWrites=failure==='write';
  const url='https://pokeapi.co/api/v2/pokemon/25/';
  env.network.set(url,'{"name":"pikachu"}');
  const {res}=await dispatch(env,{method:'GET',url,mode:'cors'});
  assert.equal(res.status,200,`${failure}: online data must not depend on cache storage`);
  assert.deepEqual(await res.json(),{name:'pikachu'});
}
console.log('Service Worker: offline responses, cache isolation and online recovery when storage fails verified.');
