// MANAGING LOCAL SYSTEM ENVIRONMENTS

// Dynamically setting the node environment
// When working with Heroku, NODE_ENV is automatically set to 'production'
const env = process.env.NODE_ENV || 'development';

// env is set to test in npm script
if (env === 'development' || env === 'test') {
    const config = require('./config.json');
    const envConfig = config[env]; /* ex. config[development] */

    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key]
        // ex. process.PORT = 3000
        // ex. process.MONGODB_URI = "mongodb://localhost:27017/TodoApp"
    });
};
