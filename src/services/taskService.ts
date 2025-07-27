import { API_CONFIG, ERROR_MESSAGES } from '@/constants'

/**
 * Task interface defining the structure of a task object
 */
export interface Task {
  /** Unique identifier for the task */
  id: string
  /** The task description text */
  text: string
  /** Whether the task is completed */
  completed: boolean
}

/**
 * Interface for creating a new task (without ID)
 */
export interface CreateTaskRequest {
  /** The task description text */
  text: string
  /** Whether the task is completed (defaults to false) */
  completed: boolean
}

/**
 * Interface for updating an existing task
 */
export interface UpdateTaskRequest {
  /** Whether the task is completed */
  completed?: boolean
  /** The task description text */
  text?: string
}

/**
 * Custom error class for API-related errors
 * Provides more context than generic Error objects
 */
export class TaskServiceError extends Error {
  /** HTTP status code if available */
  public statusCode?: number
  /** Original error that caused this error */
  public originalError?: Error

  constructor(
    message: string,
    statusCode?: number,
    originalError?: Error
  ) {
    super(message)
    this.name = 'TaskServiceError'
    this.statusCode = statusCode
    this.originalError = originalError
  }
}

/**
 * Centralized service for all task-related API operations
 * Handles HTTP requests, error handling, and data transformation
 */
export class TaskService {
  /**
   * Fetches all tasks from the API
   * @returns Promise that resolves to an array of tasks
   * @throws TaskServiceError when the request fails
   */
  static async fetchTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/tasks`)
      
      if (!response.ok) {
        throw new TaskServiceError(
          ERROR_MESSAGES.FETCH_TASKS,
          response.status
        )
      }
      
      const tasks: Task[] = await response.json()
      return tasks
    } catch (error) {
      if (error instanceof TaskServiceError) {
        throw error
      }
      
      // Handle network errors or other fetch failures
      throw new TaskServiceError(
        ERROR_MESSAGES.NETWORK_ERROR,
        undefined,
        error as Error
      )
    }
  }

  /**
   * Creates a new task
   * @param taskData - The task data to create
   * @returns Promise that resolves to the created task
   * @throws TaskServiceError when the request fails
   */
  static async createTask(taskData: CreateTaskRequest): Promise<Task> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        throw new TaskServiceError(
          ERROR_MESSAGES.ADD_TASK,
          response.status
        )
      }

      const createdTask: Task = await response.json()
      return createdTask
    } catch (error) {
      if (error instanceof TaskServiceError) {
        throw error
      }
      
      throw new TaskServiceError(
        ERROR_MESSAGES.NETWORK_ERROR,
        undefined,
        error as Error
      )
    }
  }

  /**
   * Updates an existing task
   * @param taskId - The ID of the task to update
   * @param updates - The fields to update
   * @returns Promise that resolves to the updated task
   * @throws TaskServiceError when the request fails
   */
  static async updateTask(taskId: string, updates: UpdateTaskRequest): Promise<Task> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new TaskServiceError(
          ERROR_MESSAGES.UPDATE_TASK,
          response.status
        )
      }

      const updatedTask: Task = await response.json()
      return updatedTask
    } catch (error) {
      if (error instanceof TaskServiceError) {
        throw error
      }
      
      throw new TaskServiceError(
        ERROR_MESSAGES.NETWORK_ERROR,
        undefined,
        error as Error
      )
    }
  }

  /**
   * Deletes a task
   * @param taskId - The ID of the task to delete
   * @returns Promise that resolves when the task is deleted
   * @throws TaskServiceError when the request fails
   */
  static async deleteTask(taskId: string): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new TaskServiceError(
          ERROR_MESSAGES.DELETE_TASK,
          response.status
        )
      }
    } catch (error) {
      if (error instanceof TaskServiceError) {
        throw error
      }
      
      throw new TaskServiceError(
        ERROR_MESSAGES.NETWORK_ERROR,
        undefined,
        error as Error
      )
    }
  }
} 