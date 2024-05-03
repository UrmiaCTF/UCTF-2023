# Challenge Title/Description

Farewell

# Write Up

The video file consists of a picture of *Fibonacci*  - the founder of the famous Fibonacci sequence - and 2 text notes, `it is FTL not TTL` and `the sequence is zoomed in. . .. ... ..... ........ .............`.

`it is FTL not TTL` points to the fact that the `Frame to Live` of each frame is from Fibonacci sequence.

`The sequence is zoomed in` is addressing the fact that the bit sequence which is shown in the middle of the video is zoomed in, each bit covers 4 pixels. and the dots are just another hint for figuring out the sequence.

### How to Solve
- Extract that part of the video via `ffmpeg -i vidoe.mp4 -vf "crop=8:8:400:400" cropped.mp4`
- Extract the frames of the vidoe via `ffmpeg -i cropped.mp4 '%04d.png'`

- Now convert the right frames(each frame lives to amount in the sequence) to 0s and 1s 1 for black and 0 for white pixels Note: each bit is 4 pixels (you can do this via a python script)

After converting the bit sequence to ASCII, the following text is extracted: `UCTF{G00dby3_fr13nd}`

# Flag

UCTF{G00dby3_fr13nd}

# Categories

Check the categories which the challenge belongs to.

- [ ] Web
- [ ] Reverse
- [ ] PWN
- [x] Misc
- [ ] Forensics
- [ ] Cryptography
- [ ] Steganography

# Points

| Warm up | This Challenge  | Evil |
| ------- |:---------------:| ----:|
|   25    |       500       | 500  |

# Resources

You should create a folder including all needed files. You may create the challenge using [Docker Compose](https://docs.docker.com/compose/gettingstarted/). Additionally, You may put your files here including *reverse engineering* or *pcap* files.
