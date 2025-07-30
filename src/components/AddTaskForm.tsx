import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

/**
 * Props interface for the AddTaskForm component
 */
interface AddTaskFormProps {
  /** Callback function executed when a new task is submitted */
  onAddTask: (task: string) => void
}

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
        <Input
          type="text"
          placeholder="Add a new task..."
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
      </div>
      <Button
        type="submit"
        disabled={!taskText.trim()}
        variant="craft"
        size="default"
      >
        Add
      </Button>
    </form>
  )
} 