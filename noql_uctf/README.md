# noql

I'm encrypted. try to break me!
- if you need a key anywhere use this "CT0cgUTU7gBBvA3DOk4H30JMQSFwNm-viqZm9eDwPK8="

# Write Up
This challenge is designed in the field of cryptography using Cryptography Python package. 
at first install Cryptography package using pip.
then import that like this : 'from cryptography.fernet import Fernet'.

It should be noted that Fernet does not allow reading and changing files without a key , so i create a key and share it with Participants.

To solve the challenge and decrypt the contents of the .txt file: First, we create an object from Fernet and send the key to it.
Then we read the encrypted information and store it in the encrypted variable.
We decrypt the encrypted information with the decrypt method and store it in the decrypted variable.
at last we can print the decrypted variable to see flag or we can store decrypted info's in new file.
the Python code to decrypt the .txt file is :

f = Fernet('CT0cgUTU7gBBvA3DOk4H30JMQSFwNm-viqZm9eDwPK8=')

with open('noql.txt', 'rb') as encrypted_file:
    encrypted = encrypted_file.read()

decrypted = f.decrypt(encrypted)

print(decrypted)

with open('dec_noql.txt', 'wb') as decrypted_file:
    decrypted_file.write(decrypted)

# Flag

flag : ucf{urum_noql}

# Categories

Check the categories which the challenge belongs to.

- [ ] Web
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

