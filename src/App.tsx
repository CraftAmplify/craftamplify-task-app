import { useState, useEffect } from 'react'
import { AddTaskForm } from '@/components/AddTaskForm'
import { TaskItem } from '@/components/TaskItem'
import { TaskService, TaskServiceError, type Task } from '@/services/taskService'
import { ANIMATION, LOADING_MESSAGES } from '@/constants'
import { useConfetti } from '@/hooks/useConfetti'

/**
 * Main App Component
 * 
 * The root component that manages the task list application state and renders
 * the main UI including the header, task form, and task list.
 * 
 * Features:
 * - Task CRUD operations via TaskService
 * - Loading and error state management
 * - Task reordering (active tasks first, then completed)
 * - Smooth animations for task state changes
 * - Swipe-to-delete functionality coordination
 * 
 * @returns JSX element representing the complete task application
 */
function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openElementRef, setOpenElementRef] = useState<React.RefObject<HTMLDivElement | null> | null>(null)
  const [deletingTasks, setDeletingTasks] = useState<Set<string>>(new Set())
  const [movingTasks, setMovingTasks] = useState<Set<string>>(new Set())
  const { triggerConfetti } = useConfetti()
  const [addingTaskId, setAddingTaskId] = useState<string | null>(null)

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks()
  }, [])

  /**
   * Fetches all tasks from the API using TaskService
   * Handles loading states and error conditions with user-friendly messages
   */
  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const tasks = await TaskService.fetchTasks()
      setTasks(tasks)
    } catch (err) {
      console.error('Error fetching tasks:', err)
      if (err instanceof TaskServiceError) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handles adding a new task to the list
   * Uses TaskService to create the task and updates local state
   * 
   * @param taskText - The text content of the new task
   */
  const handleAddTask = async (taskText: string) => {
    try {
      setError(null)
      const newTaskData = {
        text: taskText,
        completed: false
      }

      const addedTask = await TaskService.createTask(newTaskData)

      // Add task and trigger animation
      setTasks(prevTasks => [addedTask, ...prevTasks]) // Add to beginning like the HTML version
      setAddingTaskId(addedTask.id)

      // Clear animation state after duration
      setTimeout(() => {
        setAddingTaskId(null)
      }, ANIMATION.ADD_DURATION)
    } catch (err) {
      console.error('Error adding task:', err)
      if (err instanceof TaskServiceError) {
        setError(err.message)
      } else {
        setError('Failed to add task. Please try again.')
      }
    }
  }

  /**
   * Handles toggling a task's completion status
   * Includes smart reordering logic and smooth animations when tasks change position
   * 
   * @param taskId - The ID of the task to toggle
   * @param completed - The current completion status of the task
   */
  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      setError(null)
      
      // Close any open swipe-to-delete buttons first
      if (openElementRef && openElementRef.current) {
        openElementRef.current.classList.remove('swiped')
        const taskContent = openElementRef.current.querySelector('.task-content') as HTMLElement
        if (taskContent) {
          taskContent.style.transform = 'translateX(0)'
        }
        setOpenElementRef(null)
      }
      
      // Check if the task will actually change position
      const currentTasks = [...tasks]
      const currentTask = currentTasks.find(t => t.id === taskId)
      if (!currentTask) return
      
      // Simulate the new order to check if position will change
      const updatedTasks = currentTasks.map(task =>
        task.id === taskId ? { ...task, completed: !completed } : task
      )
      
      const activeTasks = updatedTasks.filter(t => !t.completed)
      const completedTasks = updatedTasks.filter(t => t.completed)
      
      let newOrder: Task[]
      if (!completed) {
        // Task is being completed - move to top of completed section
        const newlyCompletedTask = completedTasks.find(t => t.id === taskId)
        const otherCompletedTasks = completedTasks.filter(t => t.id !== taskId)
        newOrder = [
          ...activeTasks,
          ...(newlyCompletedTask ? [newlyCompletedTask] : []),
          ...otherCompletedTasks
        ]
      } else {
        // Task is being uncompleted - move to top of active section
        const newlyActiveTask = activeTasks.find(t => t.id === taskId)
        const otherActiveTasks = activeTasks.filter(t => t.id !== taskId)
        newOrder = [
          ...(newlyActiveTask ? [newlyActiveTask] : []),
          ...otherActiveTasks,
          ...completedTasks
        ]
      }
      
      // Check if position actually changed
      const currentIndex = currentTasks.findIndex(t => t.id === taskId)
      const newIndex = newOrder.findIndex(t => t.id === taskId)
      const positionChanged = currentIndex !== newIndex
      
      if (positionChanged) {
        // Start the move-out animation
        setMovingTasks(prev => new Set(prev).add(taskId))

        // Wait for animation to complete, then update and reorder
        setTimeout(async () => {
          await TaskService.updateTask(taskId, { completed: !completed })

          // Trigger confetti when completing a task
          if (!completed) {
            triggerConfetti()
          }

          // Update the task completion status and reorder
          setTasks(newOrder)
          
          // End the move animation after a brief delay to allow for re-render
          setTimeout(() => {
            setMovingTasks(prev => {
              const newSet = new Set(prev)
              newSet.delete(taskId)
              return newSet
            })
          }, 50)
        }, ANIMATION.MOVE_DURATION) // Animation duration for move-out
      } else {
        // No position change, just update the completion status
        await TaskService.updateTask(taskId, { completed: !completed })

        // Trigger confetti when completing a task
        if (!completed) {
          triggerConfetti()
        }

        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, completed: !completed } : task
          )
        )
      }
      
    } catch (err) {
      console.error('Error updating task:', err)
      if (err instanceof TaskServiceError) {
        setError(err.message)
      } else {
        setError('Failed to update task. Please try again.')
      }
      // Remove from moving state if there was an error
      setMovingTasks(prev => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })
    }
  }

  /**
   * Handles deleting a task from the list
   * Includes smooth deletion animation before removing from state
   * 
   * @param taskId - The ID of the task to delete
   */
  const handleDeleteTask = async (taskId: string) => {
    try {
      setError(null)
      
      // Close any open swipe-to-delete buttons first
      if (openElementRef && openElementRef.current) {
        openElementRef.current.classList.remove('swiped')
        const taskContent = openElementRef.current.querySelector('.task-content') as HTMLElement
        if (taskContent) {
          taskContent.style.transform = 'translateX(0)'
        }
        setOpenElementRef(null)
      }
      
      // Start the deletion animation
      setDeletingTasks(prev => new Set(prev).add(taskId))
      
      // Wait for animation to complete
      setTimeout(async () => {
        await TaskService.deleteTask(taskId)

        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
        setDeletingTasks(prev => {
          const newSet = new Set(prev)
          newSet.delete(taskId)
          return newSet
        })
        
        // Clear the open element reference when a task is deleted
        setOpenElementRef(null)
              }, ANIMATION.DELETE_DURATION) // Match the CSS animation duration
      
    } catch (err) {
      console.error('Error deleting task:', err)
      if (err instanceof TaskServiceError) {
        setError(err.message)
      } else {
        setError('Failed to delete task. Please try again.')
      }
      // Remove from deleting state if there was an error
      setDeletingTasks(prev => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })
    }
  }

  /**
   * Handles opening a swipe-to-delete action
   * Ensures only one delete button is visible at a time by closing others
   * 
   * @param elementRef - Reference to the element that was swiped
   */
  const handleSwipeOpen = (elementRef: React.RefObject<HTMLDivElement | null>) => {
    // Close the previously open element
    if (openElementRef && openElementRef.current && openElementRef !== elementRef) {
      openElementRef.current.classList.remove('swiped')
      const taskContent = openElementRef.current.querySelector('.task-content') as HTMLElement
      if (taskContent) {
        taskContent.style.transform = 'translateX(0)'
      }
    }
    // Set the new open element (only if it has a current element)
    if (elementRef.current) {
      setOpenElementRef(elementRef)
    }
  }

  /**
   * Reorders tasks to show active tasks first, then completed tasks
   * This provides a better user experience by prioritizing actionable items
   * 
   * @param tasks - Array of tasks to reorder
   * @returns Reordered array with active tasks first, then completed tasks
   */
  const reorderTasks = (tasks: Task[]) => {
    const activeTasks = tasks.filter(t => !t.completed)
    const completedTasks = tasks.filter(t => t.completed)
    return [...activeTasks, ...completedTasks]
  }

  const orderedTasks = reorderTasks(tasks)
  const openTaskCount = tasks.filter(t => !t.completed).length

  return (
    <div className="bg-white min-h-screen font-inter">
      <div className="max-w-[1000px] mx-auto bg-white min-h-screen flex flex-col">
        {/* Content Container */}
        <div className="flex-1 p-4 flex flex-col gap-4">
          {/* Header */}
          <div className="pt-6 pb-2">
            <h1>
              CraftAmplify Tasks
            </h1>
          </div>
          
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          {/* Input Section */}
          <div className="pb-4">
            <AddTaskForm onAddTask={handleAddTask} />
          </div>
          
          {/* Tasks Section */}
      <div>
            <h2>
              Tasks{openTaskCount > 0 && ` (${openTaskCount})`}
            </h2>
            
            {/* Tasks List */}
            <div className="space-y-2">
              {loading ? (
                <div className="text-center py-8">
                  <p>{LOADING_MESSAGES.LOADING_TASKS}</p>
                </div>
              ) : orderedTasks.length === 0 ? (
                <p className="text-center py-8">No tasks to display</p>
              ) : (
                orderedTasks.map((task, index) => (
                  <div key={task.id}>
                    <TaskItem
                      task={task}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                      onSwipeOpen={handleSwipeOpen}
                      isDeleting={deletingTasks.has(task.id)}
                      isMoving={movingTasks.has(task.id)}
                      isAdding={addingTaskId === task.id}
                    />
                    {index < orderedTasks.length - 1 && (
                      <div className="h-px my-2 bg-gray-200"></div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Footer Image */}
        <div 
          className="w-full"
          style={{
            backgroundImage: "url(https://wallpapers.com/images/featured/nyan-cat-background-1ldrgvod52e6vi0m.jpg)",
            backgroundSize: '100% auto',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center calc(50% - 60px)',
            paddingBottom: '16.67%'
          }}
        ></div>
      </div>
      </div>
  )
}

export default App
