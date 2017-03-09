const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, resp) => {
    // body is stored in bodyParser (req.body)
    const todo = new Todo({
        text: req.body.text
    });

    todo.save()
        .then((doc) => {
            resp.send(doc); /* send doc back to the browser */
        }, (e) => {
            resp.status(400).send(e);
        });
});

app.get('/todos', (req, resp) => {
    Todo.find()
        .then((todos) => {
            // todos is an array
            // To increase flexibility of useage (ie. add properties or methods) we can put the todos array in an object
            resp.send({ todos });
        }, (e) => {
            resp.status(400).send(e);
        });
});

app.listen(3000, () => {
    console.log('Started on localhost:3000');
});

module.exports = {
    app
};
