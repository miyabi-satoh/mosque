###############
#    base     #
###############
# 本番のベース。ここではosの必須ライブラリ以外は何もいれない。
FROM node:lts-alpine as base

ENV LANG=ja_JP.UTF-8
ENV HOME=/home/node
ENV APP_HOME="$HOME/app"

WORKDIR $APP_HOME

# package系のコピー
COPY frontend/package*.json ./

# すべてのファイルをnodeユーザーのものに
RUN chown -R node:node .


RUN echo "WORKDIR is $WORKDIR . HOME is $HOME . LANG is $LANG ." && npm config list


###############
#     dev     #
###############
FROM base as dev
ENV NODE_ENV=development
COPY --chown=node ./frontend .
RUN npm i && npm run check
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

###############
#   builder   #
###############
# ソースコードをビルドする。
# ビルド時にテストファイルを除外しているので、テストはビルド前に行う。
FROM base as builder

COPY --chown=node ./frontend .

RUN npm ci \
  && npm run build

###############
#    prod     #
###############
# ターゲットを指定しなければデフォルトで実行される
# dependenciesのみインストールされている
FROM base as prod
ENV NODE_ENV=production

COPY --from=builder /$APP_HOME/build ./build

RUN npm ci --prod \
  && npm cache clean --force

USER node

CMD ["node", "build"]
