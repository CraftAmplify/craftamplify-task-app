import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { TaskService, type Task } from '@/services/taskService';

// Mock TaskService so we don't make real API calls
jest.mock('@/services/taskService', () => ({
  TaskService: {
    fetchTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
  TaskServiceError: class TaskServiceError extends Error {},
}));

describe('App - Task Count Display', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('displays "Tasks" without count when there are no open tasks', async () => {
    // Arrange: Create fake tasks (all completed)
    const mockTasks: Task[] = [
      { id: '1', text: 'Task 1', completed: true },
      { id: '2', text: 'Task 2', completed: true },
    ];
    
    // Tell the mock what to return
    (TaskService.fetchTasks as jest.Mock).mockResolvedValue(mockTasks);

    // Act: Render the component
    render(<App />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
    });

    // Assert: Check the heading says "Tasks" (no count)
    const heading = screen.getByRole('heading', { name: /^Tasks$/ });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toBe('Tasks');
  });

  test('displays "Tasks (N)" with correct count when there are open tasks', async () => {
    // Arrange: Create fake tasks - mix of open and completed
    const mockTasks: Task[] = [
      { id: '1', text: 'Open Task 1', completed: false },
      { id: '2', text: 'Open Task 2', completed: false },
      { id: '3', text: 'Completed Task', completed: true },
    ];
    
    // Tell the mock what to return
    (TaskService.fetchTasks as jest.Mock).mockResolvedValue(mockTasks);

    // Act: Render the component
    render(<App />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
    });

    // Assert: Check the heading shows "Tasks (2)" - only counting open tasks
    const heading = screen.getByRole('heading', { name: /^Tasks/ });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toBe('Tasks (2)');
  });
});