import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { TaskService, type Task } from '@/services/taskService';

// Mock the TaskService
jest.mock('@/services/taskService');

describe('App - Task Count Display', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('displays "Tasks" without count when there are no open tasks', async () => {
    // Mock empty task list
    (TaskService.fetchTasks as jest.Mock).mockResolvedValue([]);

    render(<App />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Check that "Tasks" header is displayed without count
    const tasksHeader = screen.getByRole('heading', { name: /^tasks$/i });
    expect(tasksHeader).toBeInTheDocument();
    expect(tasksHeader.textContent?.trim()).toBe('Tasks');
  });

  test('displays task count in parentheses when there are open tasks', async () => {
    // Mock tasks with some open tasks
    const mockTasks: Task[] = [
      { id: '1', text: 'Task 1', completed: false },
      { id: '2', text: 'Task 2', completed: false },
      { id: '3', text: 'Task 3', completed: true },
    ];

    (TaskService.fetchTasks as jest.Mock).mockResolvedValue(mockTasks);

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Check that "Tasks (2)" is displayed
    const tasksHeader = screen.getByRole('heading', { name: /^tasks/i });
    expect(tasksHeader).toBeInTheDocument();
    expect(tasksHeader.textContent?.trim()).toBe('Tasks (2)');
  });

  test('displays "Tasks" without count when all tasks are completed', async () => {
    // Mock tasks with all completed
    const mockTasks: Task[] = [
      { id: '1', text: 'Task 1', completed: true },
      { id: '2', text: 'Task 2', completed: true },
    ];

    (TaskService.fetchTasks as jest.Mock).mockResolvedValue(mockTasks);

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Check that "Tasks" header is displayed without count
    const tasksHeader = screen.getByRole('heading', { name: /^tasks$/i });
    expect(tasksHeader).toBeInTheDocument();
    expect(tasksHeader.textContent?.trim()).toBe('Tasks');
  });

  test('displays correct count for single open task', async () => {
    // Mock single open task
    const mockTasks: Task[] = [
      { id: '1', text: 'Task 1', completed: false },
    ];

    (TaskService.fetchTasks as jest.Mock).mockResolvedValue(mockTasks);

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Check that "Tasks (1)" is displayed
    const tasksHeader = screen.getByRole('heading', { name: /^tasks/i });
    expect(tasksHeader.textContent?.trim()).toBe('Tasks (1)');
  });
});