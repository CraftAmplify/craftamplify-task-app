import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { TaskService } from '@/services/taskService';
import type { Task } from '@/services/taskService';

// Mock the TaskService so it doesn't make real API calls
jest.mock('@/services/taskService', () => ({
  TaskService: {
    fetchTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
  TaskServiceError: jest.fn(),
}));

// Mock TaskItem component to simplify the test
jest.mock('@/components/TaskItem', () => ({
  TaskItem: ({ task }: { task: Task }) => (
    <div data-testid={`task-${task.id}`}>{task.text}</div>
  ),
}));

describe('App - Task Count Display', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  test('displays "Tasks" without count when there are no open tasks', async () => {
    // ARRANGE: Set up test data
    const mockTasks: Task[] = [
      { id: '1', text: 'Completed task 1', completed: true },
      { id: '2', text: 'Completed task 2', completed: true },
    ];

    // Tell the mocked TaskService what to return
    (TaskService.fetchTasks as jest.Mock).mockResolvedValue(mockTasks);

    // ACT: Render the App component
    render(<App />);

    // ASSERT: Wait for the component to load, then check the heading
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /^Tasks$/ });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Tasks');
      expect(heading).not.toHaveTextContent('Tasks (');
    });
  });
});
