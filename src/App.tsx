import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  createNote,
  listNotes,
  updateNote,
} from './db';
import { searchNotes } from './search';
import type { Note, NoteDraft, SearchScope } from './types';

type Theme = 'dark' | 'light' | 'system';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<NoteDraft | null>(null);
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<SearchScope>('all');
  const [theme, setTheme] = useState<Theme>('dark');
  const [lite, setLite] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    listNotes()
      .then((storedNotes) => {
        if (active) {
          setNotes(storedNotes);
          setLoading(false);
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error
              ? `Could not open this device's vault: ${cause.message}`
              : 'Could not open this device’s vault.',
          );
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.lite = String(lite);
    root.dataset.reduceMotion = String(reduceMotion);
  }, [theme, lite, reduceMotion]);

  const visibleNotes = useMemo(
    () => searchNotes(notes, query, scope),
    [notes, query, scope],
  );
  const selectedNote = notes.find((note) => note.id === selectedId) ?? null;

  function startNewNote() {
    setSelectedId(null);
    setDraft({ title: '', content: '' });
    setError('');
    setStatus('');
  }

  function startEditing() {
    if (!selectedNote) return;
    setDraft({
      id: selectedNote.id,
      title: selectedNote.title,
      content: selectedNote.content,
    });
    setError('');
    setStatus('');
  }

  function cancelEditing() {
    setDraft(null);
    setError('');
    setStatus('Changes discarded.');
  }

  async function saveDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;

    setError('');
    setStatus('');
    try {
      const saved = draft.id
        ? await updateNote(draft.id, draft.title, draft.content)
        : await createNote(draft.title, draft.content);
      setNotes(await listNotes());
      setSelectedId(saved.id);
      setDraft(null);
      setStatus(`Saved ${saved.code}.`);
    } catch (cause: unknown) {
      setError(
        cause instanceof Error ? cause.message : 'The note could not be saved.',
      );
    }
  }

  async function copyNote() {
    if (!selectedNote) return;
    setError('');
    setStatus('');
    try {
      await navigator.clipboard.writeText(
        `${selectedNote.code} — ${selectedNote.title}\n\n${selectedNote.content}`,
      );
      setStatus(`Copied ${selectedNote.code} and its contents.`);
    } catch (cause: unknown) {
      setError(
        cause instanceof Error
          ? `Could not copy this note: ${cause.message}`
          : 'Could not copy this note. Check clipboard permissions.',
      );
    }
  }

  function openNote(note: Note) {
    setSelectedId(note.id);
    setDraft(null);
    setError('');
    setStatus('');
  }

  return (
    <main className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to note
      </a>
      <aside className="sidebar" aria-label="Vault navigation">
        <a className="brand" href="#main-content" aria-label="Keep Vault home">
          <span className="brand-mark" aria-hidden="true">K</span>
          <span>
            <strong>KEEP VAULT</strong>
            <small>YOUR PRIVATE SPACE</small>
          </span>
        </a>

        <button className="new-note-button" type="button" onClick={startNewNote}>
          <span aria-hidden="true">+</span> New note
        </button>

        <div className="search-block">
          <label htmlFor="note-search">Find a note</label>
          <input
            id="note-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search your vault"
          />
          <label className="visually-hidden" htmlFor="search-scope">
            Search within
          </label>
          <select
            id="search-scope"
            value={scope}
            onChange={(event) => setScope(event.target.value as SearchScope)}
          >
            <option value="all">All fields</option>
            <option value="title">Title</option>
            <option value="content">Content</option>
            <option value="exact">Exact match</option>
          </select>
        </div>

        <div className="notes-heading">
          <h2>YOUR NOTES</h2>
          <span aria-label={`${visibleNotes.length} notes`}>
            {visibleNotes.length}
          </span>
        </div>
        <nav className="note-list" aria-label="Notes">
          {loading ? (
            <p className="list-message">Opening your vault…</p>
          ) : visibleNotes.length ? (
            visibleNotes.map((note) => (
              <button
                className={`note-row${selectedId === note.id ? ' is-selected' : ''}`}
                key={note.id}
                type="button"
                aria-current={selectedId === note.id ? 'page' : undefined}
                onClick={() => openNote(note)}
              >
                <span className="note-code">{note.code}</span>
                <span className="note-title">{note.title}</span>
                <span className="note-preview">
                  {note.content || 'No additional text'}
                </span>
              </button>
            ))
          ) : (
            <p className="list-message">
              {query ? 'No notes match your search.' : 'Your vault is empty.'}
            </p>
          )}
        </nav>

        <section className="appearance" aria-labelledby="appearance-heading">
          <h2 id="appearance-heading">APPEARANCE</h2>
          <label htmlFor="theme-select">Theme</label>
          <select
            id="theme-select"
            value={theme}
            onChange={(event) => setTheme(event.target.value as Theme)}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="system">System</option>
          </select>
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={lite}
              onChange={(event) => setLite(event.target.checked)}
            />
            <span>Lite surfaces</span>
          </label>
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={reduceMotion}
              onChange={(event) => setReduceMotion(event.target.checked)}
            />
            <span>Reduce motion</span>
          </label>
        </section>

        <p className="local-note">
          <span aria-hidden="true">●</span> Stored on this device
        </p>
      </aside>

      <section className="workspace" id="main-content" aria-label="Note workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <span>VAULT</span>
            <span aria-hidden="true">/</span>
            <strong>{draft ? (draft.id ? 'EDIT NOTE' : 'NEW NOTE') : 'NOTE'}</strong>
          </div>
          <p>Private by design</p>
        </header>

        <div className="content-area">
          {error && (
            <p className="feedback error" role="alert">
              {error}
            </p>
          )}
          {status && (
            <p className="feedback success" role="status">
              {status}
            </p>
          )}

          {draft ? (
            <form className="note-editor" onSubmit={saveDraft}>
              <div className="editor-header">
                <div>
                  <p className="eyebrow">{draft.id ? 'EDITING NOTE' : 'NEW NOTE'}</p>
                  <h1>{draft.id ? 'Refine your thought.' : 'Capture a thought.'}</h1>
                </div>
                <div className="editor-actions">
                  <button className="button-secondary" type="button" onClick={cancelEditing}>
                    Cancel
                  </button>
                  <button className="button-primary" type="submit">
                    Save note
                  </button>
                </div>
              </div>
              {draft.id && selectedNote && (
                <p className="editor-code">{selectedNote.code}</p>
              )}
              <label className="field-label" htmlFor="note-title">
                Title
              </label>
              <input
                autoFocus
                id="note-title"
                className="title-input"
                maxLength={160}
                required
                value={draft.title}
                onChange={(event) =>
                  setDraft({ ...draft, title: event.target.value })
                }
                placeholder="Give this note a title"
              />
              <label className="field-label content-label" htmlFor="note-content">
                Note
              </label>
              <textarea
                id="note-content"
                value={draft.content}
                onChange={(event) =>
                  setDraft({ ...draft, content: event.target.value })
                }
                placeholder="Write something worth keeping…"
              />
              <p className="editor-hint">
                Notes stay in this browser on this device. Your private vault is not
                sent to a server.
              </p>
            </form>
          ) : selectedNote ? (
            <article className="note-view">
              <div className="view-toolbar">
                <span className="code-pill">{selectedNote.code}</span>
                <div className="editor-actions">
                  <button className="button-secondary" type="button" onClick={copyNote}>
                    Copy note
                  </button>
                  <button className="button-primary" type="button" onClick={startEditing}>
                    Edit note
                  </button>
                </div>
              </div>
              <p className="eyebrow">KEPT IN YOUR VAULT</p>
              <h1>{selectedNote.title}</h1>
              <p className="updated-at">
                Updated{' '}
                <time dateTime={selectedNote.updatedAt}>
                  {new Intl.DateTimeFormat(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(new Date(selectedNote.updatedAt))}
                </time>
              </p>
              <div className="note-content">
                {selectedNote.content ? (
                  selectedNote.content
                ) : (
                  <span className="muted">This note has no additional text.</span>
                )}
              </div>
            </article>
          ) : (
            <div className="welcome-panel">
              <div className="welcome-orbit" aria-hidden="true">
                <span>K</span>
              </div>
              <p className="eyebrow">A LITTLE SPACE, JUST FOR YOU</p>
              <h1>Keep what matters.</h1>
              <p>
                A quiet place for the thoughts, details, and small things you want
                close.
              </p>
              <button className="button-primary" type="button" onClick={startNewNote}>
                Create your first note
              </button>
            </div>
          )}
        </div>
        <footer className="workspace-footer">
          <span>KEEP VAULT MCK</span>
          <span>LOCAL · PRIVATE · YOURS</span>
        </footer>
      </section>
    </main>
  );
}

export default App;
