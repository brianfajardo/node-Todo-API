const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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

UserSchema.methods.generateAuthToken = function () {
    const user = this; /* user instance (don't have to deal with ES6 this issue) */
    const access = 'auth';
    const token = jwt.sign({ _id: user._id.toHexString(), access }, 'secret').toString();

    user.tokens.push({ access, token });

    // Setting return so that server.js can chain methods
    return user.save().then(() => token);
};

const User = mongoose.model('User', UserSchema);

module.exports = {
    User
};
