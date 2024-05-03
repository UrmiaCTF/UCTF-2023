FROM alpine:3.18 as builder

RUN apk update \
    && apk add gcc g++ musl-dev make git gettext-dev flex bison pkgconf protobuf protobuf-dev linux-headers bsd-compat-headers libnl3-dev

WORKDIR /build/bash
RUN wget -qO- https://ftp.gnu.org/gnu/bash/bash-4.2.tar.gz \
    | tar --strip-components 1 -xzf -
RUN ./configure --prefix=/opt/bash --without-bash-malloc \
    && make -j$(nproc) \
    && make install

WORKDIR /build
RUN git clone https://github.com/google/nsjail
WORKDIR /build/nsjail
RUN make -j$(nproc)

FROM alpine:3.18

RUN apk update \
    && apk add busybox-extras libintl libprotobuf libnl3-dev haproxy \
    && rm -rf /var/cache/apk

COPY --from=builder /opt/bash /opt/bash
COPY --from=builder /build/nsjail/nsjail /opt/nsjail/bin/nsjail

RUN apk add git \
    && rm -rf /var/cache/apk \
    && chmod u+s /usr/bin/git

COPY nsjail /opt/nsjail/etc

COPY bash-cgi.sh /opt/httpd/bash-cgi.sh

COPY httpd.conf /etc/httpd.conf
COPY www /var/www

ARG FLAG_USER=
ARG FLAG_USER_PASS=
ARG FLAG_USER_PASS_ALGO=
ARG FLAG_USER_GECOS=

RUN adduser -D ${FLAG_USER} -g "${FLAG_USER_GECOS}" \
    && echo "${FLAG_USER_PASS}" | mkpasswd -m ${FLAG_USER_PASS_ALGO} | awk '{ printf '\"${FLAG_USER}:\"' $0 }' | chpasswd -e

ENTRYPOINT [ "httpd", "-v", "-v", "-f", "-p", "0.0.0.0:80" ]
