import React from 'react'
import type { Task } from '@/services/taskService'
import { useSwipeToDelete } from '@/hooks/useSwipeToDelete'
import { Checkbox } from './ui/checkbox'

/**
 * Props interface for the TaskItem component
 */
interface TaskItemProps {
  /** The task data to display */
  task: Task
  /** Callback function when task completion status is toggled */
  onToggle: (id: string, completed: boolean) => void
  /** Callback function when task is deleted */
  onDelete: (id: string) => void
  /** Callback function when swipe-to-delete is opened */
  onSwipeOpen: (elementRef: React.RefObject<HTMLDivElement | null>) => void
  /** Whether the task is currently being deleted (for animation) */
  isDeleting: boolean
  /** Whether the task is currently being moved (for animation) */
  isMoving: boolean
  /** Whether the task is currently being added (for animation) */
  isAdding: boolean
}

/**
 * TaskItem Component
 * 
 * Displays an individual task with interactive features:
 * - Checkbox to toggle completion status
 * - Swipe-to-delete functionality on touch devices
 * - Hover-to-delete button on desktop devices
 * - Smooth animations for state changes
 * 
 * @param props - The component props
 * @returns JSX element representing a single task item
 */
export function TaskItem({
  task,
  onToggle,
  onDelete,
  onSwipeOpen,
  isDeleting,
  isMoving,
  isAdding
}: TaskItemProps) {
  // Initialize swipe-to-delete functionality
  const swipeHandlers = useSwipeToDelete({ 
    onDelete: () => onDelete(task.id),
    onSwipeOpen: onSwipeOpen
  })

  /**
   * Handles checkbox click to toggle task completion
   * Prevents event bubbling to avoid triggering parent click handlers
   */
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggle(task.id, task.completed)
  }

  /**
   * Handles hover delete button click
   * Prevents event bubbling and triggers deletion
   */
  const handleHoverDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(task.id)
  }

  return (
    <div
      ref={swipeHandlers.elementRef}
      className={`task-item ${isDeleting ? 'deleting' : ''} ${isMoving ? 'moving' : ''} ${isAdding ? 'adding' : ''}`}
      onTouchStart={swipeHandlers.handleTouchStart}
      onTouchMove={swipeHandlers.handleTouchMove}
      onTouchEnd={swipeHandlers.handleTouchEnd}
    >
      {/* Main task content area */}
      <div 
        className="task-content flex items-start gap-2 p-2 rounded cursor-pointer" 
        onClick={swipeHandlers.handleTaskClick}
      >
        {/* Design system checkbox for task completion */}
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id, task.completed)}
          onClick={handleCheckboxClick}
          className="mt-1"
          aria-label={`Mark task "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
        />

        {/* Task text with conditional styling for completed tasks */}
        <span 
          className={`task-text flex-1 ${
            task.completed ? 'completed-task' : ''
          }`}
        >
          {task.text}
        </span>
      </div>
      
      {/* Swipe delete button (revealed on touch devices when swiped) */}
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

      {/* Hover delete button (visible on desktop devices when hovering) */}
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