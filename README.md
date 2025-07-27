# CraftAmplify Mock Enterprise Task List

A modern, responsive task management application built with React and TypeScript. This sample application demonstrates how to create a polished frontend environment with data persistence, perfect for understanding how UI components interact with a mock backend.

## Description

This project is designed to simulate a modern frontend development environment with a focus on user experience and data persistence. It showcases best practices for building interactive web applications with smooth animations, responsive design, and seamless backend integration using a mock API.

## Features

- **Task Management**: Add, complete, and delete tasks with intuitive interactions
- **Smart Reordering**: Completed tasks automatically move to the top of the completed section
- **Smooth Animations**: Polished transitions for task state changes and deletions
- **Touch & Mouse Support**: Swipe-to-delete on touch devices, hover-to-delete on desktop
- **Data Persistence**: All changes are saved to a mock backend using JSON Server
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Modern UI**: Clean, accessible interface built with Shadcn/ui components
- **TypeScript**: Full type safety for better development experience

## Tech Stack

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Shadcn/ui** - Accessible, customizable component library
- **JSON Server** - Mock REST API for data persistence
- **PostCSS** - CSS processing with Autoprefixer

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher) with npm
  - For macOS/Linux users, we recommend using `nvm` for Node.js version management
- **Yarn** (optional) - if you prefer `yarn install` over `npm install`

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install dependencies**:
   ```bash
   npm install
   ```
   or with Yarn:
   ```bash
   yarn install
   ```

### Running the Application

#### 1. Start the Mock Backend (JSON Server)

**In a separate terminal tab/window**, run:

```bash
# Install JSON Server globally (if not already installed)
npm install -g json-server

# Start the mock backend server
json-server --watch db.json --port 3000
```

**Keep this terminal running** - the backend needs to stay active for the frontend to work properly.

#### 2. Start the Frontend Application

**In your main terminal**, run:

```bash
npm run dev
```
or with Yarn:
```bash
yarn dev
```

#### 3. Access the Application

Open your browser and navigate to:
- **Local**: `http://localhost:5173`
- **Network**: The URL will be displayed in your terminal (usually `http://localhost:5173`)

## Usage

### Adding Tasks
- Type a task description in the input field
- Click "Add" or press Enter to create the task
- New tasks appear at the top of the active tasks list

### Completing Tasks
- Click the checkbox next to any task to mark it as complete
- Completed tasks automatically move to the top of the completed section
- Click the checkbox again to uncomplete a task (moves it back to the top of active tasks)

### Deleting Tasks
- **Touch Devices**: Swipe left on any task to reveal the delete button
- **Desktop**: Hover over a task to see the delete (X) button
- Click the delete button to remove the task with a smooth animation

### Task Organization
- Active tasks are displayed at the top
- Completed tasks are shown below active tasks
- Newly completed tasks appear at the top of the completed section
- Uncompleted tasks move to the top of the active section

## Project Structure

```
craftamplify-task-app/
├── src/
│   ├── components/
│   │   ├── AddTaskForm.tsx      # Task input form component
│   │   └── ui/                  # Shadcn/ui components
│   ├── hooks/
│   │   └── useSwipeToDelete.ts  # Custom hook for swipe gestures
│   ├── lib/
│   │   └── utils.ts             # Utility functions
│   ├── App.tsx                  # Main application component
│   ├── index.css                # Global styles and Tailwind imports
│   └── main.tsx                 # Application entry point
├── db.json                      # Mock database for JSON Server
├── index.html                   # HTML template
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── vite.config.ts               # Vite build configuration
```

## Testing

This project includes comprehensive testing with both unit tests and end-to-end (E2E) tests.

### Unit Tests (Jest & React Testing Library)

Unit tests focus on testing individual components in isolation to ensure they work correctly.

**Run unit tests:**
```bash
# Run tests once
npm test

# Run tests in watch mode (reruns when files change)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

**What's tested:**
- Component rendering and behavior
- Form interactions and validation
- Input handling and state management
- User interactions (clicks, typing, form submission)

**Test files location:** `src/components/*.test.tsx`

### End-to-End Tests (Cypress)

E2E tests simulate real user interactions by testing the complete application flow in a browser environment.

**Prerequisites for E2E tests:**
Before running Cypress tests, you **must** have both servers running:

1. **Start JSON Server** (in one terminal):
   ```bash
   json-server --watch db.json --port 3000
   ```

2. **Start React App** (in another terminal):
   ```bash
   npm run dev
   ```

**Run E2E tests:**
```bash
# Open Cypress UI for interactive testing
npm run cypress:open
# or
npm run e2e:open

# Run tests headlessly in terminal
npm run cypress:run
# or
npm run e2e
```

**What's tested:**
- Complete user workflows (adding, completing, deleting tasks)
- Application loading and data persistence
- Form interactions and validation
- Task reordering and animations
- Cross-browser compatibility
- Touch and mouse interactions

**Test files location:** `cypress/e2e/*.cy.ts`

### Test Coverage

**Current test status:**
- **Unit Tests**: 8/8 passing ✅ (100%)
- **E2E Tests**: 7-8/9 passing ✅ (78-89%)

## Development

The application is built with modern development practices:

- **Hot Module Replacement**: Changes reflect immediately in the browser
- **TypeScript**: Full type checking for better code quality
- **ESLint**: Code linting for consistent style
- **PostCSS**: Advanced CSS processing with Autoprefixer
- **Comprehensive Testing**: Unit tests (Jest) and E2E tests (Cypress)

## Contributing

This is a sample application designed for learning and demonstration purposes. Feel free to experiment with the code and explore different features and implementations.
