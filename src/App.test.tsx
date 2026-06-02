import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { createDefaultState } from './lib/repository';
import { useWorryStore } from './store/worry-store';

function reset() {
  localStorage.clear();
  const d = createDefaultState();
  useWorryStore.setState({ settings: d.settings, worries: d.worries });
}
beforeEach(reset);
afterEach(() => vi.useRealTimers());

describe('Worry Window', () => {
  it('renders and is visible (no opacity-freeze)', () => {
    render(<App />);
    expect(screen.getByText(/Park it here/)).toBeVisible();
    expect(screen.getByText(/Nothing parked/)).toBeInTheDocument();
  });

  it('parks and removes a worry', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/What's worrying you/), {
      target: { value: 'the deadline' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Park worry' }));
    expect(screen.getByText('the deadline')).toBeInTheDocument();
    expect(useWorryStore.getState().worries).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: /Remove: the deadline/ }));
    expect(useWorryStore.getState().worries).toHaveLength(0);
  });

  it('runs a worry session and clear-and-close empties the list', () => {
    vi.useFakeTimers();
    useWorryStore.setState((s) => ({
      settings: { ...s.settings, windowMin: 5 },
      worries: [{ id: 'a', txt: 'money', at: Date.now() }],
    }));
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Open worry time early' }));
    expect(screen.getByRole('heading', { name: 'This is the time.' })).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(5 * 60 * 1000);
    });
    expect(screen.getByRole('heading', { name: /Time.?s up/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Clear & close/ }));
    expect(useWorryStore.getState().worries).toHaveLength(0);
  });
});
