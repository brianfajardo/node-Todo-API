const { MongoClient, ObjectId } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to establish connect with MongoDB servers.')
    };
    console.log('Connection established with MongoDB servers.');

    db.collection('Users')
        .findOneAndUpdate({
            _id: new ObjectId("58bfce1e2358831e1c10cde3")
        }, {
            $set: { /* $set is a MongoDB operator which sets the value of field in a document */
                name: 'Bernard'
            },
            $inc: { /* $inc increments the value of the field by a specified amount (ex. 1 below) */
                age: 1
            }
        }, {
            returnOriginal: false
        })
        .then((update) => {
            console.log(update)
        })

    // db.close()
})