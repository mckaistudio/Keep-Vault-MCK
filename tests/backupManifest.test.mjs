import test from 'node:test';import assert from 'node:assert/strict';import {makeManifestBackup,verifyManifestBackup} from '../src/backupManifest.ts';
test('manifest verifies original backup',async()=>{const source='{"notes":[{"title":"Sample"}]}';const backup=await makeManifestBackup(source);assert.equal(await verifyManifestBackup(backup),source);});
test('manifest rejects tampered backup',async()=>{const backup=await makeManifestBackup('original');await assert.rejects(()=>verifyManifestBackup(backup.replace('original','tampered')),/integrity/);});
test('manifest rejects invalid metadata',async()=>{await assert.rejects(()=>verifyManifestBackup('{"format":"bad"}'),/Unsupported/);});
