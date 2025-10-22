# Etapa 1 — Build do front
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2 — Servir os arquivos estáticos com NGINX
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expor porta padrão do NGINX
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]