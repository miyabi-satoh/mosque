pushd "%~dp0.."
call .venv\Scripts\activate.bat
uvicorn --host 0.0.0.0 --app-dir backend app.main:app

@REM uvicorn --reload --host 0.0.0.0 --app-dir backend app.main:app
@REM gunicorn app.main:app --pythonpath backend --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
