// On-demand, cached machine translation of game descriptions (not a verified translation).
// The manually reviewed Russian effect dictionaries always take precedence.
const STORAGE='atlas-ru-machine-v2';
const known=new Map();
try{for(const [k,v] of JSON.parse(localStorage.getItem(STORAGE)||'[]'))if(typeof k==='string'&&typeof v==='string')known.set(k,v);}catch{}
const queue=new Map();
const CYR=/[А-Яа-яЁё]/;
export const cleanSource=s=>String(s||'').replace(/\[(.*?)\]\{[^}]+\}/g,'$1').replace(/\$effect_chance/g,'?').replace(/[\f\r\n]+/g,' ').replace(/\s+/g,' ').trim();
export function cachedRussian(s){return known.get(cleanSource(s))||'';}
const decode=s=>String(s).replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&amp;/gi,'&').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>');
function splitText(s){
 const result=[];let line='';
 for(const sentence of (s.match(/[^.!?]+(?:[.!?]+|$)/g)||[s])){
  if(line.length+sentence.length>380&&line){result.push(line.trim());line='';}
  if(sentence.length>420){if(line){result.push(line.trim());line='';}for(let i=0;i<sentence.length;i+=400)result.push(sentence.slice(i,i+400).trim());}
  else line+=' '+sentence;
 }
 if(line.trim())result.push(line.trim());return result.slice(0,12);
}
function store(){try{localStorage.setItem(STORAGE,JSON.stringify([...known].slice(-700)));}catch{}}
/** May reject if external service is unavailable: callers MUST visibly signal failure. */
export async function translatedRussian(source){
 const text=cleanSource(source);if(!text)return '';
 if(CYR.test(text)&&!/[A-Za-z]{15}/.test(text))return text;
 if(known.has(text))return known.get(text);
 if(queue.has(text))return queue.get(text);
 const p=(async()=>{
  const out=[];
  for(const piece of splitText(text)){
   const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),11500);
   try{
    const url='https://api.mymemory.translated.net/get?langpair=en%7Cru&q='+encodeURIComponent(piece);
    const res=await fetch(url,{signal:ctl.signal});if(!res.ok)throw Error('Translation request failed');
    const json=await res.json();const result=decode(json.responseData?.translatedText||'');
    if(json.responseStatus!==200||!CYR.test(result)||/QUOTA EXCEEDED|MYMEMORY WARNING/i.test(result))throw Error('Translation unavailable');
    out.push(result);
   }finally{clearTimeout(timer);}
  }
  const translated=out.join(' ').trim();if(translated){known.set(text,translated);store();}return translated;
 })().finally(()=>queue.delete(text));
 queue.set(text,p);return p;
}
export const translationWarning='Автоматический перевод. Редкие механики могут быть переведены неточно; оригинал доступен ниже.';