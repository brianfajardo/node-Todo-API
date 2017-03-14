const mongoose = require('mongoose');

/* 
* Mongoose maintains connection over-time. 
* Waits for connection before trying to make query. 
* No need for micro-management of the order of things (like MongoDB)
*/
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
    mongoose
};

// testing heroku deploy save