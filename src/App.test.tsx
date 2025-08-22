import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { TaskService } from './services/taskService';

// This tells Jest to create a fake version of TaskService
jest.mock('./services/taskService');
const mockTaskService = TaskService as jest.Mocked<typeof TaskService>;

describe('App - Task Count Display', () => {
  beforeEach(() => {
    // This runs before each test to reset everything
    jest.clearAllMocks();
    mockTaskService.fetchTasks.mockResolvedValue([]);
  });

  test('displays "Tasks" when there are no tasks', async () => {
    // ARRANGE: Set up the test conditions
    mockTaskService.fetchTasks.mockResolvedValue([]);
    
    // ACT: Do the thing we want to test
    render(<App />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
    });
    
    // ASSERT: Check if it worked correctly
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Tasks');
  });
});
