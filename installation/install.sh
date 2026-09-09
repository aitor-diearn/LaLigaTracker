#!/bin/bash

# REMEMBER TO HAVE YOUR football-data.org API KEY IN /backend/.env FILE BEFORE LAUNCHING THIS SCRIPT

echo
echo "================================"
echo "Project installation"
echo "================================"

echo
echo "Creating Python virtual environment..."

cd ../backend
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create the virtual environment."
    exit 1
fi

echo
echo "Installing Python dependencies..."

./venv/bin/python -m pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install the Python dependencies."
    exit 1
fi

echo
echo "Creating data for the app..."

./venv/bin/python main.py
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create the data for the app."
    echo "Please check your API key, internet connection and API availability."
    exit 1
fi

echo
echo "Installing React dependencies..."

cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install the React dependencies."
    exit 1
fi

echo
echo "Installation completed."