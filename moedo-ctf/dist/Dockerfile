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

COPY moedo /build/moedo
WORKDIR /build/moedo
RUN make -j$(nproc)

FROM alpine:3.18

RUN apk update \
    && apk add libprotobuf libnl3 busybox-extras binutils file \
    && rm -rf /var/cache/apk

COPY --from=builder /build/nsjail/nsjail /opt/nsjail/bin/nsjail
COPY ./nsjail /opt/nsjail/etc/

COPY --from=builder /build/moedo/moedo /usr/bin/moedo
RUN chown root:root /usr/bin/moedo \
    && chmod u+s /usr/bin/moedo
RUN addgroup moe

COPY --chown=root:root flag /root/flag

COPY jail-login.sh /opt/nsjail/jail-login.sh

COPY motd /etc/motd

ARG USER=
ARG USER_GECOS=
ARG USER_PASS=
ARG USER_PASS_ALGO=sha512

RUN adduser -D ${USER} -g "${USER_GECOS}" \
    && echo "${USER_PASS}" | mkpasswd -m ${USER_PASS_ALGO} | awk '{ printf '\"${USER}:\"' $0 }' | chpasswd -e

ENV LOGIN_TIMEOUT=8

EXPOSE 7000

ENTRYPOINT [ "telnetd", "-F", "-p7000", "-l", "/opt/nsjail/jail-login.sh" ]