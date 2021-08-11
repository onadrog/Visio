FROM httpd:alpine

COPY ./cert/localhost.pem /usr/local/apache2/conf/
COPY ./cert/localhost-key.pem /usr/local/apache2/conf/

RUN sed -i \
        -e 's/^#\(Include .*httpd-ssl.conf\)/\1/' \
        -e 's/^#\(Include .*httpd-vhosts.conf\)/\1/' \
        -e 's/^#\(LoadModule .*mod_ssl.so\)/\1/' \
        -e 's/^#\(LoadModule .*mod_proxy.so\)/\1/' \
        -e 's/^#\(LoadModule .*mod_proxy_fcgi.so\)/\1/' \
        -e 's/^#\(LoadModule .*mod_http2.so\)/\1/' \
        -e 's/^#\(LoadModule .*mod_rewrite.so\)/\1/' \
        -e 's/^#\(LoadModule .*mod_socache_shmcb.so\)/\1/' \
        -e 's/^#\(LoadModule .*mod_deflate.so\)/\1/' \
        -e 's%ServerName.*%ServerName localhost%' \
        /usr/local/apache2/conf/httpd.conf

WORKDIR /var/www/html/