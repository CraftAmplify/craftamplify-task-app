import { render, screen } from '@testing-library/react';
import App from './App';
import { TaskService } from '@/services/taskService';

// Mock TaskService so we control the data
jest.mock('@/services/taskService');

describe('App - Task Count Display', () => {
    test('shows task count when there are open tasks', async () => {
        (TaskService.fetchTasks as jest.Mock).mockResolvedValue([
          { id: '1', text: 'Buy groceries', completed: false },
          { id: '2', text: 'Walk the dog', completed: false },
          { id: '3', text: 'Done task', completed: true },
        ]);
        (TaskService.createTask as jest.Mock).mockResolvedValue({});
        (TaskService.updateTask as jest.Mock).mockResolvedValue({});
        (TaskService.deleteTask as jest.Mock).mockResolvedValue(undefined);
        
        render(<App />);
        
        // Just wait directly for the text we expect
        const heading = await screen.findByText('Tasks (2)', {}, { timeout: 3000 });
        expect(heading).toBeInTheDocument();
      });
});