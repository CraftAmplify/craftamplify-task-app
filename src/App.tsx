import { useState, useEffect } from 'react'
import { AddTaskForm } from '@/components/AddTaskForm'
import { TaskItem } from '@/components/TaskItem'
import { TaskService, TaskServiceError, type Task } from '@/services/taskService'
import { ANIMATION, LOADING_MESSAGES } from '@/constants'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openElementRef, setOpenElementRef] = useState<React.RefObject<HTMLDivElement | null> | null>(null)
  const [deletingTasks, setDeletingTasks] = useState<Set<string>>(new Set())
  const [movingTasks, setMovingTasks] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchTasks()
  }, [])

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

  const handleAddTask = async (taskText: string) => {
    try {
      setError(null)
      const newTaskData = {
        text: taskText,
        completed: false
      }

      const addedTask = await TaskService.createTask(newTaskData)
      setTasks(prevTasks => [addedTask, ...prevTasks])
    } catch (err) {
      console.error('Error adding task:', err)
      if (err instanceof TaskServiceError) {
        setError(err.message)
      } else {
        setError('Failed to add task. Please try again.')
      }
    }
  }

  const handleToggleTask = async (taskId: string, nextCompleted: boolean) => {
    try {
      setError(null)
      
      // Keep swipe actions mutually exclusive.
      if (openElementRef && openElementRef.current) {
        openElementRef.current.classList.remove('swiped')
        const taskContent = openElementRef.current.querySelector('.task-content') as HTMLElement
        if (taskContent) {
          taskContent.style.transform = 'translateX(0)'
        }
        setOpenElementRef(null)
      }
      
      const currentTasks = [...tasks]
      const currentTask = currentTasks.find(t => t.id === taskId)
      if (!currentTask) return
      
      const updatedTasks = currentTasks.map(task =>
        task.id === taskId ? { ...task, completed: nextCompleted } : task
      )
      
      const activeTasks = updatedTasks.filter(t => !t.completed)
      const completedTasks = updatedTasks.filter(t => t.completed)
      
      let newOrder: Task[]
      if (nextCompleted) {
        const newlyCompletedTask = completedTasks.find(t => t.id === taskId)
        const otherCompletedTasks = completedTasks.filter(t => t.id !== taskId)
        newOrder = [
          ...activeTasks,
          ...(newlyCompletedTask ? [newlyCompletedTask] : []),
          ...otherCompletedTasks
        ]
      } else {
        const newlyActiveTask = activeTasks.find(t => t.id === taskId)
        const otherActiveTasks = activeTasks.filter(t => t.id !== taskId)
        newOrder = [
          ...(newlyActiveTask ? [newlyActiveTask] : []),
          ...otherActiveTasks,
          ...completedTasks
        ]
      }
      
      const currentIndex = currentTasks.findIndex(t => t.id === taskId)
      const newIndex = newOrder.findIndex(t => t.id === taskId)
      const positionChanged = currentIndex !== newIndex
      
      if (positionChanged) {
        setMovingTasks(prev => new Set(prev).add(taskId))
        
        // Persist after the exit animation so the reordered item does not jump.
        setTimeout(async () => {
          await TaskService.updateTask(taskId, { completed: nextCompleted })

          setTasks(newOrder)
          
          setTimeout(() => {
            setMovingTasks(prev => {
              const newSet = new Set(prev)
              newSet.delete(taskId)
              return newSet
            })
          }, 50)
        }, ANIMATION.MOVE_DURATION)
      } else {
        await TaskService.updateTask(taskId, { completed: nextCompleted })

        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, completed: nextCompleted } : task
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
      
      if (openElementRef && openElementRef.current) {
        openElementRef.current.classList.remove('swiped')
        const taskContent = openElementRef.current.querySelector('.task-content') as HTMLElement
        if (taskContent) {
          taskContent.style.transform = 'translateX(0)'
        }
        setOpenElementRef(null)
      }
      
      setDeletingTasks(prev => new Set(prev).add(taskId))
      
      // Keep the item mounted until its exit animation completes.
      setTimeout(async () => {
        await TaskService.deleteTask(taskId)

        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
        setDeletingTasks(prev => {
          const newSet = new Set(prev)
          newSet.delete(taskId)
          return newSet
        })
        
        setOpenElementRef(null)
      }, ANIMATION.DELETE_DURATION)
      
    } catch (err) {
      console.error('Error deleting task:', err)
      if (err instanceof TaskServiceError) {
        setError(err.message)
      } else {
        setError('Failed to delete task. Please try again.')
      }
      setDeletingTasks(prev => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })
    }
  }

  const handleSwipeOpen = (elementRef: React.RefObject<HTMLDivElement | null>) => {
    if (openElementRef && openElementRef.current && openElementRef !== elementRef) {
      openElementRef.current.classList.remove('swiped')
      const taskContent = openElementRef.current.querySelector('.task-content') as HTMLElement
      if (taskContent) {
        taskContent.style.transform = 'translateX(0)'
      }
    }
    if (elementRef.current) {
      setOpenElementRef(elementRef)
    }
  }

  const reorderTasks = (tasks: Task[]) => {
    const activeTasks = tasks.filter(t => !t.completed)
    const completedTasks = tasks.filter(t => t.completed)
    return [...activeTasks, ...completedTasks]
  }

  const orderedTasks = reorderTasks(tasks)

  return (
    <div className="bg-white min-h-screen font-inter">
      <div className="max-w-[1000px] mx-auto bg-white min-h-screen flex flex-col">
        <div className="flex-1 p-4 flex flex-col gap-4">
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
          
          <div className="pb-4">
            <AddTaskForm onAddTask={handleAddTask} />
          </div>
          
          <div>
            <h2>
              Tasks
            </h2>
            
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
        
        <div 
          className="w-full"
          style={{
            backgroundImage: "url('/footer-image.png')",
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
