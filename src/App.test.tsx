import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock the TaskService to avoid real API calls
jest.mock('./services/taskService', () => ({
  TaskService: {
    fetchTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
}));

describe('App Component', () => {
  test('displays count badge when there are incomplete tasks', async () => {
    // Mock data with incomplete tasks
    const mockTasks = [
      { id: '1', text: 'Task 1', completed: false },
      { id: '2', text: 'Task 2', completed: true },
      { id: '3', text: 'Task 3', completed: false },
    ];

    // Get the mocked TaskService and set up the mock
    const { TaskService } = jest.requireMock('./services/taskService');
    TaskService.fetchTasks.mockResolvedValue(mockTasks);

    // Render the App component
    render(<App />);

    // Wait for the loading to finish and count badge to appear
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    // Check if it's inside a circular badge
    const countBadge = screen.getByText('2');
    const badgeContainer = countBadge.closest('div');
    expect(badgeContainer).toHaveClass('rounded-full');
  });
});
