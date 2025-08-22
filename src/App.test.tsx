import { render, screen } from '@testing-library/react';
import App from './App';
import { TaskService } from './services/taskService';

// This tells Jest to use fake versions of TaskService functions
jest.mock('./services/taskService', () => ({
  TaskService: {
    fetchTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
}));

describe('App - Task Count Display', () => {
  beforeEach(() => {
    // Clear all fake function calls before each test
    jest.clearAllMocks();
  });

  test('displays "Tasks" when there are no active tasks', async () => {
    // Step 1: Set up fake data
    (TaskService.fetchTasks as jest.Mock).mockResolvedValue([]);
    
    // Step 2: Render your component
    render(<App />);
    
    // Step 3: Wait for the component to finish loading
    await screen.findByText('Tasks');
    
    // Step 4: Check that it shows just "Tasks" (no count)
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    
    // Step 5: Make sure it doesn't show a count
    expect(screen.queryByText(/Tasks \(\d+\)/)).not.toBeInTheDocument();
  });
});