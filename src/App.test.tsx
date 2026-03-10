import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { TaskService } from '@/services/taskService';

jest.mock('@/services/taskService');
const mockFetchTasks = TaskService.fetchTasks as jest.Mock;

describe('App - task count heading', () => {
  beforeEach(() => {
    mockFetchTasks.mockClear();
  });

  test('shows "Tasks" heading with no count when there are no tasks', async () => {
    mockFetchTasks.mockResolvedValue([]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Tasks');
    });
    expect(screen.getByRole('heading', { level: 2 })).not.toHaveTextContent('(');
  });

  test('shows task count in heading when there are open tasks', async () => {
    mockFetchTasks.mockResolvedValue([
      { id: '1', text: 'Task one', completed: false },
      { id: '2', text: 'Task two', completed: false },
    ]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Tasks (2)');
    });
  });

  test('does not include completed tasks in the count', async () => {
    mockFetchTasks.mockResolvedValue([
      { id: '1', text: 'Active task', completed: false },
      { id: '2', text: 'Done task', completed: true },
    ]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Tasks (1)');
    });
  });

  test('shows "Tasks" with no count when all tasks are completed', async () => {
    mockFetchTasks.mockResolvedValue([
      { id: '1', text: 'Done task', completed: true },
    ]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Tasks');
    });
    expect(screen.getByRole('heading', { level: 2 })).not.toHaveTextContent('(');
  });
});
