const { MongoClient, ObjectId } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server.')
    }
    console.log('Connected to MongoDB server.')

    // db.collection('Todos')
    //     .find({
    //         _id: new ObjectId("58bfd5fda5f96a99bdce2b76") /* query Todos collection */
    //     })
    //     .toArray()
    //     .then((result) => {
    //         console.log('Todos:');
    //         console.log(JSON.stringify(result, undefined, 2))
    //     })
    //     .catch((err) => {
    //         console.log('Unable to fetch todos.')
    //     })
    
    db.collection('Users')
        .find({ name: 'Jen' })
        .toArray() /* .toArray() returns a Promise */
        .then((result) => {
            console.log(JSON.stringify(result, undefined, 2))
        })

    // db.close();
})