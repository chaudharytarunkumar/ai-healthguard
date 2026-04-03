import sys
import os

# Add the project root and backend to the system path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend'))

# Import the FastAPI app from the backend
from backend.main import app
