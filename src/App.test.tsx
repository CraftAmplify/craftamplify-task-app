import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { TaskService, type Task } from './services/taskService';

// Mock the TaskService
jest.mock('./services/taskService', () => ({
  TaskService: {
    fetchTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
  TaskServiceError: class TaskServiceError extends Error {},
}));

describe('App - Task Count Display', () => {
  const mockFetchTasks = TaskService.fetchTasks as jest.MockedFunction<typeof TaskService.fetchTasks>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays "Tasks" when there are no open tasks', async () => {
    // Set up: Create test data with only completed tasks
    const completedTasks: Task[] = [
      { id: '1', text: 'Task 1', completed: true },
      { id: '2', text: 'Task 2', completed: true },
    ];
    
    // Tell the mock to return our test data
    mockFetchTasks.mockResolvedValue(completedTasks);

    // Render the App component
    render(<App />);

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Check: Find the heading and verify it says "Tasks" (not "Tasks (2)")
    const tasksHeading = screen.getByRole('heading', { name: /^tasks$/i });
    expect(tasksHeading).toBeInTheDocument();
    expect(tasksHeading.textContent).toBe('Tasks');
  });

  test('displays "Tasks (N)" when there are open tasks', async () => {
    // Set up: Create test data with some open tasks and some completed
    const tasksWithOpen: Task[] = [
      { id: '1', text: 'Open task 1', completed: false },
      { id: '2', text: 'Open task 2', completed: false },
      { id: '3', text: 'Completed task', completed: true },
    ];
    
    // Tell the mock to return our test data
    mockFetchTasks.mockResolvedValue(tasksWithOpen);

    // Render the App component
    render(<App />);

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Check: Find the heading and verify it shows "Tasks (2)" - only counting open tasks
    const tasksHeading = screen.getByRole('heading', { name: /^tasks/i });
    expect(tasksHeading).toBeInTheDocument();
    expect(tasksHeading.textContent).toBe('Tasks (2)');
  });

  test('displays "Tasks" when there are no tasks at all', async () => {
    // Set up: Empty array - no tasks
    mockFetchTasks.mockResolvedValue([]);

    // Render the App component
    render(<App />);

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Check: Find the heading and verify it says "Tasks" (no count)
    const tasksHeading = screen.getByRole('heading', { name: /^tasks$/i });
    expect(tasksHeading).toBeInTheDocument();
    expect(tasksHeading.textContent).toBe('Tasks');
  });
});