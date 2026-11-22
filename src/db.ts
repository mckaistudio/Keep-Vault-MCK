import Dexie, { type EntityTable } from 'dexie';
import type { Note } from './types';

interface Sequence {
  id: 'note-code';
  nextValue: number;
}

class VaultDatabase extends Dexie {
  notes!: EntityTable<Note, 'id'>;
  sequences!: EntityTable<Sequence, 'id'>;

  constructor() {
    super('keep-vault');
    this.version(1).stores({
      notes: 'id, &code, title, updatedAt',
      sequences: 'id',
    });
  }
}

export const vaultDatabase = new VaultDatabase();

export function formatNoteCode(value: number): string {
  return `@${String(value).padStart(6, '0')}`;
}

export async function listNotes(): Promise<Note[]> {
  return vaultDatabase.notes.orderBy('updatedAt').reverse().toArray();
}

export async function createNote(
  title: string,
  content: string,
): Promise<Note> {
  const normalizedTitle = title.trim();
  if (!normalizedTitle) {
    throw new Error('A note title is required.');
  }

  return vaultDatabase.transaction(
    'rw',
    vaultDatabase.notes,
    vaultDatabase.sequences,
    async () => {
      const sequence = await vaultDatabase.sequences.get('note-code');
      let nextValue = sequence?.nextValue ?? 1;
      let code = formatNoteCode(nextValue);

      while (await vaultDatabase.notes.where('code').equals(code).first()) {
        nextValue += 1;
        code = formatNoteCode(nextValue);
      }

      const now = new Date().toISOString();
      const note: Note = {
        id: crypto.randomUUID(),
        code,
        title: normalizedTitle,
        content,
        createdAt: now,
        updatedAt: now,
      };

      await vaultDatabase.notes.add(note);
      await vaultDatabase.sequences.put({
        id: 'note-code',
        nextValue: nextValue + 1,
      });
      return note;
    },
  );
}

export async function updateNote(
  id: string,
  title: string,
  content: string,
): Promise<Note> {
  const normalizedTitle = title.trim();
  if (!normalizedTitle) {
    throw new Error('A note title is required.');
  }

  return vaultDatabase.transaction('rw', vaultDatabase.notes, async () => {
    const note = await vaultDatabase.notes.get(id);
    if (!note) {
      throw new Error('This note no longer exists on this device.');
    }

    const updated: Note = {
      ...note,
      title: normalizedTitle,
      content,
      updatedAt: new Date(
        Math.max(Date.now(), Date.parse(note.updatedAt) + 1),
      ).toISOString(),
    };
    await vaultDatabase.notes.put(updated);
    return updated;
  });
}
