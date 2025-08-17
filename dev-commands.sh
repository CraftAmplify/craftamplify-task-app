#!/bin/bash

# CraftAmplify Task App - Development Commands
# Usage: ./dev-commands.sh [command]

case "$1" in
    "start-backend")
        echo "🚀 Starting JSON Server backend on port 3000..."
        json-server --watch db.json --port 3000
        ;;
    "start-frontend")
        echo "⚛️  Starting React frontend on port 5173..."
        yarn dev
        ;;
    "start-both")
        echo "🚀 Starting both servers..."
        echo "Backend will run in background on port 3000"
        echo "Frontend will run in background on port 5173"
        json-server --watch db.json --port 3000 &
        yarn dev &
        echo "✅ Both servers started! Check ports 3000 and 5173"
        ;;
    "stop-all")
        echo "🛑 Stopping all servers..."
        pkill -f "json-server"
        pkill -f "vite"
        echo "✅ All servers stopped"
        ;;
    "test-unit")
        echo "🧪 Running unit tests..."
        yarn test
        ;;
    "test-e2e")
        echo "🧪 Running E2E tests..."
        yarn cypress:run
        ;;
    "test-e2e-ui")
        echo "🧪 Opening Cypress UI..."
        yarn cypress:open
        ;;
    "install")
        echo "📦 Installing dependencies..."
        yarn install
        ;;
    "status")
        echo "📊 Checking server status..."
        echo "Port 3000 (Backend):"
        lsof -i :3000 2>/dev/null || echo "  Not running"
        echo "Port 5173 (Frontend):"
        lsof -i :5173 2>/dev/null || echo "  Not running"
        ;;
    *)
        echo "🎯 CraftAmplify Task App - Development Commands"
        echo ""
        echo "Usage: ./dev-commands.sh [command]"
        echo ""
        echo "Commands:"
        echo "  start-backend    - Start JSON Server backend"
        echo "  start-frontend   - Start React frontend"
        echo "  start-both       - Start both servers in background"
        echo "  stop-all         - Stop all running servers"
        echo "  test-unit        - Run unit tests"
        echo "  test-e2e         - Run E2E tests headlessly"
        echo "  test-e2e-ui      - Open Cypress UI"
        echo "  install          - Install dependencies"
        echo "  status           - Check server status"
        echo ""
        echo "Examples:"
        echo "  ./dev-commands.sh start-both"
        echo "  ./dev-commands.sh test-unit"
        echo "  ./dev-commands.sh stop-all"
        ;;
esac
