const mongoose = require('mongoose');

/* 
* Mongoose maintains connection over-time. 
* Waits for connection before trying to make query. 
* No need for micro-management of the order of things (like MongoDB)
*/
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose
};
