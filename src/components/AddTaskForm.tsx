import { useState } from 'react'
import confetti from 'canvas-confetti'
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
   * Triggers confetti explosion from the button
   */
  const triggerConfetti = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (rect.left + rect.width / 2) / window.innerWidth
    const y = (rect.top + rect.height / 2) / window.innerHeight

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x, y },
      colors: ['#C616B2', '#a4129a', '#2783BF', '#1e6a9e'],
    })
  }

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
          inputSize="lg"
        />
      </div>
      <Button
        type="submit"
        disabled={!taskText.trim()}
        variant="craft"
        size="lg"
        className="wiggle-on-hover"
        onClick={triggerConfetti}
      >
        Add
      </Button>
    </form>
  )
} 