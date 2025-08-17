import { render } from '@testing-library/react';
import { screen, fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { AddTaskForm } from './AddTaskForm';

// Mock the onAddTask function
const mockOnAddTask = jest.fn();

describe('AddTaskForm', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    mockOnAddTask.mockClear();
  });

  test('renders correctly with input field and button', () => {
    render(<AddTaskForm onAddTask={mockOnAddTask} />);
    
    // Check if input field is present
    const inputField = screen.getByPlaceholderText('Add a new task...');
    expect(inputField).toBeInTheDocument();
    
    // Check if button is present
    const addButton = screen.getByRole('button', { name: /add/i });
    expect(addButton).toBeInTheDocument();
  });

  test('button is disabled when input is empty', () => {
    render(<AddTaskForm onAddTask={mockOnAddTask} />);
    
    const addButton = screen.getByRole('button', { name: /add/i });
    expect(addButton).toBeDisabled();
  });

  test('button is enabled when input has text', () => {
    render(<AddTaskForm onAddTask={mockOnAddTask} />);
    
    const inputField = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByRole('button', { name: /add/i });
    
    // Initially disabled
    expect(addButton).toBeDisabled();
    
    // Type in the input field
    fireEvent.change(inputField, { target: { value: 'Test task' } });
    
    // Button should now be enabled
    expect(addButton).toBeEnabled();
  });

  test('calls onAddTask when form is submitted with valid input', () => {
    render(<AddTaskForm onAddTask={mockOnAddTask} />);
    
    const inputField = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByRole('button', { name: /add/i });
    
    // Type in the input field
    fireEvent.change(inputField, { target: { value: 'New test task' } });
    
    // Submit the form
    fireEvent.click(addButton);
    
    // Check if onAddTask was called with the correct value
    expect(mockOnAddTask).toHaveBeenCalledWith('New test task');
    expect(mockOnAddTask).toHaveBeenCalledTimes(1);
  });

  test('calls onAddTask when Enter key is pressed', async () => {
    render(<AddTaskForm onAddTask={mockOnAddTask} />);
    
    const inputField = screen.getByPlaceholderText('Add a new task...');
    
    // Type in the input field and press Enter
    await userEvent.type(inputField, 'Task with Enter key{enter}');
    
    // Check if onAddTask was called
    expect(mockOnAddTask).toHaveBeenCalledWith('Task with Enter key');
    expect(mockOnAddTask).toHaveBeenCalledTimes(1);
  });

  test('clears input field after successful submission', () => {
    render(<AddTaskForm onAddTask={mockOnAddTask} />);
    
    const inputField = screen.getByPlaceholderText('Add a new task...') as HTMLInputElement;
    const addButton = screen.getByRole('button', { name: /add/i });
    
    // Type in the input field
    fireEvent.change(inputField, { target: { value: 'Task to clear' } });
    expect(inputField.value).toBe('Task to clear');
    
    // Submit the form
    fireEvent.click(addButton);
    
    // Input should be cleared
    expect(inputField.value).toBe('');
  });

  test('does not call onAddTask when input is empty or only whitespace', () => {
    render(<AddTaskForm onAddTask={mockOnAddTask} />);
    
    const inputField = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByRole('button', { name: /add/i });
    
    // Try to submit with empty input
    fireEvent.click(addButton);
    expect(mockOnAddTask).not.toHaveBeenCalled();
    
    // Try to submit with only whitespace
    fireEvent.change(inputField, { target: { value: '   ' } });
    fireEvent.click(addButton);
    expect(mockOnAddTask).not.toHaveBeenCalled();
  });

  test('trims whitespace from input before calling onAddTask', () => {
    render(<AddTaskForm onAddTask={mockOnAddTask} />);
    
    const inputField = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByRole('button', { name: /add/i });
    
    // Type with leading and trailing whitespace
    fireEvent.change(inputField, { target: { value: '  Trimmed task  ' } });
    fireEvent.click(addButton);
    
    // Should call onAddTask with trimmed value
    expect(mockOnAddTask).toHaveBeenCalledWith('Trimmed task');
  });
}); 