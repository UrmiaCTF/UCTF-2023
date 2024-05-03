FROM node:18-alpine AS staging

WORKDIR /app

COPY . .

RUN npm install && \
    npm run build

FROM nginx/unit:1.29.1-php8.1 AS production

WORKDIR /www

RUN mkdir public

COPY --from=staging /app/config.json /docker-entrypoint.d/
COPY --from=staging /app/dist public
COPY --from=staging /app/composer.json .
COPY --from=staging /app/composer.lock .

RUN rm -f ./public/index.html

RUN apt-get update && \
    apt-get install -y \
        curl \
        git \
        libzip-dev

RUN docker-php-ext-install zip

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN composer install --no-dev

EXPOSE 80
