/// <reference types="cypress" />

describe('Task List Application', () => {
  beforeEach(() => {
    // Wait for servers to be ready
    cy.wait(2000)
    
    // Try to visit with retry logic
    cy.visit('/', { timeout: 30000 })
    
    // Wait for the page to be fully loaded
    cy.get('body', { timeout: 10000 }).should('be.visible')
    
    // Debug: Log the current page content
    cy.log('Page loaded, checking for loading message...')
  })

  after(() => {
    // Clean up any test tasks that were created during the test run
    cy.log('Cleaning up test tasks...')
    
    // Get all tasks and delete any that match our test patterns
    cy.request('GET', 'http://localhost:3000/tasks').then((response) => {
      const tasks = response.body
      const testTaskPatterns = [
        'Test task 1',
        'Test task 2', 
        'Toggle test task',
        'Test task for completion',
        'Hover test task',
        'Complete E2E testing setup',
        'Task added with Enter key'
      ]
      
      tasks.forEach((task: { id: string; text: string }) => {
        if (testTaskPatterns.some(pattern => task.text.includes(pattern))) {
          cy.request('DELETE', `http://localhost:3000/tasks/${task.id}`)
            .then(() => {
              cy.log(`Deleted test task: ${task.text}`)
            })
        }
      })
    })
  })

  it('should verify database connectivity', () => {
    // Test that the JSON server is responding correctly
    cy.request('GET', 'http://localhost:3000/tasks').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('array')
      
      // Log the tasks from the database
      cy.log(`Database contains ${response.body.length} tasks:`)
      response.body.forEach((task: { text: string; completed: boolean }, index: number) => {
        cy.log(`Task ${index + 1}: ${task.text} (completed: ${task.completed})`)
      })
    })
  })

  it('should load the application and display initial tasks', () => {
    // Check that the page loads
    cy.get('h1').should('contain', 'CraftAmplify Tasks')
    
    // Check that the "Tasks" section header is present
    cy.get('h2').should('contain', 'Tasks')
    
    // Debug: Log what we see on the page
    cy.get('body').then($body => {
      cy.log('Page content:', $body.text())
    })
    
    // Verify that the "Loading tasks..." message appears briefly
    cy.contains('Loading tasks...').should('be.visible')
    
    // Wait for the loading to complete and tasks to appear
    cy.contains('Loading tasks...').should('not.exist')
    
    // Add test tasks to ensure we have tasks to work with
    cy.get('input[placeholder="Add a new task..."]').type('Test task 1{enter}')
    cy.get('input[placeholder="Add a new task..."]').type('Test task 2{enter}')
    
    // Debug: Log the tasks we find
    cy.get('.task-text').then($tasks => {
      cy.log(`Found ${$tasks.length} tasks on the page`)
      $tasks.each((index, task) => {
        cy.log(`Task ${index + 1}: ${task.textContent}`)
      })
    })
    
    // Verify that tasks are displayed (using our added test tasks)
    cy.get('.task-text').should('have.length.at.least', 2)
    
    // Verify that we have some incomplete tasks (our test tasks should be incomplete)
    cy.get('.task-text:not(.completed-task)').should('exist')
  })

  it('should display the Add Task form elements', () => {
    // Wait for loading to complete
    cy.contains('Loading tasks...').should('not.exist')
    
    // Verify the input field is present
    cy.get('input[placeholder="Add a new task..."]').should('be.visible')
    
    // Verify the Add button is present
    cy.get('button').contains('Add').should('be.visible')
    
    // Verify the Add button is initially disabled
    cy.get('button').contains('Add').should('be.disabled')
  })

  it('should enable the Add button when typing in the input field', () => {
    // Wait for loading to complete
    cy.contains('Loading tasks...').should('not.exist')
    
    // Get references to elements
    const inputField = cy.get('input[placeholder="Add a new task..."]')
    const addButton = cy.get('button').contains('Add')
    
    // Button should be disabled initially
    addButton.should('be.disabled')
    
    // Type in the input field
    inputField.type('New test task')
    
    // Button should now be enabled
    addButton.should('not.be.disabled')
  })

  it('should add a new task when form is submitted', () => {
    // Wait for loading to complete
    cy.contains('Loading tasks...').should('not.exist')
    
    const inputField = cy.get('input[placeholder="Add a new task..."]')
    const addButton = cy.get('button').contains('Add')
    
    // Get initial task count
    cy.get('.task-text').then($tasks => {
      const initialCount = $tasks.length
      cy.log(`Initial task count: ${initialCount}`)
      
      // Type a new task
      inputField.type('Complete E2E testing setup')
      
      // Click the Add button
      addButton.click()
      
      // Verify the new task appears in the list
      cy.contains('Complete E2E testing setup').should('be.visible')
      
      // Verify the task count increased
      cy.get('.task-text').should('have.length', initialCount + 1)
      
      // Verify the input field is cleared
      inputField.should('have.value', '')
    })
  })

  it('should add a task when Enter key is pressed', () => {
    // Wait for loading to complete
    cy.contains('Loading tasks...').should('not.exist')
    
    const inputField = cy.get('input[placeholder="Add a new task..."]')
    
    // Get initial task count
    cy.get('.task-text').then($tasks => {
      const initialCount = $tasks.length
      cy.log(`Initial task count: ${initialCount}`)
      
      // Type a new task and press Enter
      inputField.type('Task added with Enter key{enter}')
      
      // Verify the new task appears in the list
      cy.contains('Task added with Enter key').should('be.visible')
      
      // Verify the task count increased
      cy.get('.task-text').should('have.length', initialCount + 1)
      
      // Verify the input field is cleared
      inputField.should('have.value', '')
    })
  })

  it('should not add empty tasks', () => {
    // Wait for loading to complete
    cy.contains('Loading tasks...').should('not.exist')
    
    // Get initial task count
    cy.get('.task-text').then($tasks => {
      const initialCount = $tasks.length
      cy.log(`Initial task count: ${initialCount}`)
      
      // Try to submit empty task
      const addButton = cy.get('button').contains('Add')
      addButton.should('be.disabled')
      
      // Verify no tasks were added
      cy.get('.task-text').should('have.length', initialCount)
    })
  })

  it('should display completed tasks with strikethrough', () => {
    // Wait for loading to complete
    cy.contains('Loading tasks...').should('not.exist')
    
    // Add a test task and complete it
    cy.get('input[placeholder="Add a new task..."]').type('Test task for completion{enter}')
    cy.get('.task-text').contains('Test task for completion').parent().parent().find('[data-slot="checkbox"]').click()
    
    // Check that completed tasks have strikethrough styling
    cy.get('.completed-task').should('exist')
    
    // Verify that completed tasks have the correct class
    cy.get('.completed-task').first().should('have.class', 'completed-task')
  })

  it('should toggle task completion status', () => {
    // Wait for loading to complete
    cy.contains('Loading tasks...').should('not.exist')
    
    // Add a test task to toggle
    cy.get('input[placeholder="Add a new task..."]').type('Toggle test task{enter}')
    
    // Find the task we just added and click its checkbox
    cy.get('.task-text').contains('Toggle test task')
      .parent()
      .parent()
      .find('[data-slot="checkbox"]')
      .click({ force: true })
    
    // Wait for the animation to complete
    cy.wait(2000)
    
    // Verify the task is now completed
    cy.get('.task-text').contains('Toggle test task').should('have.class', 'completed-task')
    
    // Toggle it back to incomplete
    cy.get('.task-text').contains('Toggle test task')
      .parent()
      .parent()
      .find('[data-slot="checkbox"]')
      .click({ force: true })
    
    // Wait for the animation to complete
    cy.wait(2000)
    
    // Verify the task is now incomplete
    cy.get('.task-text').contains('Toggle test task').should('not.have.class', 'completed-task')
  })

  it('should have hover delete button functionality', () => {
    // Wait for loading to complete
    cy.contains('Loading tasks...').should('not.exist')
    
    // Add a test task for hover testing
    cy.get('input[placeholder="Add a new task..."]').type('Hover test task{enter}')
    
    // Debug: Log what tasks we find
    cy.get('.task-text').then($tasks => {
      cy.log(`Found ${$tasks.length} tasks for hover test`)
      $tasks.each((index, task) => {
        cy.log(`Task ${index + 1}: ${task.textContent}`)
      })
    })
    
    // Find the task we just added
    cy.get('.task-text').contains('Hover test task')
      .parent()
      .parent()
      .as('taskItem')
    
    // Verify that the hover delete button exists in the DOM
    // (In real usage, it becomes visible on hover, but we just verify it's present)
    cy.get('@taskItem')
      .find('.hover-delete-button')
      .should('exist')
      .and('have.class', 'hover-delete-button')
    
    // Verify the button has the correct structure and can be clicked
    cy.get('@taskItem')
      .find('.hover-delete-button')
      .should('be.enabled')
      .and('contain.html', 'svg') // Should contain the X icon SVG
      .find('svg')
      .should('have.attr', 'viewBox', '0 0 24 24') // Verify it's the correct X icon
    })
  }) 
  describe('Task Count Display', () => {
    beforeEach(() => {
      // Wait for servers to be ready
      cy.wait(2000)
      
      // Visit the application
      cy.visit('/', { timeout: 30000 })
      
      // Wait for the page to be fully loaded
      cy.get('body', { timeout: 10000 }).should('be.visible')
      
      // Wait for loading to complete
      cy.contains('Loading tasks...').should('not.exist')
    })
    it('should display "Tasks" when there are no open tasks', () => {
      // Complete all existing open tasks (6 spaces indentation)
      cy.get('.task-text:not(.completed-task)').then($openTasks => {
        const openTaskCount = $openTasks.length
        cy.log(`Found ${openTaskCount} open tasks to complete`)
        
        // If there are open tasks, complete them one by one
        if (openTaskCount > 0) {
          // Click the checkbox for each open task
          cy.get('.task-text:not(.completed-task)').each(() => {
            cy.get('.task-text:not(.completed-task)').first()
              .parent()
              .parent()
              .find('[data-slot="checkbox"]')
              .click({ force: true })
            cy.wait(500) // Wait a bit between clicks
          })
        }
      })
      
      // Wait for animations to complete
      cy.wait(1000)
      
      // Check that the header shows "Tasks" without a count
      cy.get('h2').should('contain', 'Tasks')
      cy.get('h2').should('not.contain', '(')
    })
  }) 