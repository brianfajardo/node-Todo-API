const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

/* 
/ Create mongoose model
/ The first argument is the singular name of the collection your model is for. 
/ Mongoose automatically looks for the plural version of your model name. 
*/

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        lowercase: true, // ie. lowercase@mail.com vs Lowercase@gmail.com, both are the same (unique)
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// Overriding toJSON to hide certain info for security purpose (JSON that is returned to the user)
// Hiding password and tokens on user which should not be returned
UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject(); /* convert document (ie. user) to a regular object with its properties */
    return _.pick(userObject, ['_id', 'email']);
};

// Instance methods are called with the individual document
UserSchema.methods.generateAuthToken = function () {
    const user = this; /* user instance (don't have to deal with ES6 `this` issue) */
    const access = 'auth';
    const token = jwt.sign({ _id: user._id.toHexString(), access }, 'secret').toString();

    user.tokens.push({ access, token });

    // Setting return so that server.js can chain methods in Promise when called
    return user.save().then(() => token);
};

// Model methods are called with the model with the `this` binding
UserSchema.statics.findByToken = function (token) {
    const User = this;
    let decoded; /* using let (vs. const) to declare */

    // Use try and catch to see if token was manipulated
    try {
        decoded = jwt.verify(token, 'secret');
    } catch (e) {
        // return a new Promise and reject it
        // findByToken success case (.then()) is never initiated, follows this new Promise path
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token, /* querying nested property */
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    const User = this;

    return User.findOne({ email })
        .then((user) => {
            if (!user) {
                return Promise.reject();
            }

            return new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result) {
                        resolve(user); /* authorized user is returned from Promise */
                    } else {
                        reject();
                    }
                });
            });
        });
};

// Runs something before an event (ie. save event)
UserSchema.pre('save', function (next) {
    const user = this;

    // Check if PW is modified. if it is, do not change
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = {
    User
};
