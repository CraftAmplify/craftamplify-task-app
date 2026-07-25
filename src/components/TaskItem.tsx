import React from 'react'
import type { Task } from '@/services/taskService'
import { useSwipeToDelete } from '@/hooks/useSwipeToDelete'
import { Checkbox } from './ui/checkbox'

interface TaskItemProps {
  task: Task
  onToggle: (id: string, nextCompleted: boolean) => void
  onDelete: (id: string) => void
  onSwipeOpen: (elementRef: React.RefObject<HTMLDivElement | null>) => void
  isDeleting: boolean
  isMoving: boolean
}

export function TaskItem({ 
  task, 
  onToggle, 
  onDelete, 
  onSwipeOpen,
  isDeleting,
  isMoving
}: TaskItemProps) {
  const swipeHandlers = useSwipeToDelete({ 
    onDelete: () => onDelete(task.id),
    onSwipeOpen: onSwipeOpen
  })

  const handleHoverDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(task.id)
  }

  return (
    <div
      ref={swipeHandlers.elementRef}
      className={`task-item ${isDeleting ? 'deleting' : ''} ${isMoving ? 'moving' : ''}`}
      onTouchStart={swipeHandlers.handleTouchStart}
      onTouchMove={swipeHandlers.handleTouchMove}
      onTouchEnd={swipeHandlers.handleTouchEnd}
    >
      <div 
        className="task-content flex items-start gap-2 p-2 rounded cursor-pointer" 
        onClick={swipeHandlers.handleTaskClick}
      >
        <Checkbox
          checked={task.completed}
          onCheckedChange={(nextCompleted) => {
            if (typeof nextCompleted === 'boolean') {
              onToggle(task.id, nextCompleted)
            }
          }}
          className="mt-1"
          aria-label={`Mark task "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
        />

        <span 
          className={`task-text flex-1 ${
            task.completed ? 'completed-task' : ''
          }`}
        >
          {task.text}
        </span>
      </div>
      
      <button
        className="delete-button"
        onClick={swipeHandlers.handleDeleteClick}
        aria-label={`Delete task: ${task.text}`}
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
          />
        </svg>
      </button>

      <button
        className="hover-delete-button"
        onClick={handleHoverDeleteClick}
        aria-label={`Delete task: ${task.text}`}
      >
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
      </button>
    </div>
  )
}
