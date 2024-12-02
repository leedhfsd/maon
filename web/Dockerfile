# Node.js를 사용하여 빌드
FROM node:20.15.0 AS build

WORKDIR /app

# 빌드 성능 향상을 위한 캐시 설정
COPY package*.json ./
RUN npm ci

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build
