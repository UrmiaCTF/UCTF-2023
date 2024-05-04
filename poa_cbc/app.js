import config from 'config';
import path from 'path';
import express from 'express';
// import mongoose from 'mongoose';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
// import mongoSanitize from 'express-mongo-sanitize';

import { approotdir } from './approotdir.js';
import { tokenParser, isLoggedIn, createToken } from './middleware/auth.js';
import { User } from './models/User.js';
import { getExp } from './utils/token.js';
import catchAsync from './utils/catchAsync.js';

// DataBase Connection
// const mongo_port = config.get('db.port');
// const mongo_host = config.get('db.host');
// mongoose.connect(`mongodb://${mongo_host}:${mongo_port}/poa`);
// const db = mongoose.connection;
// db.on('error', err => {
//     console.error({ err }, "error connecting to MongoDB")
// });
// db.on('open', () => {
    console.log("Database connected");
// });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(mongoSanitize({ replaceWith: '_' }));
app.use(morgan('tiny'))

app.use(tokenParser);

app.use(express.static('public'));

app.get('/', isLoggedIn, (req, res) => {
    res.redirect('/profile');
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(approotdir, 'views/login.html'));
});

app.post('/login', catchAsync(async (req, res) => {
    const { username, password } = req.body;

    const user = User.findOne(
        { username, password },
        { _id: 0, username: 1 }
    )//.lean();
    if (!user)
        return res.redirect('/login')

    const exp = getExp();
    // console.log('exp', exp)
    const token = await createToken({ user: username });
    res.cookie('token', token, { expires: new Date(exp) });
    res.redirect('/profile');
}));

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
})

app.get('/profile', isLoggedIn, (req, res) => {
    if (req.user === 'topg')
        res.sendFile(path.join(approotdir, 'views/topg.html'))
    else 
        res.sendFile(path.join(approotdir, 'views/user.html'))
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message || "Something went wrong");
})

const port = config.get('port');
const host = config.get('host');
app.listen(port, host, () => {
    console.log(`server is listening on ${host}:${port}`);
});