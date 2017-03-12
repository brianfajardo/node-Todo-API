const { ObjectId } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');


// Mongoose remove all note {}
// Todo.remove({})
//     .then((result) => {
//         console.log(result);
//     });

// Matches first document, removes and returns it
// unlike .remove(), that just removes
// query by object property
Todo.findOneAndRemove({_id: '58c51fbc3751c2e22ac50787'})
    .then((doc) => {
    })

// returns doc similar to above
Todo.findByIdAndRemove('58c51fbc3751c2e22ac50787')
    .then((todo) => {
        console.log(todo);
    })