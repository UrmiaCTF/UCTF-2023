FROM pypy:3.10-slim

RUN apt-get update \
    && apt-get install --no-install-recommends -y gcc \
    && rm -rf /var/cache

WORKDIR /app
COPY requirements.txt /app/requirements.txt
RUN pip install --prefer-binary --no-cache-dir -r requirements.txt

COPY src /app/src

EXPOSE 7000

USER nobody

ENTRYPOINT [ "pypy", "src/cryptor.py" ]
