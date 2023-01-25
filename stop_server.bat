pushd "%~dp0"

cscript scripts\stop_backend.vbs

docker compose -f compose-prod.yml down
