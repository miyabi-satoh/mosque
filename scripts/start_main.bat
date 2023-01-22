pushd "%~dp0.."
.venv\Scripts\activate.bat
uvicorn --host 0.0.0.0 --app-dir backend app.main:app
