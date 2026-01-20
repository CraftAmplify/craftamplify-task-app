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

  test('displays "Tasks" when there are no open tasks', async () => {
    // Create fake data - all tasks are completed
    const mockTasks: Task[] = [
      { id: '1', text: 'Completed task 1', completed: true },
      { id: '2', text: 'Completed task 2', completed: true },
    ];

    // Tell the mock to return our fake data
    (TaskService.fetchTasks as jest.Mock).mockResolvedValue(mockTasks);

    // Render the App component
    render(<App />);

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(TaskService.fetchTasks).toHaveBeenCalled();
    });

    // Check that the header shows "Tasks" (no count)
    const tasksHeader = screen.getByRole('heading', { name: /^Tasks$/ });
    expect(tasksHeader).toBeInTheDocument();
    expect(tasksHeader.textContent).toBe('Tasks');
  });
});