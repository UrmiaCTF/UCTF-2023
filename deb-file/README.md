# Challenge Title

Deb File | The Old Systems

Can you believe it? people still use linux? after the emerge of ~~Evil~~ E computers, nobody bothered to use linux systems. anyways, we got this file from database gaurds' pc, can you help us?

# Write Up

1. Install the file:
    1. check the executable buy running `which uctf` then `cat /usr/bin/uctf`:
        ```bash
        #!/usr/bin/env bash

        if [ -f /tmp/UCTFDEB/dont-delete-me ]; then
            FLAG=`cat /tmp/UCTFDEB/dont-delete-me`
            if ! command -v curl > /dev/null; then
                echo 'Install curl and try again'
                exit 1
            else
                curl 127.0.0.1:7327 --header "flag: $FLAG"
            fi
        else
            echo '404, there is no flag to be found'
            exit 1
        fi
        ```
        and then `cat /tmp/UCTFDEB/dont-delete-me`, which reveals the flag.

    2. Run the command `uctf`, the user gets this code: `curl: (7) Failed to connect to 127.0.0.1 port 7327 after 0 ms: Couldn't connect to server` hmmmmmmmm

        then if you listen on that socket and check the request headers, for example by a simple python program:
        ```python
            from http.server import BaseHTTPRequestHandler, HTTPServer

            PORT = 7327

            class GetHandler(BaseHTTPRequestHandler):

                def do_GET(self):
                    self.send_response(200)
                    self.send_header('Content-type', 'text/html')
                    self.end_headers()
                    
                    for header, value in self.headers.items():
                        print(header, value)

                    self.wfile.write(b'Hello, world!')

            def run_server():
                server_address = ('', PORT)
                httpd = HTTPServer(server_address, GetHandler)
                print(f'Starting server on port {PORT}')
                httpd.serve_forever()

            if __name__ == '__main__':
                run_server()
        ```

        you get:
        ```
        Starting server on port 7327
        127.0.0.1 - - [12/Aug/2023 18:34:04] "GET / HTTP/1.1" 200 -
        Host 127.0.0.1:7327
        User-Agent curl/7.88.1
        Accept */*
        flag UCTF{c4n_p3n6u1n5_5urv1v3_1n_54l7_w473r}
        ```
2. Look inside the file: The deb files are simple compressed files after all, you can look inside them via changing the extension from `deb` to `zip` and simply unzipping them via GUI(`unzip` command does not work for some reasson) or via running `dpkg-deb -R <deb file> <extract path>`. Then by look at each of `control`, `postinst` and `uctf` you can find your way towards the answer.


# Flag

UCTF{c4n_p3n6u1n5_5urv1v3_1n_54l7_w473r}

# Categories

Check the categories which the challenge belongs to.

- [ ] Web
- [x] Reverse
- [ ] PWN
- [ ] Misc
- [ ] Forensics
- [ ] Cryptography
- [x] Steganography

# Points

| Warm up | This Challenge  | Evil |
| ------- |:---------------:| ----:|
| 25      | 150 | 500  |

# Resources

You should create a folder including all needed files. You may create the challenge using [Docker Compose](https://docs.docker.com/compose/gettingstarted/). Additionally, You may put your files here including *reverse engineering* or *pcap* files.
