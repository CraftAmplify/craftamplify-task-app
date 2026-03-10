import { render, screen } from '@testing-library/react';
import App from './App';

// Fake the API so tests don't need the real server running
globalThis.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      { id: '1', text: 'Task one', completed: false },
      { id: '2', text: 'Task two', completed: false },
      { id: '3', text: 'Task three', completed: true },
    ]),
  })
) as jest.Mock;

describe('App', () => {
  test('shows open task count in Tasks header', async () => {
    // Step 1: Open the app
    render(<App />);

    // Step 2 & 3: Wait for tasks to load, then check the heading says "Tasks (2)"
    // (2 because only 2 tasks are incomplete)
    const header = await screen.findByRole('heading', { name: /Tasks \(2\)/i });
    expect(header).toBeInTheDocument();
  });

  test('shows Tasks with no count when all tasks are completed', async () => {
    // Override the fake API to return all completed tasks
    (globalThis.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: '1', text: 'Task one', completed: true },
          { id: '2', text: 'Task two', completed: true },
        ]),
      })
    );

    // Step 1: Open the app
    render(<App />);

    // Step 2 & 3: Check the heading just says "Tasks" with no count
    const header = await screen.findByRole('heading', { name: /^Tasks$/i });
    expect(header).toBeInTheDocument();
  });
});
