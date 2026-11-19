import {encryptBackup} from '../src/vaultCrypto.ts';
import {exportPrivateRecords} from '../src/privateVaultBackup.ts';
import {writeFile} from 'node:fs/promises';
const ciphertext=await encryptBackup(JSON.stringify({body:'Synthetic browser restore test'}),'Browser-Restore-2026!');
const record={id:crypto.randomUUID(),name:'Browser Recovery Fixture',ciphertext,createdAt:new Date().toISOString()};
await writeFile('private-restore-fixture.json',await exportPrivateRecords([record]));
console.log('Fixture created');