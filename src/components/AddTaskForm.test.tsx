import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddTaskForm } from './AddTaskForm'

const mockOnAddTask = jest.fn()

describe('AddTaskForm', () => {
  beforeEach(() => {
    mockOnAddTask.mockClear()
  })

  test('renders correctly with input field and button', () => {
    render(<AddTaskForm onAddTask={mockOnAddTask} />)

    const inputField = screen.getByPlaceholderText('Add a new task...')
    expect(inputField).toBeInTheDocument()

    const addButton = screen.getByRole('button', { name: /add/i })
    expect(addButton).toBeInTheDocument()
  })

  test('button is disabled when input is empty', () => {
    render(<AddTaskForm onAddTask={mockOnAddTask} />)

    const addButton = screen.getByRole('button', { name: /add/i })
    expect(addButton).toBeDisabled()
  })

  test('button is enabled when input has text', () => {
    render(<AddTaskForm onAddTask={mockOnAddTask} />)

    const inputField = screen.getByPlaceholderText('Add a new task...')
    const addButton = screen.getByRole('button', { name: /add/i })

    expect(addButton).toBeDisabled()
    fireEvent.change(inputField, { target: { value: 'Test task' } })
    expect(addButton).toBeEnabled()
  })

  test('calls onAddTask when form is submitted with valid input', () => {
    render(<AddTaskForm onAddTask={mockOnAddTask} />)

    const inputField = screen.getByPlaceholderText('Add a new task...')
    const addButton = screen.getByRole('button', { name: /add/i })

    fireEvent.change(inputField, { target: { value: 'New test task' } })
    fireEvent.click(addButton)
    expect(mockOnAddTask).toHaveBeenCalledWith('New test task')
    expect(mockOnAddTask).toHaveBeenCalledTimes(1)
  })

  test('calls onAddTask when Enter key is pressed', async () => {
    render(<AddTaskForm onAddTask={mockOnAddTask} />)

    const inputField = screen.getByPlaceholderText('Add a new task...')

    await userEvent.type(inputField, 'Task with Enter key{enter}')
    expect(mockOnAddTask).toHaveBeenCalledWith('Task with Enter key')
    expect(mockOnAddTask).toHaveBeenCalledTimes(1)
  })

  test('clears input field after successful submission', () => {
    render(<AddTaskForm onAddTask={mockOnAddTask} />)

    const inputField = screen.getByPlaceholderText(
      'Add a new task...'
    ) as HTMLInputElement
    const addButton = screen.getByRole('button', { name: /add/i })

    fireEvent.change(inputField, { target: { value: 'Task to clear' } })
    expect(inputField.value).toBe('Task to clear')

    fireEvent.click(addButton)
    expect(inputField.value).toBe('')
  })

  test('does not call onAddTask when input is empty or only whitespace', () => {
    render(<AddTaskForm onAddTask={mockOnAddTask} />)

    const inputField = screen.getByPlaceholderText('Add a new task...')
    const addButton = screen.getByRole('button', { name: /add/i })

    fireEvent.click(addButton)
    expect(mockOnAddTask).not.toHaveBeenCalled()

    fireEvent.change(inputField, { target: { value: '   ' } })
    fireEvent.click(addButton)
    expect(mockOnAddTask).not.toHaveBeenCalled()
  })

  test('trims whitespace from input before calling onAddTask', () => {
    render(<AddTaskForm onAddTask={mockOnAddTask} />)

    const inputField = screen.getByPlaceholderText('Add a new task...')
    const addButton = screen.getByRole('button', { name: /add/i })

    fireEvent.change(inputField, { target: { value: '  Trimmed task  ' } })
    fireEvent.click(addButton)

    expect(mockOnAddTask).toHaveBeenCalledWith('Trimmed task')
  })
})
