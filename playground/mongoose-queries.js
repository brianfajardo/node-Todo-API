const { ObjectId } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
// const { User } = require('./../server/models/user');

// User.findById('58c152ceb6914b63fd5c8110')
//     .then((user) => {
//         if (!user) {
//             return console.log('User not found');
//         }
//         console.log('Found user', user);
//     })
//     .catch((e) => console.log(e));

const id = '58c14d8e262a4d27b4f8563a';

// Validate id
if (!ObjectId.isValid(id)) {
    console.log('ID not valid');
}

// returns an array
Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos', todos);
});

// // finds the FIRST one
// // returns the one document as opposed to array (above method)
// // preferred if looking for one only
Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('Todo', todo);
});

Todo.findById(id)
    .then((todo) => {
        if (!todo) {
            return console.log('ID not found.');
        }
        console.log('Todo by ID', todo);
    })
    .catch((e) => console.log(e))

