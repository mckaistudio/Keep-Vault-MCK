import test from 'node:test';import assert from 'node:assert/strict';import {encryptBackup,decryptBackup} from '../src/vaultCrypto.ts';
const password='long strong sample passphrase';
test('encrypted backup round trip',async()=>{const original=JSON.stringify({format:'keep-vault-mck-backup-v1',notes:[{title:'Secret'}]});const encrypted=await encryptBackup(original,password);assert.doesNotMatch(encrypted,/Secret/);assert.equal(await decryptBackup(encrypted,password),original);});
test('random salt and nonce create different ciphertext',async()=>{assert.notEqual(await encryptBackup('hello',password),await encryptBackup('hello',password));});
test('wrong passphrase fails closed',async()=>{const value=await encryptBackup('secret',password);await assert.rejects(decryptBackup(value,'another long passphrase'),/Incorrect passphrase/);});
test('tampering fails authentication',async()=>{const value=JSON.parse(await encryptBackup('secret',password));value.data=value.data.slice(0,-4)+'AAAA';await assert.rejects(decryptBackup(JSON.stringify(value),password));});
test('short passphrases and malformed files rejected',async()=>{await assert.rejects(encryptBackup('hello','short'),/12 characters/);await assert.rejects(decryptBackup('{}',password),/Unsupported/);});
