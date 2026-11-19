import test from 'node:test';import assert from 'node:assert/strict';import{prepareWorkflow,validateWorkflow,starterWorkflow}from'../src/workflowEngine.ts';
test('chained prompts',()=>{const result=prepareWorkflow(starterWorkflow,'Build a notes app');assert.equal(result.length,3);assert.match(result[1].text,/Create a clear outline/);});
test('replacement tokens stay literal',()=>{assert.equal(prepareWorkflow({name:'One',steps:[{id:'a',name:'A',template:'{{input}}'}]},'$& $` $1')[0].text,'$& $` $1');});
test('invalid inputs rejected',()=>{assert.throws(()=>prepareWorkflow(starterWorkflow,'   '),/input/);assert.ok(validateWorkflow({name:'',steps:[]}).length>=2);});
test('duplicate step IDs rejected',()=>{assert.match(validateWorkflow({name:'A',steps:[{id:'x',name:'A',template:'X'},{id:'x',name:'B',template:'Y'}]}).join(' '),/unique/);});
