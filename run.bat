@echo off
echo Starting BorNeo MSME Dashboard...
echo.

echo Starting Backend API Server...
start cmd /k "cd backend && python api.py"

timeout /t 3 /nobreak > nul

echo Starting Frontend Development Server...
start cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting up...
echo Backend API: http://localhost:8000
echo Frontend App: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul