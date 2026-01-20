import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { TaskService } from './services/taskService';
import type { Task } from './services/taskService';

// Mock the TaskService
jest.mock('./services/taskService');

describe('App - Task Count Display', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('displays "Tasks (N)" when there are open tasks', async () => {
        // ARRANGE: Create fake tasks (2 open, 1 completed)
        const mockTasks: Task[] = [
          { id: '1', text: 'Task 1', completed: false },
          { id: '2', text: 'Task 2', completed: false },
          { id: '3', text: 'Task 3', completed: true },
        ];
        
        // Tell TaskService.fetchTasks to return our fake tasks
        (TaskService.fetchTasks as jest.Mock).mockResolvedValue(mockTasks);
      
        // ACT: Render the App component
        render(<App />);
      
        // Wait for the loading to finish (App fetches tasks when it loads)
        await waitFor(() => {
          expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
        });
      
        // ASSERT: Check that the header shows "Tasks (2)"
        const headings = screen.getAllByRole('heading');
        const tasksHeader = headings.find(heading => heading.tagName === 'H2');
        expect(tasksHeader).toHaveTextContent(`Tasks (${mockTasks.filter(t => !t.completed).length})`);
      });
  });
