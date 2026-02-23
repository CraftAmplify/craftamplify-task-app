import { render, screen } from '@testing-library/react';
import App from './App';
import { TaskService } from '@/services/taskService';

jest.mock('@/services/taskService', () => ({
  TaskService: {
    fetchTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
  TaskServiceError: class TaskServiceError extends Error {},
}));

describe('App', () => {
  beforeEach(() => {
    jest.mocked(TaskService.fetchTasks).mockClear();
  });

  test('displays Tasks section heading with open task count when there are open tasks', async () => {
    const mockTasks = [
      { id: '1', text: 'Open one', completed: false },
      { id: '2', text: 'Open two', completed: false },
      { id: '3', text: 'Done', completed: true },
    ];
    jest.mocked(TaskService.fetchTasks).mockResolvedValue(mockTasks);

    render(<App />);

    const heading = await screen.findByRole('heading', { level: 2, name: 'Tasks (2)' });

    expect(heading).toBeInTheDocument();
  });

  test('displays Tasks section heading without count when there are no open tasks', async () => {
    jest.mocked(TaskService.fetchTasks).mockResolvedValue([]);

    render(<App />);

    const heading = await screen.findByRole('heading', { level: 2, name: 'Tasks' });

    expect(heading).toBeInTheDocument();
  });

  test('displays Tasks section heading without count when all tasks are complete', async () => {
    const mockTasks = [
      { id: '1', text: 'Done one', completed: true },
      { id: '2', text: 'Done two', completed: true },
    ];
    jest.mocked(TaskService.fetchTasks).mockResolvedValue(mockTasks);

    render(<App />);

    const heading = await screen.findByRole('heading', { level: 2, name: 'Tasks' });

    expect(heading).toBeInTheDocument();
  });

  test('displays Tasks section heading with count when only open tasks exist', async () => {
    const mockTasks = [
      { id: '1', text: 'Open one', completed: false },
      { id: '2', text: 'Open two', completed: false },
      { id: '3', text: 'Open three', completed: false },
    ];
    jest.mocked(TaskService.fetchTasks).mockResolvedValue(mockTasks);

    render(<App />);

    const heading = await screen.findByRole('heading', { level: 2, name: 'Tasks (3)' });

    expect(heading).toBeInTheDocument();
  });
});