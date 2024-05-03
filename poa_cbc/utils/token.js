import config from 'config';
import {
    scrypt,
    randomBytes,
    createCipheriv,
    createDecipheriv
} from './cryptop.js'

const { algorithm, password, salt } = config.get('token');
const key = await scrypt(password, salt, 24)

async function encrypt(data, algorithm, key) {
    const iv = await randomBytes(16);
    const cipher = createCipheriv(algorithm, key, iv);
    const bufs = [ iv , cipher.update(data), cipher.final()];
    return Buffer.concat(bufs).toString('base64');
}

async function decrypt(cipher, algorithm, key) {
    const cipherBuffer = Buffer.from(cipher, 'base64');
    const iv = cipherBuffer.subarray(0, 16);
    const value = cipherBuffer.subarray(16);
    const decipher = createDecipheriv(algorithm, key, iv);
    let data = Buffer.concat([ decipher.update(value), decipher.final() ]).toString('utf-8');
    return data;
}


export const createToken = async (plaintextToken) => {
    const data = JSON.stringify(plaintextToken);
    return encrypt(data, algorithm, key);
}

export const accessToken = async (token) => {
    const data = await decrypt(token, algorithm, key);
    return JSON.parse(data);
}

export const getExp = () => {
    const exp = new Date(Date.now() + config.get('token.exp'));
    const y = exp.getFullYear(),
        m = (exp.getMonth() + 1).toString().padStart(2, 0),
        d = exp.getDate().toString().padStart(2, 0);
    
    return `${y}-${m}-${d}`;
}

// const obj = { username: "vafa", expiresAt: new Date() };