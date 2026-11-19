'use strict';
const el=id=>document.getElementById(id);
const status=text=>{el('status').textContent=text};
let captureRequest=0;
function captureSelection(){const selection=window.getSelection();const selected=selection?.toString()||'';const anchor=selection?.anchorNode?.nodeType===1?selection.anchorNode:selection?.anchorNode?.parentElement;const focus=selection?.focusNode?.nodeType===1?selection.focusNode:selection?.focusNode?.parentElement;if(anchor?.closest?.('input,textarea,[contenteditable], [contenteditable] *')||focus?.closest?.('input,textarea,[contenteditable], [contenteditable] *'))return '';const node=document.activeElement;if(node&&(node.matches('input,textarea,[contenteditable], [contenteditable] *')||node.closest?.('[contenteditable]')))return '';return selected.slice(0,20001)}
el('capture').addEventListener('click',async()=>{const request=++captureRequest;status('');for(const id of ['title','content','source','tags'])el(id).value='';try{const [tab]=await chrome.tabs.query({active:true,currentWindow:true});if(request!==captureRequest)return;if(!tab?.id||!/^https?:\/\//.test(tab.url||''))throw Error('Open a normal webpage first.');const results=await chrome.scripting.executeScript({target:{tabId:tab.id},func:captureSelection});if(request!==captureRequest)return;const text=results?.[0]?.result||'';if(!text.trim())throw Error('Highlight non-sensitive webpage text first.');if(text.length>20000)throw Error('Selection exceeds 20,000 characters.');el('content').value=text;el('title').value=(tab.title||'Captured selection').slice(0,160);const safeUrl=new URL(tab.url);safeUrl.username='';safeUrl.password='';safeUrl.search='';safeUrl.hash='';el('source').value=safeUrl.toString();status('Selection ready. Review it before saving.')}catch(e){if(request===captureRequest)status(e?.message||'Capture unavailable on this page.')}});
el('copy').addEventListener('click',async()=>{try{if(!el('content').value.trim())throw Error('Nothing to copy.');await navigator.clipboard.writeText(el('content').value);status('Text copied.')}catch(e){status(e?.message||'Copy unavailable.')}});
el('download').addEventListener('click',()=>{try{const title=el('title').value.trim();const body=el('content').value.trim();if(!title||!body)throw Error('Enter a title and content.');if(title.length>160||body.length>20000)throw Error('Title or content is too long.');const source=el('source').value;let safeSource;try{safeSource=new URL(source)}catch{throw Error('Capture a valid webpage before saving.')}if(!['http:','https:'].includes(safeSource.protocol)||safeSource.username||safeSource.password||safeSource.search||safeSource.hash||source.length>2048)throw Error('Source URL is not safe to export.');const data={format:'keep-vault-mck-capture-v1',title,body,sourceUrl:source,capturedAt:new Date().toISOString(),category:el('category').value,tags:[...new Set(el('tags').value.split(',').map(s=>s.trim().toLowerCase().slice(0,40)).filter(Boolean))].slice(0,20)};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='keep-vault-capture-'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status('Capture saved as a local file. No data was uploaded.')}catch(e){status(e?.message||'Save failed.')}});
el('cancel').addEventListener('click',()=>{captureRequest++;for(const id of ['title','content','source','tags'])el(id).value='';status('Capture cleared.')});











el('keep').addEventListener('click',async()=>{try{await chrome.tabs.create({url:'https://keep.google.com/'});status('Google Keep opened. Paste copied text into a new note manually.')}catch(e){status('Could not open Google Keep. Visit https://keep.google.com/ manually.')}});
