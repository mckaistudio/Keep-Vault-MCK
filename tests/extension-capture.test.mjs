import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve('extension/dist');
const code=fs.readFileSync(path.join(root,'popup.js'),'utf8');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
function setup({url='https://example.com/article',selection='Hello world',activeElement=null,anchorNode=null,focusNode=null}={}){
 const fields=Object.fromEntries(['capture','copy','download','cancel','title','content','source','category','tags','status'].map(id=>[id,{value:id==='category'?'PMC':'',textContent:'',listeners:{},addEventListener(type,fn){this.listeners[type]=fn;}}]));
 let selected=selection, currentUrl=url, copied='',downloaded=false,downloadName='',blobParts=null;
 const context={document:{getElementById:id=>fields[id],activeElement},window:{getSelection:()=>({toString:()=>selected,anchorNode,focusNode})},chrome:{tabs:{query:async()=>[{id:1,url:currentUrl,title:'Article'}]},scripting:{executeScript:async({func})=>[{result:vm.runInNewContext(`(${func.toString()})()`,{window:{getSelection:()=>({toString:()=>selected,anchorNode,focusNode})},document:{activeElement}})}]}},navigator:{clipboard:{writeText:async text=>{copied=text}}},Blob:class{constructor(parts){blobParts=parts}},URL:class extends URL{static createObjectURL(){return 'blob:test'}static revokeObjectURL(){}},setTimeout:()=>{}};
 context.document.createElement=()=>({set download(value){downloadName=value},click(){downloaded=true}});
 vm.runInNewContext(code,context);
 return {fields,click:async id=>fields[id].listeners.click(),get copied(){return copied},get downloaded(){return downloaded},get downloadName(){return downloadName},get blobParts(){return blobParts}};
}
test('Manifest limits permissions and has a popup',()=>{assert.equal(manifest.manifest_version,3);assert.deepEqual(manifest.permissions,['activeTab','scripting']);assert.equal(manifest.action.default_popup,'popup.html')});
test('Capture selected webpage text and source',async()=>{const x=setup();await x.click('capture');assert.equal(x.fields.content.value,'Hello world');assert.equal(x.fields.title.value,'Article');assert.equal(x.fields.source.value,'https://example.com/article')});
test('Reject restricted browser URLs',async()=>{const x=setup({url:'chrome://settings'});await x.click('capture');assert.match(x.fields.status.textContent,/normal webpage/)});
test('Reject empty selection',async()=>{const x=setup({selection:''});await x.click('capture');assert.match(x.fields.status.textContent,/Highlight/)});
test('Reject overlong selection',async()=>{const x=setup({selection:'a'.repeat(20001)});await x.click('capture');assert.match(x.fields.status.textContent,/20,000/)});
test('Reject active sensitive input',async()=>{const x=setup({activeElement:{matches:s=>s.includes('input'),closest:()=>null}});await x.click('capture');assert.match(x.fields.status.textContent,/Highlight/)});
test('Copy captured content only on click',async()=>{const x=setup();await x.click('capture');await x.click('copy');assert.equal(x.copied,'Hello world')});
test('Cancel clears capture',async()=>{const x=setup();await x.click('capture');await x.click('cancel');assert.equal(x.fields.content.value,'');assert.equal(x.fields.source.value,'')});
test('Save refuses empty content',async()=>{const x=setup();await x.click('download');assert.equal(x.downloaded,false);assert.match(x.fields.status.textContent,/title and content/)});

test('Reject selection originating inside editable content',async()=>{const anchorNode={nodeType:1,closest:()=>({})};const x=setup({anchorNode});await x.click('capture');assert.match(x.fields.status.textContent,/Highlight/)});



test('Reject selection ending inside editable content',async()=>{const focusNode={nodeType:1,closest:()=>({})};const x=setup({focusNode});await x.click('capture');assert.match(x.fields.status.textContent,/Highlight/)});
test('Preserve Unicode in captured text',async()=>{const x=setup({selection:'Urdu اردو — ਪੰਜਾਬੀ'});await x.click('capture');assert.equal(x.fields.content.value,'Urdu اردو — ਪੰਜਾਬੀ')});


test('Save creates dated local JSON with correct fields',async()=>{const x=setup();await x.click('capture');x.fields.tags.value='alpha, beta';await x.click('download');assert.equal(x.downloaded,true);assert.match(x.downloadName,/^keep-vault-capture-\d{4}-/);const data=JSON.parse(x.blobParts[0]);assert.equal(data.format,'keep-vault-mck-capture-v1');assert.equal(data.title,'Article');assert.equal(data.body,'Hello world');assert.equal(data.sourceUrl,'https://example.com/article');assert.deepEqual(data.tags,['alpha','beta']);assert.ok(data.capturedAt)});



test('Source URL removes query tokens, fragment and login credentials',async()=>{const x=setup({url:'https://user:secret@example.com/article?token=private#section'});await x.click('capture');assert.equal(x.fields.source.value,'https://example.com/article')});


test('Export normalizes duplicate and overlong tags for importer',async()=>{const x=setup();await x.click('capture');x.fields.tags.value='Useful, useful, '+ 'X'.repeat(60);await x.click('download');const data=JSON.parse(x.blobParts[0]);assert.deepEqual(data.tags,['useful','x'.repeat(40)])});

test('Export refuses unsafe source URL even if field changes',async()=>{const x=setup();await x.click('capture');x.fields.source.value='https://example.com/?token=secret';await x.click('download');assert.equal(x.downloaded,false);assert.match(x.fields.status.textContent,/not safe/)});
test('Export refuses missing webpage source',async()=>{const x=setup();x.fields.title.value='Note';x.fields.content.value='Body';await x.click('download');assert.equal(x.downloaded,false);assert.match(x.fields.status.textContent,/valid webpage/)});

test('Failed capture clears previous preview and blocks stale export',async()=>{const x=setup({url:'chrome://settings'});x.fields.title.value='Old secret';x.fields.content.value='Old data';x.fields.source.value='https://example.com/';x.fields.tags.value='private';await x.click('capture');assert.equal(x.fields.title.value,'');assert.equal(x.fields.content.value,'');assert.equal(x.fields.source.value,'');assert.equal(x.fields.tags.value,'');await x.click('download');assert.equal(x.downloaded,false)});
