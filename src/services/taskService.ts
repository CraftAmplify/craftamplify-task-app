import { API_CONFIG, ERROR_MESSAGES } from '@/constants'

export interface Task {
  id: string
  text: string
  completed: boolean
}

export interface CreateTaskRequest {
  text: string
  completed: boolean
}

export interface UpdateTaskRequest {
  completed?: boolean
  text?: string
}

/** Error returned by task API operations. */
export class TaskServiceError extends Error {
  public statusCode?: number
  public originalError?: Error

  constructor(message: string, statusCode?: number, originalError?: Error) {
    super(message)
    this.name = 'TaskServiceError'
    this.statusCode = statusCode
    this.originalError = originalError
  }
}

export class TaskService {
  static async fetchTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/tasks`)

      if (!response.ok) {
        throw new TaskServiceError(ERROR_MESSAGES.FETCH_TASKS, response.status)
      }

      const tasks: Task[] = await response.json()
      return tasks
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

  static async createTask(taskData: CreateTaskRequest): Promise<Task> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      })

      if (!response.ok) {
        throw new TaskServiceError(ERROR_MESSAGES.ADD_TASK, response.status)
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

  static async updateTask(
    taskId: string,
    updates: UpdateTaskRequest
  ): Promise<Task> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new TaskServiceError(ERROR_MESSAGES.UPDATE_TASK, response.status)
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

  static async deleteTask(taskId: string): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new TaskServiceError(ERROR_MESSAGES.DELETE_TASK, response.status)
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
