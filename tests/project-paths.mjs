// Static link checks for feature folders, HTML and service-worker PWA asset list.
import assert from 'node:assert/strict';
import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
function walk(p){return readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(p,e.name)):[join(p,e.name)]);}
const modules=walk(join(root,'src')).filter(f=>f.endsWith('.js'));
const testFiles=walk(join(root,'tests')).filter(f=>f.endsWith('.mjs'));
for(const file of [...modules,...testFiles]){
 const data=readFileSync(file,'utf8');
 const imports=/^\s*(?:import|export)\s+(?:(?:[^;\n]*?)\s+from\s*)?(['"])(\.{1,2}\/[^'"]+\.(?:js|json))\1/gm;
 const fileUrls=/new URL\(\s*(['"])(\.{1,2}\/[^'"]+\.(?:js|json))\1/g;
 const dynamicImports=/import\(\s*(['"])(\.{1,2}\/[^'"]+\.js)\1\s*\)/g;
 for(const regex of [imports,fileUrls,dynamicImports])for(const m of data.matchAll(regex))
   assert.ok(existsSync(resolve(dirname(file),m[2])),file+': broken reference '+m[2]);
}
const html=readFileSync(join(root,'index.html'),'utf8');
for(const m of html.matchAll(/(?:href|src)="\.\/([^"?]+)(?:\?[^"]*)?"/g))
 assert.ok(existsSync(join(root,m[1])),'HTML link missing: '+m[1]);
const sw=readFileSync(join(root,'sw.js'),'utf8');
const assets=sw.match(/const ASSETS=\[([^\]]+)\]/);
assert.ok(assets,'service-worker precache manifest missing');
const assetPaths=[...assets[1].matchAll(/'\.\/([^']*)'/g)].map(m=>m[1]);
assert.equal(new Set(assetPaths).size,assetPaths.length,'offline manifest must not contain duplicate paths');
for(const path of assetPaths)assert.ok(existsSync(join(root,path)),'offline file missing: '+path);
const offline=new Set(assetPaths);
for(const file of modules)assert.ok(offline.has(file.slice(root.length)),'module missing from offline manifest: '+file);
for(const m of html.matchAll(/href="\.\/(css\/[^"?]+)(?:\?[^"]*)?"/g))
 assert.ok(offline.has(m[1]),'stylesheet missing from offline manifest: '+m[1]);
assert.ok(existsSync(join(root,'src/guides/data/za/side-handbook.js')),'119 side quests must be preserved');
assert.ok(existsSync(join(root,'src/guides/data/za/main-handbook.js')),'42 story quests must be preserved');
const {ZA_SECTIONS}=await import('../src/guides/catalogs/za.js');
assert.equal(ZA_SECTIONS.side.length,119,'all side quests remain in the catalogue');
assert.equal(ZA_SECTIONS.main.length,42,'all story quests remain in the catalogue');
const collection=readFileSync(join(root,'src/collection/collection-games.js'),'utf8');
assert.match(collection,/\.\/src\/collection\/collection-dex\.json/,'runtime collection dex URL');
const team=readFileSync(join(root,'src/team/team-universe.js'),'utf8');
assert.match(team,/\.\/src\/team\//,'runtime team JSON URLs');
const app=readFileSync(join(root,'src/app.js'),'utf8');
assert.match(app,/\.\/guides\/guide-loader\.js/,'app must eagerly import only the lazy guide loader');
const loader=readFileSync(join(root,'src/guides/guide-loader.js'),'utf8');
assert.match(loader,/import\('\.\/guide-ui\.js'\)/,'loader must import guide UI dynamically');
assert.match(app,/\.\/pokedex\/moves\.js/);
console.log('Path integrity verified: '+modules.length+' modules, '+testFiles.length+' tests, HTML and PWA assets.');
