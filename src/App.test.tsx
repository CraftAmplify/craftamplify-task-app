import { render, screen, waitFor, act } from '@testing-library/react';
import App from './App';

// Mock the TaskService
jest.mock('./services/taskService', () => ({
  TaskService: {
    fetchTasks: jest.fn().mockResolvedValue([]),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
  TaskServiceError: class extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'TaskServiceError';
    }
  }
}));

// Mock the constants
jest.mock('./constants', () => ({
  ANIMATION: {
    DELETE_DURATION: 300,
    MOVE_DURATION: 300
  },
  LOADING_MESSAGES: {
    LOADING_TASKS: 'Loading tasks...'
  }
}));

describe('App', () => {
  test('renders without crashing', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Just check that the app renders
    expect(screen.getByText('CraftAmplify Tasks')).toBeInTheDocument();
  });

  test('shows no count when there are no open tasks', async () => {
    await act(async () => {
      render(<App />);
    });
    
    await waitFor(() => {
      const header = screen.getByText('Tasks');
      expect(header).toBeInTheDocument();
      // Use trim() to handle any extra whitespace
      expect(header.textContent?.trim()).toBe('Tasks');
    });
  });
});
