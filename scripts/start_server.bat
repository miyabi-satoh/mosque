pushd "%~dp0"

docker compose -f ..\compose-prod.yml down
cscript stop_backend.vbs

docker compose -f ..\compose-prod.yml up -d

cd ..
.venv\Scripts\activate.bat
uvicorn backend.main:app

start http://localhost
