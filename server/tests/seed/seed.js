const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();

const users = [{
    _id: userOneId,
    email: 'brian@examples.com',
    password: 'im a password',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth' }, 'secret').toString()
    }]
}, {
    _id: userTwoId,
    email: 'tiger@examples.com',
    password: 'im also a password'
}];

const todos = [{
    text: '1st test todo',
    _id: new ObjectId(),
}, {
    text: '2nd test todo',
    _id: new ObjectId(),
    completed: true,
    completedAt: 12345
}];

const populateTodos = (done) => {
    Todo.remove({})
        // mongoDB fn, inserts multiply documents into a collection
        .then(() => Todo.insertMany(todos))
        .then(() => done());
};

const populateUsers = (done) => {
    User.remove({})
        .then(() => {
            const userOne = new User(users[0]).save();
            const userTwo = new User(users[1]).save();

            // Handles all Promises, waits 'till all are done
            return Promise.all([userOne, userTwo]);
        })
        .then(() => done());
};

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
};
