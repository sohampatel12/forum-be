var mongoose = require('../node_modules/mongoose');
var options = require('./options');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type: String },
    password: { type: String },
    email: { type: String }
});

var uri = 'mongodb+srv://sohampatel12:October1@cluster-zs6wy.mongodb.net/forum?retryWrites=true';
mongoose.connect(uri, options).then(
    () => { console.log('Connected'); },
    err => { console.log(err); }
);

exports.handleError = function (err) {
    console.log(err);
    return err;
}

exports.authenticateUser = function (username, password, req, res, next) {
    let user = mongoose.model('user', userSchema, 'user');
    user.find({ "username": username }, function (err, users) {
        if (err || !users) {
            console.log('1')
            res.status(500).json({ message: 'Internal server error' });
        }
        else if (users.length == 0) {
            res.status(404).json({ message: 'User not found' })
        }
        else {
            console.log(users);
            if (users[0].password == password) {
                req.user = users[0];
                next();
            } else {
                res.status(401).json({ message: 'Incorrect username or password' })
            }
        }
    });
}

exports.createUser = function (req, res) {
    let user = mongoose.model('user', userSchema, 'user');
    user.find({ "username": req.body.username }, function (err, users) {
        if (err || !users) {
            res.status(500).json({ message: 'Internal server error' });
        }
        else if (users.length !== 0) {
            res.status(404).json({ message: 'Username already taken' })
        }
        else {
            user.insertMany([{ "username": req.body.username, "password": req.body.password, "email": req.body.email }],
                function (err, docs) {
                    if (err || !docs) {
                        console.log('1')
                        res.status(500).json({ message: 'Internal server error' });
                    }
                    else {
                        res.status(200).json({ message: 'User created' })
                    }
                });
        }
    });
}
