<img src="Resources/UCTF.jpg" title="UCTF" alt="UCTF" data-align="center">

# htaccess

First, visit the challenge URL provided in the CTF event. Your job is to bypass these htaccess restrictions and view the flag files anyway. Good luck!

> http://htaccess.uctf.ir

# Write Up

An .htaccess (hypertext access) file is a directory-level configuration file supported by several web servers, such as Apache. It is used for configuring website-access issues, including URL redirection, URL shortening, access control for different web pages and files, and more. The 'dot' (period or full stop) before the file name makes it a hidden file in Unix-based environments. The .htaccess file allows you to set server configurations for a specific directory, which could be the root directory of your website or a subdirectory

In this challenge we need to bypass htaccess restrictions:

1. Analyze the .htaccess files mentioned in the challenge description. These files are used to configure permissions for /one/flag.txt and /two/flag.txt. Understanding the rules in these files will help in bypassing the restrictions and accessing the flag files.
2. For the first one we can overwrite the host header to localhost value.
3. the second one restricting us if flag is anywhere in our URL. We can actually just URL encode one of the characters and that way it'll process as a URL and code a character and then decode as an "f"(f:%66).
4. Combine the parts of the flag obtained from /one/flag.txt and /two/flag.txt to form the complete flag.

# Flag

Flag is uctf{Sule_Dukol_waterfall}

# Categories

Check the categories which the challenge belongs to.

- [X] Web
- [ ] Reverse
- [ ] PWN
- [ ] Misc
- [ ] Forensics
- [ ] Cryptography
- [ ] Steganography

# Points

| Warm up | This Challenge  | Evil |
| ------- |:---------------:| ----:|
| 25      |     250-300     | 500  |

# Resources

1. solve: solve.sh
2. src: dockerized webapp
