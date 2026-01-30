import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { TaskService } from '@/services/taskService';

jest.mock('@/services/taskService', () => ({
    TaskService: {
      fetchTasks: jest.fn(),
    },
    TaskServiceError: class TaskServiceError extends Error {
      constructor(message: string) {
        super(message);
        this.name = 'TaskServiceError';
      }
    },
  }));
  
  describe('App', () => {
    beforeEach(() => {
      jest.mocked(TaskService.fetchTasks).mockResolvedValue([]);
    });
  
    test('displays "Tasks" when there are no tasks', async () => {
      render(<App />);
  
      await waitFor(() => {
        expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
      });
  
      const tasksHeading = screen.getByRole('heading', { level: 2 });
      expect(tasksHeading).toHaveTextContent('Tasks');
    });
  });