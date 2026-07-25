import { act, fireEvent, render, screen } from '@testing-library/react'
import App from './App'
import { ANIMATION, ERROR_MESSAGES } from './constants'
import { TaskService, TaskServiceError } from './services/taskService'

const tasks = [
  { id: '1', text: 'First task', completed: false },
  { id: '2', text: 'Second task', completed: false },
]

const renderApp = async () => {
  render(<App />)
  await screen.findByText('First task')
}

describe('App request failures', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
    jest.spyOn(TaskService, 'fetchTasks').mockResolvedValue(tasks)
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  it('shows an update error and clears the moving state', async () => {
    jest
      .spyOn(TaskService, 'updateTask')
      .mockRejectedValue(new TaskServiceError(ERROR_MESSAGES.UPDATE_TASK))

    await renderApp()
    fireEvent.click(screen.getAllByRole('checkbox')[0])

    const taskItem = screen.getByText('First task').closest('.task-item')
    expect(taskItem).toHaveClass('moving')

    await act(async () => {
      jest.advanceTimersByTime(ANIMATION.MOVE_DURATION)
      await Promise.resolve()
    })

    expect(screen.getByText(ERROR_MESSAGES.UPDATE_TASK)).toBeInTheDocument()
    expect(taskItem).not.toHaveClass('moving')
  })

  it('shows a delete error and clears the deleting state', async () => {
    jest
      .spyOn(TaskService, 'deleteTask')
      .mockRejectedValue(new TaskServiceError(ERROR_MESSAGES.DELETE_TASK))

    await renderApp()
    fireEvent.click(
      screen.getAllByRole('button', { name: 'Delete task: First task' })[0]
    )

    const taskItem = screen.getByText('First task').closest('.task-item')
    expect(taskItem).toHaveClass('deleting')

    await act(async () => {
      jest.advanceTimersByTime(ANIMATION.DELETE_DURATION)
      await Promise.resolve()
    })

    expect(screen.getByText(ERROR_MESSAGES.DELETE_TASK)).toBeInTheDocument()
    expect(taskItem).not.toHaveClass('deleting')
  })
})
