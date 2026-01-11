FROM nginx:alpine

# Очистка старых конфигураций
RUN rm -rf /etc/nginx/conf.d/*

# Копирование статических файлов
COPY . /usr/share/nginx/html

# Копирование конфигурации NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]