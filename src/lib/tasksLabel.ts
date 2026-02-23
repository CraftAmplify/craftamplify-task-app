import type { Task } from '@/services/taskService'

/**
 * Returns the suffix for the Tasks heading, e.g. "", " (3)", or " (all done)".
 */
export function getTasksLabelSuffix(tasks: Task[]): string {
  const openTaskCount = tasks.filter(t => !t.completed).length
  return openTaskCount > 0
    ? ` (${openTaskCount})`
    : tasks.length > 0
      ? ' (all done)'
      : ''
}
