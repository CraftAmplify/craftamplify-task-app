import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { TaskService } from '@/services/taskService';

// Mock the TaskService
jest.mock('@/services/taskService');

describe('App - Task Count', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays "Tasks" when there are no open tasks', async () => {
    // Arrange: Set up test data with all tasks completed
    const mockTasks = [
      { id: '1', text: 'Completed task 1', completed: true },
      { id: '2', text: 'Completed task 2', completed: true }
    ];

    // Mock the fetchTasks method to return our test data
    (TaskService.fetchTasks as jest.Mock).mockResolvedValue(mockTasks);

    // Act: Render the App component
    render(<App />);

    // Wait for the async fetch to complete
    await waitFor(() => {
      expect(TaskService.fetchTasks).toHaveBeenCalled();
    });

    // Assert: Check that heading shows "Tasks" without count
    const heading = screen.getByRole('heading', { level: 2, name: /tasks/i });
    expect(heading).toHaveTextContent('Tasks');
    expect(heading).not.toHaveTextContent('Tasks (');
  });
});
