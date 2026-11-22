import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { vaultDatabase } from './db';

beforeEach(async () => {
  await vaultDatabase.delete();
  await vaultDatabase.open();
});

describe('Keep Vault interactions', () => {
  it('creates, edits, saves, views, and copies a note', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(<App />);
    await user.click(screen.getByRole('button', { name: /new note/i }));
    await user.type(screen.getByLabelText('Title'), 'My trip');
    await user.type(screen.getByLabelText('Note'), 'Pack a notebook');
    await user.click(screen.getByRole('button', { name: 'Save note' }));

    expect(await screen.findByRole('heading', { name: 'My trip' })).toBeTruthy();
    const noteView = within(screen.getByRole('article'));
    expect(noteView.getByText('@000001')).toBeTruthy();
    expect(noteView.getByText('Pack a notebook')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Edit note' }));
    const title = screen.getByLabelText('Title');
    await user.clear(title);
    await user.type(title, 'My updated trip');
    await user.click(screen.getByRole('button', { name: 'Save note' }));
    expect(
      await screen.findByRole('heading', { name: 'My updated trip' }),
    ).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Copy note' }));
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(
        '@000001 — My updated trip\n\nPack a notebook',
      );
    });
    expect(screen.getByRole('status').textContent).toContain('Copied @000001');
  }, 15_000);

  it('applies the selected appearance preferences', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText('Theme'), 'light');
    await user.click(screen.getByLabelText('Lite surfaces'));
    await user.click(screen.getByLabelText('Reduce motion'));

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe('light');
      expect(document.documentElement.dataset.lite).toBe('true');
      expect(document.documentElement.dataset.reduceMotion).toBe('true');
    });
  }, 15_000);
});
