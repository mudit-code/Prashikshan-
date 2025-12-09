@echo off
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5000" ^| find "LISTENING"') do taskkill /f /pid %%a
timeout /t 2
start /B npm run dev > backend.log 2>&1
echo Server restarted.
