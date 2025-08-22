import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { TaskService } from '@/services/taskService';

// Mock the TaskService (we'll explain this later)
jest.mock('@/services/taskService');
const mockTaskService = TaskService as jest.Mocked<typeof TaskService>;

describe('App - Task Count Display', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('displays "Tasks" when no tasks exist', async () => {
    // Step 1: Setup - Mock empty task list
    mockTaskService.fetchTasks.mockResolvedValue([]);
  
    // Step 2: Execute - Render the App component
    render(<App />);
  
    // Step 3: Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
    });
  
    // Step 4: Verify - Check the result
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.queryByText(/Tasks \(\d+\)/)).not.toBeInTheDocument();
  });
});