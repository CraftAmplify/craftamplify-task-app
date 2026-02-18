import { render, screen } from '@testing-library/react';
import App from './App';
import { TaskService } from '@/services/taskService';
jest.mock('@/services/taskService');
describe('App', () => {
    beforeEach(() => {
      (TaskService.fetchTasks as jest.Mock).mockResolvedValue([]);
      (TaskService.createTask as jest.Mock).mockResolvedValue({ id: '1', text: 'New', completed: false });
      (TaskService.updateTask as jest.Mock).mockResolvedValue({});
      (TaskService.deleteTask as jest.Mock).mockResolvedValue(undefined);
    });
  
    test('shows "Tasks" when there are no open tasks', async () => {
      render(<App />);
  
      const heading = await screen.findByRole('heading', { name: 'Tasks' });
  
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Tasks');
    });
  });