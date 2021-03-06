const { User } = require('./../models/user');


// Looking up a user by token(x-auth value) and authenticating
const authenticate = (req, resp, next) => {
    const token = req.header('x-auth');

    User.findByToken(token)
        .then((user) => {
            if (!user) {
                return Promise.reject();
            }

            req.user = user;
            req.token = token;
            next();
        })
        .catch((e) => {
            resp.status(401).send();
        });
};

module.exports = {
    authenticate
};
