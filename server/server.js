const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

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

// req.params = "**/:PARAMS"
app.get('/todos/:id', (req, resp) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return resp.status(404).send();
    }

    Todo.findById(id)
        .then((todo) => {
            if (!todo) {
                return resp.status(404).send();
            }
            resp.send({ todo });
        })
        .catch((e) => {
            resp.status(400).send();
        });
});

app.delete('/todos/:id', (req, resp) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return resp.status(404).send();
    }

    Todo.findByIdAndRemove(id)
        .then((todo) => {
            if (!todo) {
                return resp.status(404).send();
            }
            resp.status(200).send(todo);
        })
        .catch((e) => {
            resp.status(400).send();
        });
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {
    app
};
