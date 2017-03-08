const mongoose = require('mongoose');

/* 
* Mongoose maintains connection over-time. 
* Waits for connection before trying to make query. 
* No need for micro-management of the order of things (like MongoDB)
*/
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

// Create mongoose model
const Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

const newTodo = new Todo({ /* use mongoose model constructor */
    text: 'Buy vegetables'
});

newTodo.save() /* returns a Promise */
    .then((doc) => {
        console.log(`Saved todo: ${doc}`);
    }, (e) => {
        console.log('Unable to save todo', e);
    });

const newTodo2 = new Todo({
    text: 'Go for a walk',
    completed: true,
    completedAt: 123,
});

newTodo2.save()
    .then((doc) => {
        console.log(`Saved todo: ${doc}`);
    }, (e) => {
        console.log('Unable to save todo', e);
    });
