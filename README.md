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
    docker compose -f compose.yml up -d
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

- Windows でバックエンドをサービス化する

  - winsw install mosque.xml --username <username> --password <password>
  - winsw start mosque.xml
  - winsw status mosque.xml
  - winsw uninstall mosque.xml

- 起動・停止スクリプトを Win サービス起動・停止に変更する

- バックエンドの API 整理
  - /pages 不要
  - /login, /users を strapi に移譲
