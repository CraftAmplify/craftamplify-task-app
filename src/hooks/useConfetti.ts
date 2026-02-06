import confetti from 'canvas-confetti'

/**
 * Custom hook for triggering confetti effects
 * Uses CraftAmplify brand colors for a themed celebration
 */
export function useConfetti() {
  /**
   * Triggers a confetti burst effect
   * Optimized for task completion celebrations
   */
  const triggerConfetti = () => {
    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#e11896', '#ff69b4', '#ffc0cb', '#9b59b6', '#3498db'],
      startVelocity: 35,
      decay: 0.9,
      scalar: 1,
    })
  }

  return { triggerConfetti }
}
