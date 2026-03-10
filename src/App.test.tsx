import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { TaskService } from '@/services/taskService';
import type { Task } from '@/services/taskService';

// Mock the TaskService so tests don't hit the real API
jest.mock('@/services/taskService');

const mockFetchTasks = TaskService.fetchTasks as jest.MockedFunction<typeof TaskService.fetchTasks>;
const mockUpdateTask = TaskService.updateTask as jest.MockedFunction<typeof TaskService.updateTask>;

describe('App', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    mockFetchTasks.mockReset();
    mockUpdateTask.mockReset();
  });

  test('displays open task count in heading when there are active tasks', async () => {
    const tasks: Task[] = [
      { id: '1', text: 'Buy groceries', completed: false },
      { id: '2', text: 'Walk the dog', completed: false },
      { id: '3', text: 'Read a book', completed: true },
    ];
    mockFetchTasks.mockResolvedValue(tasks);

    render(<App />);

    // Wait for tasks to load and heading to update
    const heading = await screen.findByRole('heading', { name: /tasks \(2\)/i });
    expect(heading).toBeInTheDocument();
  });

  test('does not display count in heading when there are no open tasks', async () => {
    const tasks: Task[] = [
      { id: '1', text: 'Buy groceries', completed: true },
      { id: '2', text: 'Walk the dog', completed: true },
    ];
    mockFetchTasks.mockResolvedValue(tasks);

    render(<App />);

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
    });

    // Heading should show "Tasks" with no count in parentheses
    const heading = screen.getByRole('heading', { name: /^tasks$/i });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).not.toMatch(/\(/);
  });

  test('updates task count when a task is marked complete', async () => {
    const tasks: Task[] = [
      { id: '1', text: 'Buy groceries', completed: false },
      { id: '2', text: 'Walk the dog', completed: false },
    ];
    mockFetchTasks.mockResolvedValue(tasks);
    mockUpdateTask.mockResolvedValue({ id: '1', text: 'Buy groceries', completed: true });

    render(<App />);

    // Wait for tasks to load and verify initial count
    await screen.findByRole('heading', { name: /tasks \(2\)/i });

    // Mark the first task as complete by clicking its checkbox
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    // Count should now reflect 1 open task
    await screen.findByRole('heading', { name: /tasks \(1\)/i });
  });
});
