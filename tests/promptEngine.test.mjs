import test from 'node:test';import assert from 'node:assert/strict';import{readFileSync}from'node:fs';
// TypeScript is transpiled separately by the build; source-level smoke checks do not replace runtime tests.
const src=readFileSync(new URL('../src/promptEngine.ts',import.meta.url),'utf8');
test('Phase 3 prompt engine includes local audit, upgrade, variables, and templates',()=>{for(const name of ['auditPrompt','improveLocally','placeholders','fillPlaceholders','templates'])assert.match(src,new RegExp(name));});
