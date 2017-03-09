const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    // body is stored in bodyParser (req.body)
    const todo = new Todo({
        text: req.body.text
    });

    todo.save()
        .then((doc) => {
            res.send(doc); /* send doc back to the browser */
        }, (e) => {
            res.status(400).send(e);
        });
});

app.listen(3000, () => {
    console.log('Started on localhost:3000');
});

module.exports = {
    app
};
