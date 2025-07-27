import { useState } from 'react'

interface AddTaskFormProps {
  onAddTask: (task: string) => void
}

export function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [taskText, setTaskText] = useState('')

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