import { render, screen, waitFor } from '@testing-library/react'
import App from './App'
import { TaskService } from '@/services/taskService'

jest.mock('@/services/taskService')

describe('App - Task Count Display', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  test('displays "Tasks" when there are no open tasks', async () => {
    jest.mocked(TaskService.fetchTasks).mockResolvedValue([])
    render(<App />)
    await waitFor(() => {
      expect(screen.queryByText(/Loading tasks/)).not.toBeInTheDocument()
    })
    const heading = screen.getByRole('heading', { level: 2, name: /^Tasks/ })
    expect(heading).toHaveTextContent('Tasks')
    expect(heading).not.toHaveTextContent('(')
  })

  test('displays "Tasks" when all tasks are completed', async () => {
    jest.mocked(TaskService.fetchTasks).mockResolvedValue([
      { id: '1', text: 'Completed task 1', completed: true },
      { id: '2', text: 'Completed task 2', completed: true }
    ])
    render(<App />)
    await waitFor(() => {
      expect(screen.queryByText(/Loading tasks/)).not.toBeInTheDocument()
    })
    const heading = screen.getByRole('heading', { level: 2, name: /^Tasks/ })
    expect(heading).toHaveTextContent('Tasks')
    expect(heading).not.toHaveTextContent('(')
  })

  test('displays "Tasks (N)" when there are open tasks', async () => {
    jest.mocked(TaskService.fetchTasks).mockResolvedValue([
      { id: '1', text: 'Open task 1', completed: false },
      { id: '2', text: 'Open task 2', completed: false },
      { id: '3', text: 'Completed task', completed: true }
    ])
    render(<App />)
    await waitFor(() => {
      expect(screen.queryByText(/Loading tasks/)).not.toBeInTheDocument()
    })
    const heading = screen.getByRole('heading', { level: 2, name: /^Tasks/ })
    expect(heading).toHaveTextContent('Tasks (2)')
  })
})