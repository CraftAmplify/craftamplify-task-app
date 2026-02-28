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
  TaskServiceError: class TaskServiceError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'TaskServiceError';
    }
  },
}));

const mockFetchTasks = TaskService.fetchTasks as jest.MockedFunction<typeof TaskService.fetchTasks>;

describe('App', () => {
  beforeEach(() => {
    mockFetchTasks.mockClear();
  });

  test('shows "Tasks (3)" when there are three open tasks', async () => {
    mockFetchTasks.mockResolvedValue([
      { id: '1', text: 'Task 1', completed: false },
      { id: '2', text: 'Task 2', completed: false },
      { id: '3', text: 'Task 3', completed: false },
    ]);

    render(<App />);

    await screen.findByText('Task 1');

    const tasksHeading = screen.getByRole('heading', { level: 2 });
    expect(tasksHeading).toHaveTextContent('Tasks (3)');
  });
});
