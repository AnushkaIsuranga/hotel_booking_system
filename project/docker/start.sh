#!/bin/sh
set -e

mkdir -p storage/framework/cache
mkdir -p storage/framework/views
mkdir -p storage/framework/sessions
mkdir -p storage/logs
mkdir -p bootstrap/cache
mkdir -p database

touch database/database.sqlite

chown -R www-data:www-data storage bootstrap/cache database
chmod -R 775 storage bootstrap/cache database
chmod 664 database/database.sqlite

php artisan storage:link >/dev/null 2>&1 || true

if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
  php artisan migrate --force
fi

php artisan optimize:clear || true

exec apache2-foreground