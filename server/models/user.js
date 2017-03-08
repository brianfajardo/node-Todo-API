const mongoose = require('mongoose');

/* 
/ Create mongoose model
/ The first argument is the singular name of the collection your model is for. 
/ Mongoose automatically looks for the plural version of your model name. 
*/

const User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
});

module.exports = {
    User
};
