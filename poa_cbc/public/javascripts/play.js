const music = document.querySelector('audio');
const body = document.querySelector('body');

const clickPlay = e => {
    if (music.played.length > 0)
        this.removeEventListener('click', clickPlay);
    music.play();
}

const tabPlay = e => {
    if (music.played.length > 0)    
        this.removeEventListener('keypress', tabPlay);
    music.play();
}

body.addEventListener('click', clickPlay);
body.addEventListener('keypress', tabPlay);