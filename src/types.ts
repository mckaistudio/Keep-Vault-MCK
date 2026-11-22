export interface Note {
  id: string;
  code: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteDraft {
  id?: string;
  title: string;
  content: string;
}

export type SearchScope = 'all' | 'title' | 'content' | 'exact';
