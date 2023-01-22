pushd "%~dp0"

docker compose -f compose-prod.yml down
cscript scripts\stop_backend.vbs

docker compose -f compose-prod.yml up -d

cscript scripts\start_backend.vbs

start http://localhost
