import { fireEvent, render, screen } from '@testing-library/react'
import { TaskItem } from './TaskItem'

const task = {
  id: 'task-1',
  text: 'Write a test',
  completed: false,
}

describe('TaskItem', () => {
  it('reports the next checked value once when the checkbox is clicked', () => {
    const onToggle = jest.fn()

    render(
      <TaskItem
        task={task}
        onToggle={onToggle}
        onDelete={jest.fn()}
        onSwipeOpen={jest.fn()}
        isDeleting={false}
        isMoving={false}
      />
    )

    fireEvent.click(screen.getByRole('checkbox'))

    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(onToggle).toHaveBeenCalledWith('task-1', true)
  })
})
