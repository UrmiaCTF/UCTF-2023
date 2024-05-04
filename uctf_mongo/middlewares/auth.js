import User from '../models/User.js';
import catchAsync from "../utils/catchAsync.js";

export const authenticate = catchAsync(async (req, res, next) => {
    if (req.session.user) return next();

    console.log(req.body);
    const { username, password } = req.body;
    const user = await User.findOne({ username, password }, { username: 1, _id: 0 });
    if (!user) {
        return res.redirect('/login');
    }

    req.session.user = user;
    next();
});

export const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        res.redirect('/login');
    }
}