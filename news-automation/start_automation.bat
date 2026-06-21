@echo off
set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"
echo Starting News Automation Daily Sync...
venv_new\Scripts\python.exe run_daily.py
pause
