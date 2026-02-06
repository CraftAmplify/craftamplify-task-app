/**
 * Application-wide constants and configuration values
 * Centralizes magic numbers, API endpoints, and other configuration
 */

/** API Configuration */
export const API_CONFIG = {
  /** Base URL for the JSON Server API */
  BASE_URL: 'http://localhost:3000',
  /** Default timeout for API requests in milliseconds */
  TIMEOUT: 5000,
} as const

/** Animation and Timing Constants */
export const ANIMATION = {
  /** Duration for task deletion animation in milliseconds */
  DELETE_DURATION: 300,
  /** Duration for task movement animation in milliseconds */
  MOVE_DURATION: 150,
  /** Duration for task addition animation in milliseconds */
  ADD_DURATION: 400,
  /** General transition duration for UI elements in milliseconds */
  TRANSITION_DURATION: 200,
} as const

/** Swipe Gesture Configuration */
export const SWIPE = {
  /** Maximum distance the delete button can be revealed in pixels */
  MAX_DISTANCE: 80,
  /** Minimum swipe distance required to trigger delete button reveal in pixels */
  THRESHOLD: 40,
} as const

/** UI Configuration */
export const UI = {
  /** Maximum width for the main application container in pixels */
  MAX_WIDTH: 1000,
  /** Standard padding for content areas in pixels */
  CONTENT_PADDING: 16,
} as const

/** Error Messages */
export const ERROR_MESSAGES = {
  /** Generic error message for failed API requests */
  GENERIC: 'Something went wrong. Please try again.',
  /** Error message when tasks fail to load */
  FETCH_TASKS: 'Failed to load tasks. Please refresh the page and try again.',
  /** Error message when a new task fails to be added */
  ADD_TASK: 'Failed to add task. Please check your connection and try again.',
  /** Error message when task update fails */
  UPDATE_TASK: 'Failed to update task. Please try again.',
  /** Error message when task deletion fails */
  DELETE_TASK: 'Failed to delete task. Please try again.',
  /** Error message when the server is unreachable */
  NETWORK_ERROR: 'Unable to connect to the server. Please check your connection.',
} as const

/** Loading Messages */
export const LOADING_MESSAGES = {
  /** Message displayed while tasks are being fetched */
  LOADING_TASKS: 'Loading tasks...',
  /** Message displayed while a task is being added */
  ADDING_TASK: 'Adding task...',
  /** Message displayed while a task is being updated */
  UPDATING_TASK: 'Updating task...',
  /** Message displayed while a task is being deleted */
  DELETING_TASK: 'Deleting task...',
} as const 