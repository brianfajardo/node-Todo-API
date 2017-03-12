const request = require('supertest');
const expect = require('expect');
const { ObjectId } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

// Mocha: beforeEach(), describe(), it()
// SuperTest: request()

const todos = [{
    text: '1st test todo',
    _id: new ObjectId(),
}, {
    text: '2nd test todo',
    _id: new ObjectId(),
    completed: true,
    completedAt: 12345
}];

// Testing life-cycle: clears 'Todos' collection before each test case
// Assuming we start with 0 todos
beforeEach((done) => {
    Todo.remove({})
        // mongoDB fn, inserts multiply documents into a collection
        .then(() => Todo.insertMany(todos))
        .then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        const text = 'todo test text';

        request(app) /* SuperTest calling express routes */
            .post('/todos') /* Testing defined/specific route */
            .send({ text })
            .expect(200) /* If first arg is a number, expect will check this number against the HTTP status code in */
            .expect((resp) => { /* Custom expect assertion function */
                expect(resp.body.text).toBe(text);
            })
            .end((err, resp) => {
                if (err) {
                    return done(err);
                }
                // Checking to see what was stored (below)
                // Mongoose models and instances can communicate with the database (ie. querying, inserting, deleting, updating data)
                // This allow us to use methods on the model like Todo.find() to query the database
                Todo.find({ text })
                    .then((todos) => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    })
                    .catch((e) => done(e));
            });
    });

    it('should not create a todo with invalid body data', (done) => {
        // Server check
        request(app)
            .post('/todos')
            .send({}) /* empty object */
            .expect(400)
            .end((err, resp) => {
                if (err) {
                    return done(err);
                }

                // Database check
                Todo.find()
                    .then((todos) => {
                        expect(todos.length).toBe(2);
                        done();
                    })
                    .catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((resp) => {
                expect(resp.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`) /* template string to insert id of first todo and convert to String type */
            .expect(200)
            .expect((resp) => {
                expect(resp.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        const hexID = new ObjectId().toHexString();

        request(app)
            .get(`/todos/${hexID}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo by id', (done) => {
        const hexID = todos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
            .expect(200)
            .expect((resp) => {
                expect(resp.body.todo._id).toBe(hexID);
            })
            .end((err, resp) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hexID)
                    .then((todo) => {
                        expect(todo).toNotExist();
                        done();
                    })
                    .catch((e) => done(e));
            });
    });

    it('should return 404 if todo not found', (done) => {
        const hexID = new ObjectId().toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for invalid object ids', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done)=> {
        const id = todos[0]._id;

        request(app)
            .patch(`/todos/${id}`)
            .send({
                text: 'BANANA SMOOTHIE',
                completed: true
            })
            .expect(200)
            .expect((resp) => {
                expect(resp.body.todo.text).toBe('BANANA SMOOTHIE');
                expect(resp.body.todo.completed).toBe(true);
                expect(resp.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        const id = todos[1]._id;

        request(app)
            .patch(`/todos/${id}`)
            .send({
                text: 'AVOCADO MILKSHAKE',
                completed: false
            })
            .expect(200)
            .expect((resp) => {
                expect(resp.body.todo.text).toBe('AVOCADO MILKSHAKE');
                expect(resp.body.todo.completed).toBe(false);
                expect(resp.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });
});