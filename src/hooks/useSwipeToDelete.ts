import { useRef, useCallback, useEffect } from 'react'
import { SWIPE } from '@/constants'

/**
 * Props interface for the useSwipeToDelete hook
 */
interface UseSwipeToDeleteProps {
  /** Callback function executed when delete action is triggered */
  onDelete: () => void
  /** Callback function executed when swipe gesture opens the delete button */
  onSwipeOpen: (elementRef: React.RefObject<HTMLDivElement | null>) => void
}

/**
 * Custom hook for implementing swipe-to-delete functionality
 * 
 * Provides touch gesture handling for revealing a delete button when swiping left.
 * Also includes click-outside-to-close functionality and proper cleanup.
 * 
 * Features:
 * - Touch gesture detection and handling
 * - Smooth CSS transform animations
 * - Global click listener for closing delete button
 * - Proper event handling and cleanup
 * 
 * @param props - Configuration object for the hook
 * @returns Object containing refs and event handlers for the swipe functionality
 */
export function useSwipeToDelete({ onDelete, onSwipeOpen }: UseSwipeToDeleteProps) {
  /** Reference to the DOM element that supports swipe gestures */
  const elementRef = useRef<HTMLDivElement>(null)
  /** Stores the X coordinate where the touch gesture started */
  const startXRef = useRef<number>(0)
  /** Stores the current X coordinate during touch gesture */
  const currentXRef = useRef<number>(0)
  /** Flag to track if a swipe gesture is currently in progress */
  const isSwipingRef = useRef<boolean>(false)

  /**
   * Hides the delete button and resets the element to its normal position
   * Used when canceling a swipe or clicking outside the element
   */
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
      // Swipe threshold met - reveal delete
      if (elementRef.current) {
        // Notify parent to close other open items
        onSwipeOpen(elementRef)
        
        elementRef.current.classList.add('swiped')
        const taskContent = elementRef.current.querySelector('.task-content') as HTMLElement
        if (taskContent) {
          taskContent.style.transform = `translateX(-${SWIPE.MAX_DISTANCE}px)`
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