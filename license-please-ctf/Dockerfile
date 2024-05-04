FROM php:8.2-apache

RUN apt-get update \
    && apt-get install --no-install-recommends -y libgmp-dev \
    && docker-php-ext-configure gmp \
    && docker-php-ext-install -j$(nproc) gmp \
    && rm -rf /var/cache/apt

COPY src/ /var/www/html/