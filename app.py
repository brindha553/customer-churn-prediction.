"""
Root entry point launcher for ChurnPredict AI backend.
Allows running `python app.py` directly from the project root folder.
"""
import os
import sys
import importlib.util

backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
backend_app_path = os.path.join(backend_dir, "app.py")

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
os.chdir(backend_dir)

spec = importlib.util.spec_from_file_location("backend_app", backend_app_path)
backend_app = importlib.util.module_from_spec(spec)
sys.modules["backend_app"] = backend_app
spec.loader.exec_module(backend_app)

app = backend_app.app

if __name__ == "__main__":
    backend_app.load_or_train_model()
    print("Starting Flask API server on port 5000...")
    app.run(host="0.0.0.0", port=5000, debug=True)
