import express from "express";
import path from 'path';
import mongoose from "mongoose";
import session from 'express-session';
import morgan from 'morgan';
import { v4 as uuid } from 'uuid';

import { approotdir } from './approotdir.js';
import catchAsync from './utils/catchAsync.js';
import ExpressError from './utils/ExpressError.js';

import User from './models/User.js';
import { authenticate, isLoggedIn } from './middlewares/auth.js';

// DataBase Connection
const mongo_port = process.env.MONGO_PORT || 27017;
const mongo_host = process.env.MONGO_HOST || 'localhost';
mongoose.connect(`mongodb://${mongo_host}:${mongo_port}/uctf`);
const db = mongoose.connection;
db.on('error', err => {
    console.error({ err }, "error connecting to MongoDB")
});
db.on('open', () => {
    console.log("Database connected");
});

// Express Setup
const app = express();

app.use(morgan('tiny'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


const sessionConfig = {
    genid: function (req) {
        // const { user } = req.session;
        // if (user && user.username === 'admin') {
        //     return uuid() + 'UCTF{7_BURUKH_KUCHASE}'
        // }
        return uuid();
    },
    name: 'ssid',
    secret: 'stringsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));


app.get('/', (req, res) => {
    return res.redirect('/login');
});

app.get('/login', (req, res) => {
    if (req.session?.user) return res.redirect('/home');
    res.sendFile(path.join(approotdir, 'views/login.html'));
})

app.post('/login', authenticate, (req, res) => {
    res.redirect('/home');
})

app.get('/home', isLoggedIn, (req, res) => {
    res.sendFile(path.join(approotdir, 'views/index.html'));
})

app.get('/lookup/:username', catchAsync(async (req, res) => {
    const { username } = req.params;
    const user = await User.find({ $where: `this.username == '${username}'`}, { password: 0, _id: 0 });
    res.send(user);
}));

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    console.log(err);
    res.status(statusCode).send(err.message);
});

const port = process.env.PORT || 4000;
const host = process.env.HOST || 'localhost';
app.listen(port, host, () => {
    console.log(`server listening on ${host}:${port}`);
});
