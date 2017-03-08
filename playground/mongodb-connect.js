// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb') // ES6 destructuring

// .connect('PATH SYNTAX', CALLBACK)
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server.')
    }
    console.log('Connected to MongoDB server.')

    db.collection('Users').insertOne({
        name: 'Brian',
        age: 23,
        country: 'Canada'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert todo into collection "Users"')
        }
        console.log(result.ops[0]._id.getTimestamp())
    })

    db.close();
})