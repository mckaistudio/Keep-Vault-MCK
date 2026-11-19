import type {ImportCandidate} from './importExport.ts';
import {categories,normalizeTags} from './store.ts';

/** Explicit user-selected extension export. Never imports directly or modifies storage. */
export function parseExtensionCapture(text:string,filename:string):ImportCandidate{
 if(new TextEncoder().encode(text).length>5*1024*1024)throw new Error('Capture file exceeds 5 MB.');
 let input:unknown;try{input=JSON.parse(text)}catch{throw new Error('Invalid capture JSON.')}
 if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Invalid capture object.');
 const data=input as Record<string,unknown>;
 if(typeof data.title!=='string'||!data.title.trim()||data.title.length>160)throw new Error('Invalid capture title.');
 if(typeof data.body!=='string'||!data.body.trim()||data.body.length>20000)throw new Error('Invalid capture text.');
 if(typeof data.category!=='string'||!Object.hasOwn(categories,data.category))throw new Error('Invalid capture category.');
 if(typeof data.sourceUrl!=='string'||data.sourceUrl.length>2048)throw new Error('Invalid capture source.');
 let source:URL;try{source=new URL(data.sourceUrl)}catch{throw new Error('Invalid capture source URL.')}
 if(!['http:','https:'].includes(source.protocol)||source.username||source.password||source.search||source.hash)throw new Error('Capture source must be a clean web URL.');
 if(typeof data.capturedAt!=='string'||!/^\d{4}-\d\d-\d\dT/.test(data.capturedAt)||!Number.isFinite(Date.parse(data.capturedAt)))throw new Error('Invalid capture timestamp.');
 if(!Array.isArray(data.tags)||data.tags.length>20||data.tags.some(x=>typeof x!=='string'||x.length>40))throw new Error('Invalid capture tags.');
 return {title:data.title.trim(),body:data.body,category:data.category as ImportCandidate['category'],tags:normalizeTags(data.tags.join(',')),source:filename,sourceId:source.toString()};
}
