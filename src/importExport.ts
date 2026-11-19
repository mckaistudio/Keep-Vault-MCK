import type {Note,Category} from './store.ts';
import {categories,normalizeTags} from './store.ts';
export type ImportCandidate={title:string;body:string;category:Category;tags:string[];source:string;sourceId:string};
export type ImportReview={ready:ImportCandidate[];duplicates:ImportCandidate[];invalid:{source:string;reason:string}[]};
const limit=5*1024*1024;
export function parseKeepJson(text:string,filename:string):ImportCandidate{
  if(new TextEncoder().encode(text).length>limit)throw new Error('File exceeds 5 MB limit.');
  let obj:unknown;try{obj=JSON.parse(text);}catch{throw new Error('Invalid JSON file.');}
  if(!obj||typeof obj!=='object'||Array.isArray(obj))throw new Error('Expected a Google Keep note object.');
  const data=obj as Record<string,unknown>;
  if(typeof data.title!=='string'&&typeof data.textContent!=='string'&&!Array.isArray(data.listContent))throw new Error('No supported Keep note fields.');
  const lines:Array<string>=[];
  if(typeof data.textContent==='string')lines.push(data.textContent);
  if(Array.isArray(data.listContent))for(const item of data.listContent){if(item&&typeof item==='object'&&typeof (item as Record<string,unknown>).text==='string'){const v=item as {text:string;isChecked?:boolean};lines.push(`${v.isChecked?'[x]':'[ ]'} ${v.text}`);}}
  const title=String(data.title??'').trim().slice(0,160)||filename.replace(/\.json$/i,'').slice(0,160)||'Imported note';
  const body=lines.join('\n').slice(0,200000);
  if(!title.trim()&&!body.trim())throw new Error('Empty note.');
  const tags=Array.isArray(data.labels)?normalizeTags(data.labels.map(x=>typeof x==='string'?x:(x&&typeof x==='object'&&typeof (x as Record<string,unknown>).name==='string'?(x as {name:string}).name:'')).filter(Boolean).join(',')):[];
  const sourceId=typeof data.id==='string'?data.id:filename;
  return {title,body,category:'PMC',tags,source:filename,sourceId};
}
export function parseVaultBackup(text:string):ImportCandidate[]{
  let data:unknown;try{data=JSON.parse(text);}catch{throw new Error('Invalid backup JSON.');}
  if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('Invalid backup format.');
  const root=data as Record<string,unknown>;
  if(root.format!=='keep-vault-mck-backup-v1'||!Array.isArray(root.notes))throw new Error('Not a Keep Vault MCK backup.');
  if(root.notes.length>10000)throw new Error('Backup has too many notes.');
  return root.notes.map((value,i)=>{if(!value||typeof value!=='object')throw new Error(`Invalid note at position ${i+1}.`);const n=value as Record<string,unknown>;
    if(typeof n.title!=='string'||!n.title.trim()||typeof n.body!=='string'||typeof n.category!=='string'||!Object.hasOwn(categories,n.category))throw new Error(`Invalid note at position ${i+1}.`);
    return {title:n.title.slice(0,160),body:n.body.slice(0,200000),category:n.category as Category,tags:normalizeTags(Array.isArray(n.tags)?n.tags.filter((x):x is string=>typeof x==='string').join(','):''),source:'Vault backup',sourceId:typeof n.code==='string'?n.code:String(i)};
  });
}
export function fingerprint(note:Pick<ImportCandidate,'title'|'body'>):string{return `${note.title.trim().toLocaleLowerCase()}\u0000${note.body.trim().replace(/\r\n/g,'\n')}`;}
export function reviewImport(candidates:ImportCandidate[],existing:Note[]):ImportReview{
  const seen=new Set(existing.map(fingerprint));const ready:ImportCandidate[]=[],duplicates:ImportCandidate[]=[],invalid:{source:string;reason:string}[]=[];
  for(const candidate of candidates){if(!candidate.title.trim()){invalid.push({source:candidate.source,reason:'Missing title'});continue;}
    const key=fingerprint(candidate);if(seen.has(key)){duplicates.push(candidate);continue;}seen.add(key);ready.push(candidate);
  }return {ready,duplicates,invalid};
}
export function exportVault(notes:Note[]):string{return JSON.stringify({format:'keep-vault-mck-backup-v1',exportedAt:new Date().toISOString(),notes:notes.map(n=>({code:n.code,title:n.title,body:n.body,category:n.category,tags:n.tags??[],pinned:!!n.pinned,archived:!!n.archived,createdAt:n.createdAt,updatedAt:n.updatedAt}))},null,2);}
