import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareWorkflow,validateWorkflow,starterWorkflow} from '../src/workflowEngine.ts';
test('Phase 4 prepares chained prompts deterministically',()=>{const result=prepareWorkflow(starterWorkflow,'Build a notes app');assert.equal(result.length,3);assert.match(result[0].text,/Build a notes app/);assert.match(result[1].text,/Create a clear outline/);assert.match(result[2].text,/Write a detailed first draft/);});
test('Phase 4 preserves user input containing replacement syntax',()=>{const r=prepareWorkflow({name:'One',steps:[{id:'a',name:'A',template:'{{input}}'}]},'$& $` $1');assert.equal(r[0].text,'$& $` $1');});
test('Phase 4 rejects empty input and empty steps',()=>{assert.throws(()=>prepareWorkflow(starterWorkflow,'   '),/input/);assert.ok(validateWorkflow({name:'',steps:[]}).length>=2);});
test('Phase 4 rejects duplicate IDs and too many steps',()=>{assert.match(validateWorkflow({name:'A',steps:[{id:'x',name:'A',template:'X'},{id:'x',name:'B',template:'Y'}]}).join(' '),/unique/);assert.match(validateWorkflow({name:'A',steps:Array.from({length:21},(_,i)=>({id:String(i),name:'A',template:'X'}))}).join(' '),/1–20/);});
