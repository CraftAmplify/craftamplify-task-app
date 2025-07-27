import { useState, useEffect } from 'react'
import { AddTaskForm } from '@/components/AddTaskForm'
import { useSwipeToDelete } from '@/hooks/useSwipeToDelete'

interface Task {
  id: string
  text: string
  completed: boolean
}

const API_BASE_URL = 'http://localhost:3000'

function TaskItem({ 
  task, 
  onToggle, 
  onDelete, 
  onSwipeOpen,
  isDeleting,
  isMoving
}: { 
  task: Task; 
  onToggle: (id: string, completed: boolean) => void; 
  onDelete: (id: string) => void; 
  onSwipeOpen: (elementRef: React.RefObject<HTMLDivElement | null>) => void;
  isDeleting: boolean;
  isMoving: boolean;
}) {
  const swipeHandlers = useSwipeToDelete({ 
    onDelete: () => onDelete(task.id),
    onSwipeOpen: onSwipeOpen
  })

  return (
    <div
      ref={swipeHandlers.elementRef}
      className={`task-item ${isDeleting ? 'deleting' : ''} ${isMoving ? 'moving' : ''}`}
      onTouchStart={swipeHandlers.handleTouchStart}
      onTouchMove={swipeHandlers.handleTouchMove}
      onTouchEnd={swipeHandlers.handleTouchEnd}
    >
      <div className="task-content flex items-start gap-2 p-2 rounded cursor-pointer" onClick={swipeHandlers.handleTaskClick}>
        <div
          className={`checkbox-custom ${task.completed ? 'checked' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            onToggle(task.id, task.completed)
          }}
        >
          {task.completed && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <span className={`font-inter text-base leading-6 task-text flex-1 ${task.completed ? 'completed-task' : ''}`}>
          {task.text}
        </span>
      </div>
      
      {/* Swipe delete button (for touch devices) */}
      <button
        className="delete-button"
        onClick={swipeHandlers.handleDeleteClick}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {/* Hover delete button (for mouse devices) */}
      <button
        className="hover-delete-button"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(task.id)
        }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openElementRef, setOpenElementRef] = useState<React.RefObject<HTMLDivElement | null> | null>(null)
  const [deletingTasks, setDeletingTasks] = useState<Set<string>>(new Set())
  const [movingTasks, setMovingTasks] = useState<Set<string>>(new Set())

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/tasks`)
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      const data = await response.json()
      setTasks(data)
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setError('Failed to load tasks. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async (taskText: string) => {
    try {
      setError(null)
      const newTask = {
        text: taskText,
        completed: false
      }

      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      })

      if (!response.ok) {
        throw new Error('Failed to add task')
      }

      const addedTask = await response.json()
      setTasks(prevTasks => [addedTask, ...prevTasks]) // Add to beginning like the HTML version
    } catch (err) {
      console.error('Error adding task:', err)
      setError('Failed to add task. Please try again.')
    }
  }

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
          const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: !completed }),
          })

          if (!response.ok) {
            throw new Error('Failed to update task')
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
        }, 150) // Half the animation time for move-out
      } else {
        // No position change, just update the completion status
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ completed: !completed }),
        })

        if (!response.ok) {
          throw new Error('Failed to update task')
        }

        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, completed: !completed } : task
          )
        )
      }
      
    } catch (err) {
      console.error('Error updating task:', err)
      setError('Failed to update task. Please try again.')
      // Remove from moving state if there was an error
      setMovingTasks(prev => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })
    }
  }

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
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete task')
        }

        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
        setDeletingTasks(prev => {
          const newSet = new Set(prev)
          newSet.delete(taskId)
          return newSet
        })
        
        // Clear the open element reference when a task is deleted
        setOpenElementRef(null)
      }, 300) // Match the CSS animation duration
      
    } catch (err) {
      console.error('Error deleting task:', err)
      setError('Failed to delete task. Please try again.')
      // Remove from deleting state if there was an error
      setDeletingTasks(prev => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })
    }
  }

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

  // Reorder tasks: active first, then completed
  const reorderTasks = (tasks: Task[]) => {
    const activeTasks = tasks.filter(t => !t.completed)
    const completedTasks = tasks.filter(t => t.completed)
    return [...activeTasks, ...completedTasks]
  }

  const orderedTasks = reorderTasks(tasks)

  return (
    <div className="bg-white min-h-screen font-inter">
      <div className="max-w-[1000px] mx-auto bg-white min-h-screen flex flex-col">
        {/* Content Container */}
        <div className="flex-1 p-4 flex flex-col gap-4">
          {/* Header */}
          <div className="pt-6 pb-2">
            <h1 className="gradient-text font-montserrat text-4xl font-normal leading-9 tracking-tight inline-block">
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
            <h2 className="font-montserrat text-base font-normal text-gray-500 leading-7 tracking-tight">
              Tasks
            </h2>
            
            {/* Tasks List */}
            <div className="space-y-2">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading tasks...</p>
                </div>
              ) : orderedTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No tasks to display</p>
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
            backgroundImage: "url('http://localhost:3845/assets/55b850d72b5e55684be113c506ce31b75e28f03a.png')",
            backgroundSize: '100% auto',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center bottom',
            paddingBottom: '16.67%'
          }}
        ></div>
      </div>
    </div>
  )
}

export default App
