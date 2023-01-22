# ビルド環境
FROM node:18-alpine AS builder
WORKDIR /app
COPY ./frontend/ ./
RUN npm ci && npm run build

# Production image, copy all the files and run
FROM nginx:alpine AS runner
COPY --from=builder /app/build /var/www/html/frontend