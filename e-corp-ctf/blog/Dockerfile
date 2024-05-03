FROM php:7.2-apache

RUN a2enmod rewrite \
    && a2enmod headers

COPY src/ /var/www/html/
COPY --chown=www-data:www-data posts/ /posts/