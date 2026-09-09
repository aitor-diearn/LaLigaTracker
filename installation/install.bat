@echo off

REM REMEMBER TO HAVE YOUR football-data.org API KEY IN /backend/.env FILE BEFORE LAUNCHING THIS SCRIPT

echo.
echo ========================================
echo Project installation
echo ========================================

echo.
echo Creating Python virtual environment..

cd ..\backend

python -m venv venv

if errorlevel 1 (
    echo ERROR: Failed to create the virtual environment.
    cd ../installation
    pause
    exit /b 1
)

echo.
echo Installing Python dependencies...

venv\Scripts\python.exe -m pip install -r requirements.txt

if errorlevel 1 (
    echo ERROR: Failed to install Python dependencies.
    cd ../installation
    pause
    exit /b 1
)

echo.
echo Creating data for the app...

venv\Scripts\python.exe main.py

if errorlevel 1 (
    echo.
    echo ERROR: Failed to fetch or process football data.
    echo Please check your API key, internet connection and API availability.
    cd ../installation
    pause
    exit /b 1
)

echo.
echo Installing React dependencies...

cd ../frontend

call npm install

if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies.
    cd ../installation
    pause
    exit /b 1
)

echo.
echo Installation completed.

cd ../installation

pause