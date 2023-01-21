pushd "%~dp0"

cscript stop_backend.vbs

docker compose -f ..\compose-prod.yml down
