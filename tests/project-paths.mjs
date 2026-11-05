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
 for(const regex of [imports,fileUrls])for(const m of data.matchAll(regex))
   assert.ok(existsSync(resolve(dirname(file),m[2])),file+': broken reference '+m[2]);
}
const html=readFileSync(join(root,'index.html'),'utf8');
for(const m of html.matchAll(/(?:href|src)="\.\/([^"?]+)(?:\?[^"]*)?"/g))
 assert.ok(existsSync(join(root,m[1])),'HTML link missing: '+m[1]);
const sw=readFileSync(join(root,'sw.js'),'utf8');
const assets=sw.match(/const ASSETS=\[([^\]]+)\]/);
assert.ok(assets,'service-worker precache manifest missing');
for(const m of assets[1].matchAll(/'\.\/([^']*)'/g))
 assert.ok(existsSync(join(root,m[1])),'offline file missing: '+m[1]);
assert.ok(existsSync(join(root,'src/guides/za-side-handbook.js')),'119 side quests must be preserved');
assert.ok(existsSync(join(root,'src/guides/za-main-handbook.js')),'42 story quests must be preserved');
const guide=readFileSync(join(root,'src/guides/guides-v09.js'),'utf8');
assert.match(guide,/ZA_SIDE_HANDBOOK\[x\.id\]/,'side quest card integration must survive');
const collection=readFileSync(join(root,'src/collection/collection-games.js'),'utf8');
assert.match(collection,/\.\/src\/collection\/collection-dex\.json/,'runtime collection dex URL');
const team=readFileSync(join(root,'src/team/team-universe.js'),'utf8');
assert.match(team,/\.\/src\/team\//,'runtime team JSON URLs');
const app=readFileSync(join(root,'src/app.js'),'utf8');
assert.match(app,/\.\/guides\/guides-v09\.js/);
assert.match(app,/\.\/pokedex\/moves\.js/);
console.log('Path integrity verified: '+modules.length+' modules, '+testFiles.length+' tests, HTML and PWA assets.');
