import React from 'react'
import type { Task } from '@/services/taskService'
import { useSwipeToDelete } from '@/hooks/useSwipeToDelete'

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
  isMoving
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
      className={`task-item ${isDeleting ? 'deleting' : ''} ${isMoving ? 'moving' : ''}`}
      onTouchStart={swipeHandlers.handleTouchStart}
      onTouchMove={swipeHandlers.handleTouchMove}
      onTouchEnd={swipeHandlers.handleTouchEnd}
    >
      {/* Main task content area */}
      <div 
        className="task-content flex items-start gap-2 p-2 rounded cursor-pointer" 
        onClick={swipeHandlers.handleTaskClick}
      >
        {/* Custom checkbox for task completion */}
        <div
          className={`checkbox-custom ${task.completed ? 'checked' : ''}`}
          onClick={handleCheckboxClick}
          role="checkbox"
          aria-checked={task.completed}
          aria-label={`Mark task "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
          tabIndex={0}
        >
          {task.completed && (
            <svg 
              className="w-3 h-3 text-white" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path 
                fillRule="evenodd" 
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
          )}
        </div>

        {/* Task text with conditional styling for completed tasks */}
        <span 
          className={`font-inter text-base leading-6 task-text flex-1 ${
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