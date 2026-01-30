import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { TaskService, type Task } from '@/services/taskService';

// Mock the TaskService module
jest.mock('@/services/taskService');

describe('App - Task Count Display', () => {
    beforeEach(() => {
      // Clear all mocks before each test
      jest.clearAllMocks();
    });
  
    test('displays "Tasks" when there are no open tasks', async () => {
        // Arrange: Set up mock data
        const mockTasks: Task[] = [
          { id: '1', text: 'Completed task 1', completed: true },
          { id: '2', text: 'Completed task 2', completed: true },
        ];
      
        // Mock what TaskService.fetchTasks returns
        (TaskService.fetchTasks as jest.Mock).mockResolvedValue(mockTasks);

        // Act: Render the App component (STEP 6 goes here)
  render(<App />);

    // Wait for loading to complete
    await waitFor(() => {
        expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
      });

        // Assert: Check that the header shows "Tasks" without count
  const tasksHeader = screen.getByRole('heading', { name: /^Tasks$/ });
  expect(tasksHeader).toBeInTheDocument();
  expect(tasksHeader.textContent).toBe('Tasks');
});

  });

  