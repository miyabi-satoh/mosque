# mosque


## 開発環境

- macOS Ventura (Apple M1)
- node 18.12.1
- Python 3.11.0
- PowerShell 7.3.2
- Docker 20.10.21

## 構成

```
.
├── backend ... FastAPI
├── frontend ... Sveltekit
├── nginx ... nginx config
└── strapi ... strapi
```

HTTP Server ... Nginx<br/>
DBMS ... PostgreSQL

## git clone(fetch)したら

1. Python の venv 環境を作る
    ```
    python -m venv .venv
    ```

1. 依存パッケージのインストール・更新
    ```
    ./post_pull.ps1
    ```

1. Docker で PstgreSQL と Nginx を起動
    ```sh
    docker compose up -d
    ```

1. backend を起動
    ```sh
    uvicorn --reload --host 0.0.0.0 --app-dir backend app.main:app
    ```

1. strapi を起動
    ```sh
    cd strapi
    ENV_PATH=../.env yarn develop
    ```

1. frontend を起動
    ```sh
    cd frontend
    npm run dev -- --host 0.0.0.0 --port 3000
    ```

## TODO

- backend: API 整理
  - /login, /users を strapi に移譲
- system: nginx, postgresqlをネイティブに
