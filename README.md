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

- Webサーバーは立てない。ポート3000でアクセス。
- strapiはDBのデータ編集やカラム変更が必要な場合に使う。
- frontendからはprismaを経由して、DBアクセスする。


## git clone(fetch)したら

1. env.exampleを参考に、.envファイルを編集する

2. .envのコピー
    ```sh
    ./copy_env.ps1
    ```

3. 依存パッケージのインストール・更新
    ```sh
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

- handleEscKey()を撲滅しよう
  - ModalFormコンポーネント
- office文書をpdfに変換する
- ホスト経由での印刷
- データ更新時にkeywordを生成して更新
- 管理ページ
  - リソース
    - 編集(Edit)
    - 追加(Create)
    - 削除(Delete)
  - スケジュール
    - 一覧(List)
    - 編集(Edit)
    - 追加(Create)
    - 削除(Delete)
- 共有ノート
  - コメント

## Userの権限
- sysadmin : 全てのデータを更新可能
- admin : 自分のデータとuserのデータを更新可能
- user : 自分のデータを更新可能
## ルートレイアウト
- メニュー（ドロワー）
- ログインボタン
  - ログイン時は以下のユーザーメニューを表示
    - プロフィール確認・編集
    - パスワード変更
    - ログアウト
      - 管理者のみ以下のメニューを表示
        - 管理ページ
- カラーモード変更ボタン

## /
- トップページ
- メニュー（各ページへのリンク）を表示
- TODO: 最新のインフォメーション的なものを表示

## /me
- プロフィール確認・編集
- 表示名のみ変更可能
