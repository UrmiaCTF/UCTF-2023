import { accessToken, createToken as crtToken } from "../utils/token.js";
import catchAsync from '../utils/catchAsync.js';
import { User } from "../models/User.js";

export const tokenParser = catchAsync(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token)
        return next();

    const data = await accessToken(token);
    // if (hasExpired(data.exp))
    //     return next();

    // console.log(data);

    const user = await User.exists({ username: data.user });
    if (!user) {
        throw new Error("User not found");
    }

    req.user = data.user;
    next();
});

// function hasExpired(expiresAt) {
//     if (Date.now() > new Date(expiresAt).getTime())
//         return true;
//     else
//         return false;
// }

export const isLoggedIn = (req, res, next) => {
    if (req.user)
        next();
    else
        res.redirect('/login');
}

export const createToken = async (data) => {
    return await crtToken(data);
}