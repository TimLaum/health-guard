#!/bin/bash

# Quick setup script for HealthGuard Flask Test API

echo "================================"
echo "HealthGuard Flask API Setup"
echo "================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install it first."
    exit 1
fi

echo "✓ Python3 found"
echo ""

# Create virtual environment (optional but recommended)
echo "Setting up virtual environment..."
python3 -m venv venv

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

echo "✓ Virtual environment activated"
echo ""

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "✓ Dependencies installed"
echo ""
echo "================================"
echo "Setup complete!"
echo "================================"
echo ""
echo "To run the API, execute:"
echo "  python flask_test_api.py"
echo ""
echo "Or on Windows:"
echo "  python.exe flask_test_api.py"
echo ""
echo "The API will be available at:"
echo "  http://localhost:5000"
echo ""
