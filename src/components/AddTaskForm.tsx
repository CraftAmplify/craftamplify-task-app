import { useState } from 'react'

/**
 * Props interface for the AddTaskForm component
 */
interface AddTaskFormProps {
  /** Callback function executed when a new task is submitted */
  onAddTask: (task: string) => void
}

/**
 * AddTaskForm Component
 * 
 * Provides a form interface for adding new tasks to the task list.
 * Features input validation, proper form submission handling, and
 * automatic input clearing after successful submission.
 * 
 * Features:
 * - Real-time input validation (trims whitespace)
 * - Submit on Enter key or button click
 * - Automatic input clearing after submission
 * - Disabled state for empty inputs
 * 
 * @param props - The component props
 * @returns JSX element representing the task input form
 */
export function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  /** Current value of the task input field */
  const [taskText, setTaskText] = useState('')

  /**
   * Handles form submission
   * Prevents default form behavior, validates input, and calls onAddTask
   * Clears the input field after successful submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (taskText.trim()) {
      onAddTask(taskText.trim())
      setTaskText('') // Clear the input field
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Add a new task..."
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          className="w-full border border-gray-250 rounded-md px-3 py-2 font-inter text-base focus:outline-none focus:border-craft-pink focus:ring-2 focus:ring-craft-pink/10 transition-colors"
        />
      </div>
      <button
        type="submit"
        disabled={!taskText.trim()}
        className="bg-craft-pink text-white border-none rounded-md px-4 py-2 font-inter font-medium text-sm cursor-pointer transition-colors hover:bg-[#a4129a] disabled:bg-gray-250 disabled:cursor-not-allowed"
      >
        Add
      </button>
    </form>
  )
} 