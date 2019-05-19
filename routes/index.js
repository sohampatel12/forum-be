var express = require('express');
var router = express.Router();
var loginModule = require('../dbModule/login');
var jwt = require('../node_modules/jsonwebtoken');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

var authenticate = function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  loginModule.authenticateUser(username, password, req, res, next);
}

var generateJwtToken = function (req, res) {
  console.log("Inside token generator");
  console.log("id :: " + req.user._id);
  payload = {
    user: req.user._id
  }
  jwt.sign(payload, 'secret', { expiresIn: '1h' }, function (err, token) {
    console.log("token :: " + token);
    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: req.user._id,
      username: req.body.username
    })
  });
}

router.post('/login', authenticate, generateJwtToken);

router.post('/signup', function(req, res) {
  loginModule.createUser(req, res);
})

module.exports = router;
