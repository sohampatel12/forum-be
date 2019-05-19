var express = require('express');
var router = express.Router();
var apiModule = require('../dbModule/api');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/getPosts', function (req, res, next) {
    apiModule.getPosts(req, res, next);
});

router.post('/createPost', function (req, res, next) {
    apiModule.createPost(req, res, next);
});

router.post('/addComment', function(req, res, next) {
    apiModule.addComment(req, res, next);
});

module.exports = router;