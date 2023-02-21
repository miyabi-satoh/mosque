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

1. env.exampleを参考に、.envファイルを編集する

1. .envのコピー
    ```
    ./copy_env.ps1
    ```

1. 依存パッケージのインストール・更新
    ```
    ./post_pull.ps1
    ```

2. Docker で PstgreSQL を起動
    ```sh
    docker compose up -d
    ```

3. strapi を起動
    ```sh
    cd strapi
    yarn develop
    ```

4. frontend を起動
    ```sh
    cd frontend
    npm run dev -- --host 0.0.0.0 --port 3000
    ```

## TODO

- backend不要説。
- orderを参照カウントにする。クリック数が多いほど上位に。
- office文書をpdfに変換する
