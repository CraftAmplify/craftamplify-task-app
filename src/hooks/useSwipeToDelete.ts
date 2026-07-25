import { useRef, useCallback, useEffect } from 'react'
import { SWIPE } from '@/constants'

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

  // Close the revealed action when the user clicks elsewhere.
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
    const startX = e.touches[0].clientX
    startXRef.current = startX
    currentXRef.current = startX
    isSwipingRef.current = false
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwipingRef.current) {
      currentXRef.current = e.touches[0].clientX
      const diffX = startXRef.current - currentXRef.current
      
      if (diffX > 0) {
        isSwipingRef.current = true
        const translateX = Math.min(diffX, SWIPE.MAX_DISTANCE)
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
      const translateX = Math.min(diffX, SWIPE.MAX_DISTANCE)
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
    
    if (diffX > SWIPE.THRESHOLD) {
      if (elementRef.current) {
        onSwipeOpen(elementRef)
        
        elementRef.current.classList.add('swiped')
        const taskContent = elementRef.current.querySelector('.task-content') as HTMLElement
        if (taskContent) {
          taskContent.style.transform = `translateX(-${SWIPE.MAX_DISTANCE}px)`
        }
      }
    } else {
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
