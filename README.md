# mosque

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
