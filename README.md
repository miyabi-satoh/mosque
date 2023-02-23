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
├── frontend ... Sveltekit 1.x
└── strapi ... strapi 4.x

DBMS ... PostgreSQL 15.x
```

- Webサーバーは立てない。
- strapiの管理パネルでデータを編集する。
- frontendからはprismaを経由して、DBアクセスする。


## git clone(fetch)したら

1. env.exampleを参考に、.envファイルを編集する

2. .envのコピー
    ```
    ./copy_env.ps1
    ```

3. 依存パッケージのインストール・更新
    ```
    ./post_pull.ps1
    ```

4. Docker で PstgreSQL を起動
    ```sh
    docker compose up -d
    ```

5. strapi を起動
    ```sh
    cd strapi
    yarn build
    yarn develop
    ```

6. frontend を起動
    ```sh
    cd frontend
    npm run dev -- --host 0.0.0.0 --port 3000
    ```

## TODO

- orderを参照カウントにする。クリック数が多いほど上位に。
- office文書をpdfに変換する
