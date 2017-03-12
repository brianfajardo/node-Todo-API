// Dynamically setting the node environment
// When working with Heroku, NODE_ENV is automatically set to 'production'
const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') { /* package.json >>> scripts >>> tests sets env to test */
    process.env.PORT = 3000;
    // TodoAppTest is another database, won't overwrite development DB
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
