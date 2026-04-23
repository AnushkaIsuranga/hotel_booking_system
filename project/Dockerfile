FROM composer:2 AS vendor
WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --prefer-dist \
    --no-interaction \
    --no-progress \
    --optimize-autoloader \
    --no-scripts

FROM node:22-alpine AS frontend
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY resources ./resources
COPY public ./public
COPY vite.config.js tsconfig.json components.json eslint.config.js ./
RUN npm run build

FROM php:8.3-apache AS app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libzip-dev \
    libicu-dev \
    libonig-dev \
    sqlite3 \
    libsqlite3-dev \
    unzip \
    && docker-php-ext-install pdo pdo_mysql pdo_sqlite intl zip opcache \
    && a2enmod rewrite headers \
    && rm -rf /var/lib/apt/lists/*

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/*.conf \
    /etc/apache2/apache2.conf \
    /etc/apache2/conf-available/*.conf

WORKDIR /var/www/html

COPY . .
COPY --from=vendor /app/vendor ./vendor
COPY --from=frontend /app/public/build ./public/build
COPY docker/start.sh /usr/local/bin/start

RUN chmod +x /usr/local/bin/start \
    && mkdir -p storage/framework/cache \
    && mkdir -p storage/framework/views \
    && mkdir -p storage/framework/sessions \
    && mkdir -p storage/logs \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R ug+rwx storage bootstrap/cache

EXPOSE 80

CMD ["start"]
