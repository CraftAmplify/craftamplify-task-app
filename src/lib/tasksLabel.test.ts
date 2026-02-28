import { getTasksLabelSuffix } from './tasksLabel'

describe('getTasksLabelSuffix', () => {
  test('returns empty string when there are no tasks', () => {
    const tasks: { id: string; text: string; completed: boolean }[] = []
    const result = getTasksLabelSuffix(tasks)
    expect(result).toBe('')
  })
})
