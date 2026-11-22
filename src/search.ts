import type { Note, SearchScope } from './types';

export function searchNotes(
  notes: Note[],
  query: string,
  scope: SearchScope,
): Note[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) {
    return notes;
  }

  return notes.filter((note) => {
    const title = note.title.toLocaleLowerCase();
    const content = note.content.toLocaleLowerCase();
    const code = note.code.toLocaleLowerCase();
    const id = note.id.toLocaleLowerCase();

    switch (scope) {
      case 'title':
        return title.includes(normalizedQuery);
      case 'content':
        return content.includes(normalizedQuery);
      case 'exact':
        return (
          code === normalizedQuery ||
          id === normalizedQuery ||
          title === normalizedQuery ||
          content === normalizedQuery
        );
      case 'all':
        return (
          code.includes(normalizedQuery) ||
          id.includes(normalizedQuery) ||
          title.includes(normalizedQuery) ||
          content.includes(normalizedQuery)
        );
    }
  });
}
