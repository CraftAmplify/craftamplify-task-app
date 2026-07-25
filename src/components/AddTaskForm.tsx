import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface AddTaskFormProps {
  onAddTask: (task: string) => void
}

export function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [taskText, setTaskText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (taskText.trim()) {
      onAddTask(taskText.trim())
      setTaskText('')
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
        size="default"
      >
        Add
      </Button>
    </form>
  )
}
