import mongoose, { Schema } from 'mongoose';
import { generateUsername } from 'unique-username-generator';
import { v4 as uuid } from 'uuid';
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    uid: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    }
});
const User = mongoose.model('User', UserSchema);


async function populateUsers() {
    const users = [];
    const adminIndex = Math.floor(Math.random() * 4 + 15);
    const guestIndex = Math.floor(Math.random() * 5);
    for (let i = 0; i < 20; i++) {
        const username = generateUsername("", 3, Math.floor(Math.random() * 10 + 3));
        const uid = uuid().toString().replaceAll('-', '');
        const password = uuid().toString().replaceAll('-', '');

        if (guestIndex === i) {
            users.push(new User({
                username: 'guest',
                uid,
                role: 'guest',
                password
            }));
        } else if (adminIndex === i) {
            users.push(new User({
                username: username + Math.floor(Math.random() * 1000),
                uid: 'UCTF{7_Burukh_Kuchase}',
                role: 'admin',
                password
            }));
        } else {
            users.push(new User({
                username,
                uid,
                role: 'user',
                password
            }));
        }
    }

    return await User.insertMany(users);
}


User.deleteMany({})
    .then(() => populateUsers())
    .then(res => console.log(`Database populated with ${res.length} users`))
    .catch(console.error);

export default User;