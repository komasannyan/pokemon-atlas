// Keep the existing storage keys, but merge each change with the latest saved
// map so an older browser tab cannot replace another tab's unrelated marks.
export function readProgress(storage,key){
 const raw=storage.getItem(key);
 if(raw===null)return {};
 const value=JSON.parse(raw);
 if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('Invalid guide progress');
 return value;
}
export function updateProgress(storage,key,entry,checked){
 const latest=readProgress(storage,key);
 if(checked)latest[entry]=true;else delete latest[entry];
 storage.setItem(key,JSON.stringify(latest));
 return latest;
}
