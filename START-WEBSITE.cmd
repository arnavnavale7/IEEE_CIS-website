@echo off
setlocal
cd /d "%~dp0"
title IEEE CIS Website
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is required. Install Node.js 22 or newer from https://nodejs.org/
  echo Then close this window and double-click START-WEBSITE.cmd again.
  pause
  exit /b 1
)
where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo npm is missing. Please reinstall Node.js with npm included.
  pause
  exit /b 1
)
if not exist "package.json" (
  echo Please extract the entire source ZIP before running this file.
  pause
  exit /b 1
)
if not exist "node_modules\.bin\vite.cmd" (
  echo Installing dependencies. Internet access is needed on the first launch.
  call npm.cmd ci
  if errorlevel 1 (
    echo Dependency installation failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
)
echo Starting the website. Your browser will open automatically.
echo Keep this window open while using the site. Press Ctrl+C to stop.
call npm.cmd run dev -- --open
if errorlevel 1 (
  echo The website could not start. See the error above.
  pause
  exit /b 1
)
endlocal
