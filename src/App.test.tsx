import { render, screen } from '@testing-library/react'
import App from './App'

// Mock the TaskService to control what it returns
jest.mock('@/services/taskService', () => ({
  TaskService: {
    fetchTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
  TaskServiceError: class extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'TaskServiceError'
    }
  },
}))

// Mock the constants
jest.mock('@/constants', () => ({
  ANIMATION: {
    DELETE_DURATION: 300,
    MOVE_DURATION: 300,
  },
  LOADING_MESSAGES: {
    LOADING_TASKS: 'Loading tasks...',
  },
}))

describe('App Component', () => {
  // This runs before each test to reset everything
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  // Your first test! Let's test the task count display
  test('shows task count when there are active tasks', async () => {
    // Arrange: Set up the test data
    const mockTasks = [
      { id: '1', text: 'Active task 1', completed: false },
      { id: '2', text: 'Active task 2', completed: false },
      { id: '3', text: 'Completed task', completed: true },
    ]

    // Mock the TaskService to return our test data
    const { TaskService } = require('@/services/taskService')
    TaskService.fetchTasks.mockResolvedValue(mockTasks)

    // Act: Render the component
    render(<App />)

    // Assert: Check that the task count is displayed correctly
    // We expect to see "Tasks (2)" because there are 2 active tasks
    expect(screen.getByText('Tasks (2)')).toBeInTheDocument()
  })
})
