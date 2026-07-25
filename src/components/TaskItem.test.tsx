import { fireEvent, render, screen } from '@testing-library/react'
import { TaskItem } from './TaskItem'

const task = {
  id: 'task-1',
  text: 'Write a test',
  completed: false
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

  it('does not reveal the delete action for a tap', () => {
    const onSwipeOpen = jest.fn()

    render(
      <TaskItem
        task={task}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
        onSwipeOpen={onSwipeOpen}
        isDeleting={false}
        isMoving={false}
      />
    )

    const taskItem = screen.getByText('Write a test').closest('.task-item')
    fireEvent.touchStart(taskItem!, { touches: [{ clientX: 100 }] })
    fireEvent.touchEnd(taskItem!)

    expect(onSwipeOpen).not.toHaveBeenCalled()
    expect(taskItem).not.toHaveClass('swiped')
  })
})
