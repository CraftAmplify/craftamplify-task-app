export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000'
} as const

export const ANIMATION = {
  DELETE_DURATION: 300,
  MOVE_DURATION: 150,
  TRANSITION_DURATION: 200
} as const

export const SWIPE = {
  MAX_DISTANCE: 80,
  THRESHOLD: 40
} as const

export const UI = {
  MAX_WIDTH: 1000,
  CONTENT_PADDING: 16
} as const

export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  FETCH_TASKS: 'Failed to load tasks. Please refresh the page and try again.',
  ADD_TASK: 'Failed to add task. Please check your connection and try again.',
  UPDATE_TASK: 'Failed to update task. Please try again.',
  DELETE_TASK: 'Failed to delete task. Please try again.',
  NETWORK_ERROR:
    'Unable to connect to the server. Please check your connection.'
} as const

export const LOADING_MESSAGES = {
  LOADING_TASKS: 'Loading tasks...',
  ADDING_TASK: 'Adding task...',
  UPDATING_TASK: 'Updating task...',
  DELETING_TASK: 'Deleting task...'
} as const
