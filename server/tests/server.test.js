const request = require('supertest');
const expect = require('expect');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

// Mocha: beforeEach(), describe(), it()
// SuperTest: request()

// Testing life-cycle: clears 'Todos' collection before each test case
// Assuming we start with 0 todos
beforeEach((done) => {
    Todo.remove({})
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
                Todo.find()
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
                        expect(todos.length).toBe(0);
                        done();
                    })
                    .catch((e) => done(e));
            });
    });
});
