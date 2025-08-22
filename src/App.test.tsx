import { render, screen, waitFor, act } from '@testing-library/react'
import App from './App'

// Mock the TaskService to avoid API calls during tests
jest.mock('./services/taskService', () => ({
  TaskService: {
    fetchTasks: jest.fn().mockResolvedValue([
      { id: '1', text: 'Task 1', completed: false },
      { id: '2', text: 'Task 2', completed: true },
      { id: '3', text: 'Task 3', completed: false }
    ]),
    createTask: jest.fn().mockResolvedValue({ id: '4', text: 'New Task', completed: false }),
    updateTask: jest.fn().mockResolvedValue({}),
    deleteTask: jest.fn().mockResolvedValue({})
  }
}))

test('displays task count in heading', async () => {
  await act(async () => {
    render(<App />)
  })
  
  await waitFor(() => {
    const heading = screen.getByText(/Tasks \(\d+\)/)
    expect(heading).toBeInTheDocument()
  })
})

test('heading contains task count pattern', async () => {
  await act(async () => {
    render(<App />)
  })
  
  await waitFor(() => {
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent(/Tasks \([0-9]+\)/)
  })
})

test('tasks h2 heading exists', async () => {
  await act(async () => {
    render(<App />)
  })
  
  await waitFor(() => {
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toBeInTheDocument()
  })
})

test('shows correct task count', async () => {
  await act(async () => {
    render(<App />)
  })
  
  await waitFor(() => {
    // Should show "Tasks (2)" since there are 2 open tasks in the mock data
    const heading = screen.getByText('Tasks (2)')
    expect(heading).toBeInTheDocument()
  })
})
