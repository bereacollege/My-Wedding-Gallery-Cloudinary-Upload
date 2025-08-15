@echo off
echo Killing backend (port 3000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /PID %%a /F

echo Starting backend server...
start cmd /k "node index.cjs"

echo Starting frontend (Vite) server...
start cmd /k "npm run dev"

echo All set! Backend on port 3000, frontend on port 5173+
