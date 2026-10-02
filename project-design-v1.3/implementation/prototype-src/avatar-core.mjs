export const BASES = ['human', 'dragon', 'bird', 'robot'];
export const DEFAULT_AVATAR = Object.freeze({version:2,base:'dragon',color:'teal',skinTone:'warm',hairColor:'dark',hair:'none',hat:'none',moustache:'none',outfit:'teal',glasses:false});
export const OPTIONS = Object.freeze({color:['teal','violet','amber'],skinTone:['porcelain','sand','warm','bronze','umber','deep'],hairColor:['dark','brown','copper'],hair:['none','curl','crest'],hat:['none','cap','bucket','crown'],moustache:['none','soft','wide'],outfit:['teal','violet','amber']});
export function normalizeAvatar(raw) {
  const v={...DEFAULT_AVATAR};
  if (!raw || typeof raw!=='object') return v;
  v.base=BASES.includes(raw.base)?raw.base:'human';
  for (const [k,opts] of Object.entries(OPTIONS)) if(opts.includes(raw[k]))v[k]=raw[k];
  v.glasses=raw.glasses===true;
  if(v.base==='robot'&&v.hair==='curl')v.hair='crest';
  return v;
}
export function migrateLegacyAvatar(raw) {
  if(raw?.version===2)return normalizeAvatar(raw);
  const oldHair={crop:'crest',curl:'curl',bob:'curl',long:'curl',none:'none'};
  const oldColor=['teal','violet','amber'];
  return normalizeAvatar({...DEFAULT_AVATAR,base:'human',skinTone:OPTIONS.skinTone[raw?.skinId]||'warm',hairColor:OPTIONS.hairColor[raw?.hairColorId]||'dark',hair:oldHair[raw?.hairId]||'none',outfit:oldColor[raw?.outfitColorId]||'teal',hat:raw?.accessoryId==='cap'?'cap':'none',glasses:raw?.accessoryId==='glasses'});
}
export function changeBase(avatar,base) {
  return normalizeAvatar({...avatar,base});
}
export function readAvatar(storage,key='shomara-design-avatar-v2') {
  try { const raw=storage.getItem(key);return {avatar:raw?migrateLegacyAvatar(JSON.parse(raw)):{...DEFAULT_AVATAR},error:null};}
  catch {return {avatar:{...DEFAULT_AVATAR},error:'ظاهر قبلی خوانده نشد؛ ظاهر پیش‌فرض باز شد.'};}
}
export function writeAvatar(storage,avatar,key='shomara-design-avatar-v2') {
  try { storage.setItem(key,JSON.stringify(normalizeAvatar(avatar)));return {ok:true,error:null};}
  catch {return {ok:false,error:'ظاهر ذخیره نشد. دوباره امتحان کن؛ تغییرها هنوز اینجا هستند.'};}
}
export function lessonResult(attempts,total) {
  const first=attempts.filter(a=>a.firstTryCorrect).length;
  return {answered:attempts.length,total,firstTryCorrect:first,accuracy:total?Math.round(first/total*100):0};
}
