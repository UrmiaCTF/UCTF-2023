# Padding Oracle Adventure
<img src="resources/oracleseye.jpg" title="Oracle's Eye" alt="Oracle's Eye" data-align="center"><br>
Greetings, brave challengers! As you embark on the Padding Oracle Adventure, remember that the key to triumph lies in understanding the AES-128-CBC encryption's Achilles' heel—the vulnerable Cipher Block Chaining mode. May the flags be with you!

> https://matrix.uctf.ir/

*hint 1*: login page grants access to a user with the credentials "guest" for both the username and password.
*hint 2*: token structure: `{"user": "<USERNAME>"}`
 
# Write Up

Welcome to the Padding Oracle Adventure challenge write-up! In this exhilarating journey, participants were presented with a seemingly secure login web page, but behind the scenes, a covert vulnerability lay dormant. Aspiring cybersecurity experts embarked on a mission to exploit a flawed Token-based authentication system, employing cunning tactics to unveil the coveted flag. Let's dive into the steps that led to triumph.

## Step 1: The Initial Access

Contestants commence their journey with a login page that grants access to a user with the credentials "guest" for both the username and password. Despite gaining entry, the flag remained tantalizingly out of reach, locked away by a Token-based authentication mechanism.<br>


## Step 2: Unraveling the Token Flaw

The intrigue deepens as participants uncovered that the Token-based authentication employs the "AES-128-CBC" encryption scheme. As a chink in its armor, the system utilizes the vulnerable Cipher Block Chaining (CBC) mode, rendering it susceptible to the Padding Oracle Attack. Contestants are provided with a JSON object structure within the token. The structure is as follows: `{"user":"<USERNAME>"}`

## Step 3: The Padding Oracle Attack

Armed with knowledge and ambition, participants embark on the crucial phase of the challenge—breaking the token through the powerful [rustpad](https://github.com/Kibouo/rustpad) script. This cunning tool exploits the Padding Oracle vulnerability by systematically altering the token's padding. Contestants craftily manipulate the JSON object's user field from "guest" to the privileged "topg". The script works its magic, generating a new token with the desired modifications.

```
$ rustpad -W -B 16 -O https://matrix.uctf.ir/profile -c -H 'Cookie: token=CTEXT' \
	-D 'ROAP0UgMrCSbEPOcjz1OER4ex%2F302AUtlGslsmryojn%2BzMMwCrVPfimFU8K6Q472' \
	-E '{"user":"topg"}'
dSyinoG6NwemD1rSHcDPKP7MwzAKtU9%2BKYVTwrpDjvY%3D
```

## Step 4: The Substitution and Triumph

With the new token in hand, participants execute a strategic move—replacing the token cookie in the browser's Dev-Tools with the freshly minted token. In a dramatic moment of suspense, they refresh the page, and the web application's mechanisms recognize the altered token. As a result, the once-forbidden veil is lifted, and contestants are triumphantly redirected to the sacred privileged page adorned with the elusive flag.<br>

Thank you for embarking on the Padding Oracle Adventure, and we hope you enjoyed the exhilarating journey into the realm of cybersecurity exploits!

# Flag

Flag is `UCTF{Pakdis_Factory}`

# Categories

This challenge belongs to following categories:

- [x] Web
- [ ] Reverse
- [ ] PWN
- [ ] Misc
- [ ] Forensics
- [x] Cryptography
- [ ] Steganography

# Points

| Warm up | This Challenge  | Evil |
| ------- |:---------------:| ----:|
| 25      |       350       | 500  |

# Resources
repo contains the Express.js webserver project