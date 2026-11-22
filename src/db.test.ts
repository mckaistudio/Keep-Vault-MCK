import { beforeEach, describe, expect, it } from 'vitest';
import {
  createNote,
  formatNoteCode,
  listNotes,
  updateNote,
  vaultDatabase,
} from './db';

beforeEach(async () => {
  await vaultDatabase.delete();
  await vaultDatabase.open();
});

describe('note persistence', () => {
  it('creates UUID notes and allocates unique codes transactionally', async () => {
    const [first, second] = await Promise.all([
      createNote('First', 'One'),
      createNote('Second', 'Two'),
    ]);

    expect(first.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(new Set([first.code, second.code]).size).toBe(2);
    expect(new Set([first.code, second.code])).toEqual(
      new Set(['@000001', '@000002']),
    );
  });

  it('skips an existing code when the saved sequence is stale', async () => {
    await vaultDatabase.notes.add({
      id: crypto.randomUUID(),
      code: '@000001',
      title: 'Existing',
      content: '',
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
    });

    const note = await createNote('Next', '');

    expect(note.code).toBe('@000002');
  });

  it('preserves the code and creation time when editing a note', async () => {
    const created = await createNote('Before', 'Initial content');
    const updated = await updateNote(created.id, 'After', 'Revised content');

    expect(updated).toMatchObject({
      id: created.id,
      code: created.code,
      createdAt: created.createdAt,
      title: 'After',
      content: 'Revised content',
    });
    expect(updated.updatedAt).not.toBe(created.updatedAt);
  });

  it('rejects empty titles and missing records', async () => {
    await expect(createNote('  ', '')).rejects.toThrow('A note title is required');
    await expect(updateNote('missing', 'Title', '')).rejects.toThrow(
      'This note no longer exists',
    );
  });

  it('formats longer allocation sequences without truncating them', () => {
    expect(formatNoteCode(1_000_000)).toBe('@1000000');
  });

  it('lists notes newest-updated first', async () => {
    const older = await createNote('Older', '');
    const newer = await createNote('Newer', '');
    await updateNote(older.id, 'Older, edited', '');

    const notes = await listNotes();
    expect(notes[0].id).toBe(older.id);
    expect(notes[1].id).toBe(newer.id);
  });
});
