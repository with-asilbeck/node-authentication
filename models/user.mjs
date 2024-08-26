import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter an email!"],
        unique: true,
        validate: [isEmail, "Please enter a valid email!"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password!"],
        minlength: [8, "Password minimum length is 8 characters!"]
    }
});

userSchema.post("save", (doc, next) => {
    console.log("New user created!", doc);
    next();
});

userSchema.pre("save", async function(next) {
    try {
        const salt = await bcrypt.genSalt(10);  // Explicit salt rounds
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.statics.login = async function(email, password) {
    
    const user = await this.findOne({ email });

    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            return { user, token };  // Return both user and token
        }
        throw Error('Incorrect password!');
    }
    throw Error('Incorrect email!');
};

const User = mongoose.model('users', userSchema);

export default User;
