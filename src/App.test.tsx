import { render, screen, waitFor } from '@testing-library/react'
import App from './App'
import { TaskService } from '@/services/taskService'

jest.mock('@/services/taskService')

describe('App', () => {

    test('displays "Tasks" when there are no open tasks', async () => {
        jest.mocked(TaskService.fetchTasks).mockResolvedValue([])
        render(<App />)
        await waitFor(() => {
            expect(screen.queryByText(/Loading tasks/)).not.toBeInTheDocument()
        })
        const heading = screen.getByRole('heading', { level: 2, name: /^Tasks/ })
        expect(heading).toHaveTextContent('Tasks')
    })

    test('displays "Tasks" when all tasks are completed', async () => {
        jest.mocked(TaskService.fetchTasks).mockResolvedValue([
            { id: '1', text: 'Done task', completed: true },
        ])
        render(<App />)
        await waitFor(() => {
            expect(screen.queryByText(/Loading tasks/)).not.toBeInTheDocument()
        })
        const heading = screen.getByRole('heading', { level: 2, name: /^Tasks/ })
        expect(heading).toHaveTextContent('Tasks')
    })

    test('displays "Tasks (N)" when there are open tasks', async () => {
        jest.mocked(TaskService.fetchTasks).mockResolvedValue([
            { id: '1', text: 'Open 1', completed: false },
            { id: '2', text: 'Open 2', completed: false },
            { id: '3', text: 'Done', completed: true },
        ])
        render(<App />)
        await waitFor(() => {
            expect(screen.queryByText(/Loading tasks/)).not.toBeInTheDocument()
        })
        const heading = screen.getByRole('heading', { level: 2, name: /^Tasks/ })
        expect(heading).toHaveTextContent('Tasks (2)')
    })
})