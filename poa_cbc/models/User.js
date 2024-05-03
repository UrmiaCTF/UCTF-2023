// import mongoose, { Schema } from 'mongoose';

// const UserSchema = new Schema({
//     username: {
//         type: String,
//         unique: true,
//         required: true
//     },
//     password: {
//         type: String,
//         required: true
//     }
// });

// export const User = mongoose.model('User', UserSchema);

const users = [
    {
        username: 'guest',
        password: 'guest'
    },
    {
        username: 'topg',
        password: 'F3G#Rg5h%THS~Bla'
    }
]
// User.deleteMany({}).then(_ => {
//         User.insertMany(users).then(_ => { console.log('Database populated')})
//     })
export const User = {
    users,
    findOne(user, options) {
        const { username, password } = user;
        if (typeof(username) !== 'string')
            throw new Error("invalid input: username must be string");
        if (typeof(password) !== 'string')
            throw new Error("invalid input: username must be string");

        for (let user of this.users) {
            if (user.username === username && user.password === password) {
                return user;
            }
        }
        return null;
    },
    exists({ username }) {
        for (let user of this.users) {
            if (user.username === username){
                return user;
            }
        }
        return null;
    }
}
