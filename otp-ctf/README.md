
# OTP (Onion Transfer Protocol)

This CTF question focuses on finding the flag from a hidden FTP server behind Tor. You will need the following credentials:

- Username: `myuser`

- Password: `mypass`

The hidden service can be accessed at the following address using the default port (21):

- `otpxxwpvfjume6kdlii5gcghgg53lj7gnl7hoigg4sx2wc45xwasw7id.onion`

However, beware! There are numerous booby traps lurking within the dark corners.

# Write Up

I use FileZilla client for solving the question. Here are the steps:

1. Start Tor Browser.

2. Start FileZilla 

3. Config Generic proxy of Tor in FileZilla (SOCKS5 proxy, generally bound on 127.0.0.1:9150).

4. Connect to announced hidden Tor service with the provided credentials in FileZilla.

5. Check out the banner which indicates the path for correct ```flag.txt```

6. In the folder, the ```flag.txt``` redirects the users to another folder with another clue.

7. The final folder contains the flag!

Notice that the private key in docker-compose file is not the real one for the onion address.

# Flag

Flag is ```CTF{N33DL3_AM0NG_0NI0NS}```

# Categories
This question belongs to following categories:
- [ ] Web
- [ ] Reverse
- [ ] PWN
- [X] Misc
- [X] Forensics
- [ ] Cryptography
- [ ] Steganography

# Points
| Warm up | This Challenge  | Evil |
| ------- |:---------------:| ----:|
| 25      | 250 - 300 | 500  |

# Resources
This question have a folder named *ftp-data* which contains lots of invalid flags. This is a volume of the docker container.

**PLEASE REMOVE WRITE PERMISSION OF THE FTP-DATA FOLDER, SO USERS WILL NOT BE ABLE TO WRITE FILES**