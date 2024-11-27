# Dockerfile para Angular
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Usa Apache para servir la aplicación Angular
FROM httpd:alpine
RUN rm -rf /usr/local/apache2/htdocs/*  # Limpia archivos predeterminados
COPY --from=build /app/dist/identidad-frontend/browser/ /usr/local/apache2/htdocs/
EXPOSE 80
