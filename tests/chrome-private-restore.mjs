import http from 'node:http';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const fixture=await readFile('private-restore-fixture.json','utf8');
const version=await new Promise((resolve,reject)=>http.get('http://127.0.0.1:9444/json/version',res=>{let data='';res.on('data',c=>data+=c);res.on('end',()=>resolve(JSON.parse(data)))}).on('error',reject));
const ws=new WebSocket(version.webSocketDebuggerUrl);
const pending=new Map();let seq=0;
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id)}};
await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject});
function call(method,params={},sessionId){return new Promise((resolve,reject)=>{const id=++seq;pending.set(id,resolve);ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));setTimeout(()=>{if(pending.has(id)){pending.delete(id);reject(Error('CDP timeout'))}},15000)})}
let targetId;
try{
 targetId=(await call('Target.createTarget',{url:'http://127.0.0.1:9188/'})).result.targetId;
 const sessionId=(await call('Target.attachToTarget',{targetId,flatten:true})).result.sessionId;
 async function run(expression){const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},sessionId);if(r.result.exceptionDetails)throw Error(JSON.stringify(r.result.exceptionDetails));return r.result.result.value}
 await new Promise(r=>setTimeout(r,8500));
 assert.equal(await run('(()=>{const b=[...document.querySelectorAll("button")].find(x=>x.innerText.includes("Private Vault"));if(!b)return false;b.click();return true})()'),true);
 await new Promise(r=>setTimeout(r,2000));
 await run('window.confirm=()=>true');
 const expression='(()=>{const input=document.querySelector("input[type=file]");if(!input)return "MISSING";const file=new File(['+JSON.stringify(fixture)+'],"restore-test.json",{type:"application/json"});const transfer=new DataTransfer();transfer.items.add(file);input.files=transfer.files;input.dispatchEvent(new Event("change",{bubbles:true}));return "UPLOADED"})()';
 assert.equal(await run(expression),'UPLOADED');
 await new Promise(r=>setTimeout(r,3500));
 const message=await run('document.querySelector("[role=status]")?.innerText??""');
 console.log('Restore result:',message);
 assert.match(message,/Restored 1 encrypted records/);
 assert.equal(await run('document.body.innerText.includes("Browser Recovery Fixture")'),true);
 console.log('PASS: Chrome private backup import and confirmation');
}finally{if(targetId)await call('Target.closeTarget',{targetId}).catch(()=>{});ws.close()}
