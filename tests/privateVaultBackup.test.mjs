import test from 'node:test';import assert from 'node:assert/strict';
import {exportPrivateRecords,parsePrivateRecords,mergePrivateRecords} from '../src/privateVaultBackup.ts';
const sample={id:'test-1',name:'sample',ciphertext:'encrypted-placeholder',createdAt:'2026-11-19T00:00:00Z'};
test('private encrypted record round-trip',async()=>{assert.deepEqual(await parsePrivateRecords(await exportPrivateRecords([sample])),[sample]);});
test('private backup tampering is rejected',async()=>{const backup=await exportPrivateRecords([sample]);await assert.rejects(()=>parsePrivateRecords(backup.replace('sample','tamper')),/integrity/);});
test('private backup never overwrites matching ids',()=>{assert.deepEqual(mergePrivateRecords([sample],[sample]),[]);});
test('private backup rejects duplicate ids',async()=>{await assert.rejects(()=>exportPrivateRecords([sample,sample]),/Invalid/);});
