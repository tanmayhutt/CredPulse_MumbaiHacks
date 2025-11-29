# backend/run_dev.sh - Development Server Script
#!/bin/bash

echo "🚀 Starting CredPulse Development Server..."

# Check if virtual environment is activated
if [ -z "$VIRTUAL_ENV" ]; then
    echo "❌ Virtual environment not activated!"
    echo "Run: source venv/bin/activate"
    exit 1
fi

# Install python-multipart if not installed
pip show python-multipart > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "📦 Installing python-multipart..."
    pip install python-multipart
fi

# Start Uvicorn server
echo "✅ Starting Uvicorn on http://0.0.0.0:8000"
echo "📖 API Docs: http://localhost:8000/docs"
echo "Press Ctrl+C to stop"

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000