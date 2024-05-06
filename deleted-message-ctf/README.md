# Deleted Message
Cyber Police have seized a computer containing illegal content, but the data stored is secured with a password.

A member of the criminal organization owning the computer was arrested. Police suspect that the password was sent to the criminal via SMS, but the message was deleted right before the arrest.

You’re given a dump of the data partition of the phone (running Android 6.0). Your job as the forensic specialist is to recover the deleted password.

# Write Up
On Android 6.0, SMS messages reside on a SQLite databased located at `/data/data/com.android.providers.telephony/databases/mmssms.db`.

When a record is deleted in SQLite, it isn't really erased -- it continues existing on the database unless overwritten by another record.

Various SQLite forensic tools such as [FQLite](https://www.staff.hs-mittweida.de/~pawlaszc/fqlite/) or even a simple string extraction using `strings` can be used to recover the flag.

For example, using `strings` and `grep`:
```
$ strings ./data/data/com.android.providers.telephony/databases/mmssms.db | grep 'uctf{'
uctf{l057_1n_urm14}com.android.messaging
1uctf{l057_1n_urm14}
        3               uctf{l057_1n_urm14}
```

# Flag
uctf{l057_1n_urm14}

# Categories
- [ ] Web
- [ ] Reverse
- [ ] PWN
- [ ] Misc
- [x] Forensics
- [ ] Cryptography
- [ ] Steganography

# Points
| Warm up | This Challenge | Evil |
| ------- |:--------------:| ----:|
| 25      | 400        | 500  |

# Resources
Android data partition [dump file](resources/data.tar.gz).