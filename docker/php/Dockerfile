FROM php:8.0-fpm-alpine

# dl & move composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
   && apk add git libzip-dev unzip\
   && docker-php-ext-install zip

RUN docker-php-ext-install pdo_mysql \
    && docker-php-ext-install mysqli \
    && docker-php-ext-install opcache