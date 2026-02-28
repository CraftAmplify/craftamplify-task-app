import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { TaskService } from '@/services/taskService';

// Mock the TaskService
jest.mock('@/services/taskService');

describe('App - Open Task Count Display', () => {
    beforeEach(() => {
      // Clear all mocks before each test
      jest.clearAllMocks();
    });
  
    test('displays "Tasks" without count when there are no open tasks', async () => {
        // 🔵 ARRANGE: Set up fake data
        // Create fake tasks that are all completed
        const mockTasks = [
          { id: '1', text: 'Completed task 1', completed: true },
          { id: '2', text: 'Completed task 2', completed: true }
        ];
        
        // Tell the fake TaskService to return these tasks
        (TaskService.fetchTasks as jest.Mock).mockResolvedValue(mockTasks);
        
        // 🟢 ACT: Render your App component
        render(<App />);
        
        // Wait for loading to complete
        await waitFor(() => {
          expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
        });
        
        // 🟡 ASSERT: Check if it shows what we expect
        // Find the h2 heading (the "Tasks" header)
        const header = screen.getByRole('heading', { level: 2 });
        
        // Check that it says "Tasks" (not "Tasks (2)")
        expect(header).toHaveTextContent('Tasks');
        expect(header).not.toHaveTextContent('(');
      });
  test('displays "Tasks (1)" when there is one open task', async () => {
    // Mock API to return one open task and one completed task
    const mockTasks = [
      { id: '1', text: 'Open task', completed: false },
      { id: '2', text: 'Completed task', completed: true }
    ];
    
    (TaskService.fetchTasks as jest.Mock).mockResolvedValue(mockTasks);
    
    render(<App />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
    });
    
    // Check that header shows "Tasks (1)"
    const header = screen.getByRole('heading', { level: 2 });
    expect(header).toHaveTextContent('Tasks (1)');
  });

  test('displays "Tasks (5)" when there are five open tasks', async () => {
    // Mock API to return five open tasks and two completed tasks
    const mockTasks = [
      { id: '1', text: 'Open task 1', completed: false },
      { id: '2', text: 'Open task 2', completed: false },
      { id: '3', text: 'Open task 3', completed: false },
      { id: '4', text: 'Open task 4', completed: false },
      { id: '5', text: 'Open task 5', completed: false },
      { id: '6', text: 'Completed task 1', completed: true },
      { id: '7', text: 'Completed task 2', completed: true }
    ];
    
    (TaskService.fetchTasks as jest.Mock).mockResolvedValue(mockTasks);
    
    render(<App />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
    });
    
    // Check that header shows "Tasks (5)"
    const header = screen.getByRole('heading', { level: 2 });
    expect(header).toHaveTextContent('Tasks (5)');
  });

  test('displays "Tasks" without count when all tasks are completed', async () => {
    // Mock API to return three completed tasks
    const mockTasks = [
      { id: '1', text: 'Completed task 1', completed: true },
      { id: '2', text: 'Completed task 2', completed: true },
      { id: '3', text: 'Completed task 3', completed: true }
    ];
    
    (TaskService.fetchTasks as jest.Mock).mockResolvedValue(mockTasks);
    
    render(<App />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
    });
    
    // Check that header shows "Tasks" without count
    const header = screen.getByRole('heading', { level: 2 });
    expect(header).toHaveTextContent('Tasks');
    expect(header).not.toHaveTextContent('(');
  });

  test('displays "Tasks" without count when there are no tasks at all', async () => {
    // Mock API to return empty array
    (TaskService.fetchTasks as jest.Mock).mockResolvedValue([]);
    
    render(<App />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
    });
    
    // Check that header shows "Tasks" without count
    const header = screen.getByRole('heading', { level: 2 });
    expect(header).toHaveTextContent('Tasks');
    expect(header).not.toHaveTextContent('(');
  });
});