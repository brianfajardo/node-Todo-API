const mongoose = require('mongoose');

/* 
* Mongoose maintains connection over-time. 
* Waits for connection before trying to make query. 
* No need for micro-management of the order of things (like MongoDB)
*/
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

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

const user = new User({
    email: 'example@mail.com  '
});

user.save()
    .then((doc) => {
        console.log('User saved', doc);
    }, (e) => {
        console.log('Unable to save user', e);
    });
