import { describe, expect, it } from 'vitest';
import { searchNotes } from './search';
import type { Note } from './types';

const notes: Note[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    code: '@000001',
    title: 'Travel plan',
    content: 'Visit Kyoto in spring',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    code: '@000002',
    title: 'Reading list',
    content: 'Travel essays',
    createdAt: '',
    updatedAt: '',
  },
];

describe('searchNotes', () => {
  it('searches title and content independently without case sensitivity', () => {
    expect(searchNotes(notes, 'TRAVEL', 'title')).toEqual([notes[0]]);
    expect(searchNotes(notes, 'TRAVEL', 'content')).toEqual([notes[1]]);
  });

  it('matches exact codes and full text, not partial exact values', () => {
    expect(searchNotes(notes, '@000001', 'exact')).toEqual([notes[0]]);
    expect(searchNotes(notes, 'travel plan', 'exact')).toEqual([notes[0]]);
    expect(searchNotes(notes, '@00000', 'exact')).toEqual([]);
  });

  it('searches all fields and returns the original list for a blank query', () => {
    expect(searchNotes(notes, 'essays', 'all')).toEqual([notes[1]]);
    expect(searchNotes(notes, '  ', 'all')).toBe(notes);
  });
});
