const { MongoClient, ObjectId } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server.')
    }
    console.log('Connection established with MongoDB server.')

    // -- deleteOne --
    // db.collection('Todos')
    //     .deleteOne({text: 'Walk the doggy'})
    //     .then((result) => {
    //         console.log(result.result)
    //     })

    // -- deleteMany --
    // db.collection('Todos')
    //     .deleteMany({text: 'Brush teeth'})
    //     .then((result) => {
    //         console.log(result.result)
    //     })

    // -- findOneAndDelete -- returns deleted object
    // db.collection('Todos')
    //     .findOneAndDelete({completed: false})
    //     .then((result) => {
    //         console.log(result)
    //     })

    db.collection('Users')
        .deleteMany({name: 'Jen'})
        .then((result) => {
            console.log(result.result)
        })

    db.collection('Users')
        .findOneAndDelete({ _id: new ObjectId("58bfe355a5f96a99bdce2f1b") })
        .then((res) => {
            console.log(res)
        })

    // db.close()
})