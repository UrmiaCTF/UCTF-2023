import { promisify } from 'util';

import { createCipheriv, createDecipheriv } from 'crypto';
import { scrypt as spt, randomBytes as rb } from 'crypto';

export const scrypt = promisify(spt),
    randomBytes = promisify(rb);

export { createCipheriv, createDecipheriv };