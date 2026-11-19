import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeTags,findNotes,organizeNotes} from '../src/store.ts';
const notes=[
 {id:'1',code:'@PMC01',title:'Coding helper',body:'Build a safe app',category:'PMC',tags:['work','urgent'],pinned:true,archived:false,updatedAt:'2026-11-19T10:00:00Z'},
 {id:'2',code:'@PMB01',title:'Client outreach',body:'Sales email',category:'PMB',tags:['work'],pinned:false,archived:false,updatedAt:'2026-11-19T11:00:00Z'},
 {id:'3',code:'@PMC02',title:'Old idea',body:'Archived',category:'PMC',tags:['old'],pinned:false,archived:true,updatedAt:'2026-11-19T12:00:00Z'}
];
test('tags normalize, deduplicate and limit',()=>assert.deepEqual(normalizeTags(' Work,work, URGENT, ,urgent'),['work','urgent']));
test('searches code, title, body and tags',()=>{assert.deepEqual(findNotes(notes,'@PMC01').map(n=>n.id),['1']);assert.equal(findNotes(notes,'urgent').length,1);assert.equal(findNotes(notes,'sales').length,1);});
test('active/pinned/archived filters preserve notes',()=>{assert.deepEqual(organizeNotes(notes,'active','ALL','').map(n=>n.id),['1','2']);assert.deepEqual(organizeNotes(notes,'pinned','ALL','').map(n=>n.id),['1']);assert.deepEqual(organizeNotes(notes,'archived','ALL','').map(n=>n.id),['3']);assert.deepEqual(organizeNotes(notes,'active','PMC','work').map(n=>n.id),['1']);});

import { normalizeTags as normalizeTagsAgain } from "../src/store.ts";
test("long tags deduplicate after truncation",()=>{ const a="x".repeat(40); assert.deepEqual(normalizeTagsAgain(a+"one,"+a+"two"),[a]); });
