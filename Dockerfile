# Dockerfile para Angular
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Usa Apache para servir la aplicación Angular
FROM httpd:alpine
RUN apk add --no-cache apache2-utils  # Instala herramientas necesarias
RUN sed -i 's/#LoadModule rewrite_module/LoadModule rewrite_module/' /usr/local/apache2/conf/httpd.conf
RUN sed -i 's#AllowOverride None#AllowOverride All#' /usr/local/apache2/conf/httpd.conf
RUN rm -rf /usr/local/apache2/htdocs/*  # Limpia archivos predeterminados
COPY --from=build /app/dist/identidad_frontend/browser/ /usr/local/apache2/htdocs/
COPY --from=build /app/htaccess/.htaccess /usr/local/apache2/htdocs/

EXPOSE 80
