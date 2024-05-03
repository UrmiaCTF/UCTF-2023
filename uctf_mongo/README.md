# MongoDB NoSQL Injection
<img src="resources/injection.png" title="nosql injection" alt="nosql injection" data-align="center"><br>
Welcome to the MongoDB Injection Maze! Your mission is to exploit a vulnerable web application that uses MongoDB as its database backend. Your goal is to penetrate into the system by leveraging MongoDB injection.

> https://cp.uctf.ir

# Write Up

In this exhilarating challenge, participants are tasked with infiltrating a vulnerable web application, exploiting a MongoDB injection vulnerability, and ultimately discovering the coveted flag. Let's dive into the thrilling journey that led to success.

## Step 1: The Entry Point

The challenge began with a seemingly harmless login page. Participants are required to gain access to the system to proceed. The application, however, has a critical vulnerability—MongoDB injection. A crafty exploit using a fetch command allows participants to bypass the authentication. The query leverages the $gt (greater than) operator on both the username and password fields, tricking the server into authenticating them without proper validation or sanitization.<br>

run this command on the dev-tools of your browser:
`await fetch('/login', { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: { $gt: "" }, password: { $gt: "" }}) })`



## Step 2: Infiltrating the System

Armed with access, participants can then explore the application. By hitting the referesh button you are automatically redirected to a page named "Users." This page features a search bar designed to look up users based on their usernames. The catch? Participants are completely in the dark about the users present in the system.

## Step 3: The Ingenious Loop-Up Attack

To proceed, participants need to find a way to reveal all users in the database, a task made trickier by the exact-matching behavior of the search bar. The ingenious solution is to insert a specially crafted payload: `' || 'a' == 'a`. This seemingly innocuous string exploits the query construction on the server side. The application utilizes the `$where` operator to execute a query like `Users.find({ $where: this.username == '${username}'})`. By injecting the payload, the query transforms into `Users.find({ $where: this.username == '' || 'a' == 'a'})`, effectively returning all users.

## Step 4: The Hunt for the Flag

With the user list finally laid bare, participants now have to scour through the table for the golden flag. The flag is ingeniously hidden within the IDs of the users, with the pivotal detail that the user with `admin` role holds the prized flag. participants need to distinguish the admin user from the rest and identify the flag in their corresponding ID field.

The challenge concludes with participants successfully locating the flag within the admin user's ID, showcasing their skills in exploiting MongoDB injection and navigating intricate search vulnerabilities.

Thank you for taking on the MongoDB Injection Maze challenge, and we hope you enjoyed the adrenaline-filled journey into the world of cybersecurity!

# Flag

Flag is `UCTF{7_Burukh_Kuchase}`

# Categories

This challenge belongs to following categories:

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
| 25      |       350       | 500  |

# Resources
repo contains the Express.js webserver project