FROM nginx/unit:1.29.1-php8.1

WORKDIR /www

COPY public .
COPY config.json /docker-entrypoint.d/

RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
RUN sed -i "s|session.save_handler = files|session.save_handler = redis|g" "$PHP_INI_DIR/php.ini"
RUN sed -i "s|;session.save_path = \"/tmp\"|session.save_path = \${REDIS_HOST}:\${REDIS_PORT}|g" "$PHP_INI_DIR/php.ini"

RUN docker-php-source extract \
    && curl -L -o /tmp/redis.tar.gz https://github.com/phpredis/phpredis/archive/5.3.7.tar.gz \
    && tar xfz /tmp/redis.tar.gz \
    && rm -r /tmp/redis.tar.gz \
    && mv phpredis-5.3.7 /usr/src/php/ext/redis \
    && docker-php-ext-install redis

EXPOSE 80
