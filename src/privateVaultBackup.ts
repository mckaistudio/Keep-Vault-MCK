import type {SecretRecord} from './secureVault';
import {makeManifestBackup,verifyManifestBackup} from './backupManifest.ts';

const FORMAT='keep-vault-mck-private-records-v1';
function validate(records:unknown):SecretRecord[]{
 if(!Array.isArray(records)||records.length>10000)throw new Error('Invalid private backup records.');
 const seen=new Set<string>();
 return records.map((item:unknown)=>{
  if(!item||typeof item!=='object')throw new Error('Invalid private record.');
  const r=item as Record<string,unknown>;
  if(typeof r.id!=='string'||r.id.length>160||!r.id||seen.has(r.id)||typeof r.name!=='string'||!r.name.trim()||r.name.length>160||typeof r.ciphertext!=='string'||r.ciphertext.length>1000000||!r.ciphertext||typeof r.createdAt!=='string'||!Number.isFinite(Date.parse(r.createdAt)))throw new Error('Invalid private record.');
  seen.add(r.id);
  return {id:r.id,name:r.name,ciphertext:r.ciphertext,createdAt:r.createdAt};
 });
}
export async function exportPrivateRecords(records:SecretRecord[]):Promise<string>{return makeManifestBackup(JSON.stringify({format:FORMAT,records:validate(records)}));}
export async function parsePrivateRecords(file:string):Promise<SecretRecord[]>{const plain=await verifyManifestBackup(file);let data:unknown;try{data=JSON.parse(plain);}catch{throw new Error('Invalid private backup JSON.');}if(!data||typeof data!=='object'||(data as Record<string,unknown>).format!==FORMAT)throw new Error('Unsupported private backup.');return validate((data as Record<string,unknown>).records);}
export function mergePrivateRecords(current:SecretRecord[],incoming:SecretRecord[]):SecretRecord[]{const ids=new Set(current.map(x=>x.id));return validate(incoming).filter(x=>!ids.has(x.id));}
