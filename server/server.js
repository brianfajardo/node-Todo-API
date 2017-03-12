require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

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
            resp.send({ todos }); // ({ todos: todos })
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
            resp.status(400).send(e);
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
            resp.status(200).send({ todo });
        })
        .catch((e) => {
            resp.status(400).send(e);
        });
});

app.patch('/todos/:id', (req, resp) => {
    // updating object through PATCH raw JSON body
    const id = req.params.id;
    // _.pick() >>> Creates an object composed of the picked object properties.
    // body has a subset of properties that the user passed to the server
    // don't want user to update anything they choose
    const body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectId.isValid(id)) {
        return resp.status(404).send();
    }

    // update completedAt property based on completed property
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime(); // returns a JS timestamp in ms (Unix time)
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    // mongoose's {new: true} similar to {returnOriginal: false} of MongoDB
    // set the id's properties to the new body with updated completedAt
    Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
        .then((todo) => {
            if (!todo) {
                return resp.status(404).send();
            }
            resp.send({ todo });
        })
        .catch((e) => {
            resp.status(400).send(e);
        });
});

app.post('/users', (req, resp) => {
    // _pick properties email and password from JSON req
    const body = _.pick(req.body, ['email', 'password']);

    // create new user, passing body 
    const user = new User(body);

    // save user to db
    user.save()
        .then(() => {
            // Saving user and returning a generated token with auth access
            return user.generateAuthToken(); /* this passes generated token */
        })
        .then((token) => {
            // prefix header with x- is a custom header for specific purpose
            resp.header('x-auth', token).send(user);
        })
        .catch((e) => {
            resp.status(400).send(e);
        });
});

app.get('/users/me', authenticate, (req, resp) => {
    resp.send(req.user);
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {
    app
};
