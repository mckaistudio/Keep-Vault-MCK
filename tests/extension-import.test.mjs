import test from 'node:test';
import assert from 'node:assert/strict';
import {parseExtensionCapture} from '../src/extensionCaptureImport.ts';
import {reviewImport} from '../src/importExport.ts';
const valid={title:'Example',body:'Selected useful text',sourceUrl:'https://example.com/page',capturedAt:'2026-11-19T14:00:00.000Z',category:'PMC',tags:['Useful','research']};
const parse=(value)=>parseExtensionCapture(JSON.stringify(value),'keep-vault-capture.json');
test('Extension capture maps to reviewed import candidate',()=>{const note=parse(valid);assert.equal(note.title,'Example');assert.equal(note.body,valid.body);assert.equal(note.category,'PMC');assert.deepEqual(note.tags,['useful','research']);assert.equal(note.sourceId,valid.sourceUrl)});
test('Reject malformed capture JSON',()=>assert.throws(()=>parseExtensionCapture('{bad','bad.json'),/Invalid capture JSON/));
test('Reject empty capture text',()=>assert.throws(()=>parse({...valid,body:''}),/Invalid capture text/));
test('Reject invalid category',()=>assert.throws(()=>parse({...valid,category:'UNKNOWN'}),/Invalid capture category/));
test('Reject unsafe URL scheme',()=>assert.throws(()=>parse({...valid,sourceUrl:'javascript:alert(1)'}),/clean web URL/));
test('Reject URL query token',()=>assert.throws(()=>parse({...valid,sourceUrl:'https://example.com/?token=secret'}),/clean web URL/));
test('Reject invalid tags',()=>assert.throws(()=>parse({...valid,tags:['x'.repeat(41)]}),/Invalid capture tags/));
test('Reject missing timestamp',()=>assert.throws(()=>parse({...valid,capturedAt:''}),/Invalid capture timestamp/));


test('Extension captures enter review without auto-import',()=>{const candidate=parse(valid);const review=reviewImport([candidate],[]);assert.equal(review.ready.length,1);assert.equal(review.duplicates.length,0);assert.equal(review.invalid.length,0)});
test('Duplicate extension captures are skipped in review',()=>{const candidate=parse(valid);const review=reviewImport([candidate,candidate],[]);assert.equal(review.ready.length,1);assert.equal(review.duplicates.length,1)});
test('Reject capture with more than 20,000 characters',()=>assert.throws(()=>parse({...valid,body:'x'.repeat(20001)}),/Invalid capture text/));
