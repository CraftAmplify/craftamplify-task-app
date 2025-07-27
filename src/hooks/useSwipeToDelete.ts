import { useRef, useCallback, useEffect } from 'react'

interface UseSwipeToDeleteProps {
  onDelete: () => void
  onSwipeOpen: (elementRef: React.RefObject<HTMLDivElement | null>) => void
}

export function useSwipeToDelete({ onDelete, onSwipeOpen }: UseSwipeToDeleteProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef<number>(0)
  const currentXRef = useRef<number>(0)
  const isSwipingRef = useRef<boolean>(false)

  const hideDeleteButton = useCallback(() => {
    if (elementRef.current?.classList.contains('swiped')) {
      elementRef.current.classList.remove('swiped')
      const taskContent = elementRef.current.querySelector('.task-content') as HTMLElement
      if (taskContent) {
        taskContent.style.transform = 'translateX(0)'
      }
    }
  }, [])

  // Add global click listener to hide delete button when clicking outside
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (elementRef.current && !elementRef.current.contains(e.target as Node)) {
        hideDeleteButton()
      }
    }

    document.addEventListener('click', handleGlobalClick)
    return () => {
      document.removeEventListener('click', handleGlobalClick)
    }
  }, [hideDeleteButton])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX
    isSwipingRef.current = false
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwipingRef.current) {
      currentXRef.current = e.touches[0].clientX
      const diffX = startXRef.current - currentXRef.current
      
      // Only allow left swipe
      if (diffX > 0) {
        isSwipingRef.current = true
        const translateX = Math.min(diffX, 80)
        if (elementRef.current) {
          const taskContent = elementRef.current.querySelector('.task-content') as HTMLElement
          if (taskContent) {
            taskContent.style.transform = `translateX(-${translateX}px)`
          }
        }
      }
    } else {
      currentXRef.current = e.touches[0].clientX
      const diffX = startXRef.current - currentXRef.current
      const translateX = Math.min(diffX, 80)
      if (elementRef.current) {
        const taskContent = elementRef.current.querySelector('.task-content') as HTMLElement
        if (taskContent) {
          taskContent.style.transform = `translateX(-${translateX}px)`
        }
      }
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    const diffX = startXRef.current - currentXRef.current
    
    if (diffX > 40) {
      // Swipe threshold met - reveal delete
      if (elementRef.current) {
        // Notify parent to close other open items
        onSwipeOpen(elementRef)
        
        elementRef.current.classList.add('swiped')
        const taskContent = elementRef.current.querySelector('.task-content') as HTMLElement
        if (taskContent) {
          taskContent.style.transform = 'translateX(-80px)'
        }
      }
    } else {
      // Reset position
      if (elementRef.current) {
        elementRef.current.classList.remove('swiped')
        const taskContent = elementRef.current.querySelector('.task-content') as HTMLElement
        if (taskContent) {
          taskContent.style.transform = 'translateX(0)'
        }
      }
    }
    
    isSwipingRef.current = false
  }, [onSwipeOpen])

  const handleTaskClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    hideDeleteButton()
  }, [hideDeleteButton])

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete()
  }, [onDelete])

  return {
    elementRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTaskClick,
    handleDeleteClick,
    hideDeleteButton
  }
} 