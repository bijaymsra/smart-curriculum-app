#!/bin/bash

# 1. Kill anything already running on your ports to start fresh
echo "🧹 Clearing ports 8080 and 3000..."
lsof -ti :8080,3000 | xargs kill -9 2>/dev/null

# 2. Start the Backend
echo "🚀 Starting Spring Boot backend..."
cd backend
./mvnw clean spring-boot:run &
# We don't save PID here because mvnw spawns a child Java process

# 3. Start the Frontend
cd ../frontend
echo "🚀 Starting React frontend..."
# BROWSER=none prevents it from popping open 100 tabs if you restart often
HTTPS=true BROWSER=none npm start &

# 4. Handle Shutdown (Ctrl+C)
cleanup() {
    echo -e "\n🛑 Force killing all processes on ports..."
    lsof -ti :8080,3000 | xargs kill -9 2>/dev/null
    exit
}

trap cleanup SIGINT

echo "Base is running. Press Ctrl+C to stop everything."
wait
