# import cryptography package 
from cryptography.fernet import Fernet



#create key
key = Fernet.generate_key()

with open('mykey.key', 'wb') as mykey:
    mykey.write(key)



#read key
with open('mykey.key', 'rb') as mykey:
    key = mykey.read()



#encryption code
f = Fernet(key)

with open('noql1.txt', 'rb') as original_file:
    original = original_file.read()

encrypted = f.encrypt(original)

with open ('noql.txt', 'wb') as encrypted_file:
    encrypted_file.write(encrypted)
 
 

#decryption code 
f = Fernet(key)

with open('noql.txt', 'rb') as encrypted_file:
    encrypted = encrypted_file.read()

decrypted = f.decrypt(encrypted)

with open('dec_noql.txt', 'wb') as decrypted_file:
    decrypted_file.write(decrypted)