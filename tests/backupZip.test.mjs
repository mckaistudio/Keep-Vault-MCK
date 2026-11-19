import {test} from 'node:test';import assert from 'node:assert/strict';import {makeBackupZip,readBackupZip} from '../src/backupZip.ts';
test('ZIP backup restores verified payload',async()=>{const s='{"notes":["hello"]}';const b=await makeBackupZip(s);assert.equal(await readBackupZip(b.buffer),s)});
test('ZIP rejects corrupted bytes',async()=>{const b=await makeBackupZip('test');b[60]^=1;await assert.rejects(readBackupZip(b.buffer))});
test('ZIP rejects path and invalid directory',async()=>{const b=await makeBackupZip('test');b[30]=46;await assert.rejects(readBackupZip(b.buffer));const c=await makeBackupZip('test');c[c.length-22]=0;await assert.rejects(readBackupZip(c.buffer))});
