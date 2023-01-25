@echo off
SETLOCAL

@REM Run migrations
alembic upgrade head

@REM Create initial data in DB
SET PYTHONPATH=.
python app\initial_data.py
