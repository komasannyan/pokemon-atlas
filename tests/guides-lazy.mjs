// Verifies Z-A guides are excluded from eager imports and that the loader handles retries and concurrent requests.
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {dirname,join,normalize} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createLazyGuides} from '../src/guides/guide-loader.js';

const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(join(root,p),'utf8');
const seen=new Set(),stack=['src/app.js'];
while(stack.length){
  const file=stack.pop();
  if(seen.has(file))continue;
  seen.add(file);
  for(const match of read(file).matchAll(/^\s*import\s[^;\n]*?from\s+['"](\.{1,2}\/[^'"]+)['"]/gm))
    stack.push(normalize(join(dirname(file),match[1])).replaceAll('\\','/'));
}
const eager=[...seen].filter(p=>p.startsWith('src/guides/')).sort();
assert.deepEqual(eager,['src/guides/guide-loader.js','src/guides/data/za/world.js','src/guides/data/za/wild-spawns.js'].sort());
const app=read('src/app.js'),loader=read('src/guides/guide-loader.js');
assert.doesNotMatch(app,/\b(?:setupGuides|refreshGuides|openGuideTab)\b/,'app must use lazy abstraction');
assert.match(app,/createLazyGuides/);
assert.match(app,/data-guides-retry/);
const dynamic=loader.match(/import\('(\.\/[^']+)'\)/)?.[1];
assert.ok(dynamic&&existsSync(join(root,'src/guides',dynamic)),'dynamic guide module must exist');
assert.match(read('sw.js'),/\.\/src\/guides\/guide-loader\.js/,'offline loader should be available');

const fakeModule=log=>({
  setupGuides:opts=>log.push(['setup',opts]),
  refreshGuides:()=>log.push(['refresh']),
  openGuideTab:(tab,game)=>log.push(['open',tab,game])
});
const options={pokemonByName:()=>[],onOpenPokemon(){}};
{
  const log=[],statuses=[];let loads=0;
  const guides=createLazyGuides({options,load:async()=>{loads++;return fakeModule(log)},onStatus:s=>statuses.push(s)});
  guides.refresh();
  assert.equal(loads,0);
  assert.deepEqual(log,[]);
  await Promise.all([guides.show(),guides.show(),guides.ensure()]);
  assert.equal(loads,1,'concurrent callers must share a download');
  assert.deepEqual(log,[['setup',options]]);
  assert.deepEqual(statuses,['loading','ready']);
  guides.refresh();await guides.show();
  assert.deepEqual(log.slice(1),[['refresh'],['refresh']]);
  assert.equal(loads,1,'reopening must not reimport');
}
{
  const log=[];const guides=createLazyGuides({options,load:async()=>fakeModule(log)});
  guides.openTab('main','legends-za');
  await guides.show();
  assert.deepEqual(log.map(x=>x[0]),['setup','open']);
  assert.deepEqual(log[1],['open','main','legends-za']);
  guides.openTab('items','legends-za');
  assert.deepEqual(log[2],['open','items','legends-za']);
}
{
  const log=[],statuses=[];let attempts=0;
  const guides=createLazyGuides({options,load:async()=>{if(++attempts===1)throw Error('offline');return fakeModule(log)},onStatus:s=>statuses.push(s)});
  guides.openTab('main','legends-za');
  assert.equal(await guides.show(),null,'failed imports show error and can retry');
  assert.deepEqual(statuses,['loading','error']);
  assert.equal(guides.isLoaded(),false);
  await guides.show();
  assert.equal(attempts,2);
  assert.deepEqual(statuses,['loading','error','loading','ready']);
  assert.deepEqual(log.map(x=>x[0]),['setup','open']);
}
{
  const log=[];const guides=createLazyGuides({options,load:async()=>fakeModule(log),onStatus(){throw Error('observer')}});
  await guides.show();
  assert.ok(guides.isLoaded());
}
console.log('Lazy guide loading: eager dependencies, concurrent loading, tab selection and retry verified.');
