const MongoClient = require('mongodb').MongoClient

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
        console.log(result.ops)
    })

    db.close();
})