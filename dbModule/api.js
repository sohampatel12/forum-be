var mongoose = require('../node_modules/mongoose');
var options = require('./options');
var Schema = mongoose.Schema;

var postsSchema = new Schema({
    _id: { type: Schema.Types.ObjectId },
    content: { type: String },
    likes: { type: Number },
    created_on: { type: Date },
    created_by: { type: Schema.Types.ObjectId },
    comments: { type: Array },
    totalComments: { type: Number }
});

var commentsSchema = new Schema({
    _id: { type: Schema.Types.ObjectId },
    parent_id: { type: Schema.Types.ObjectId },
    content: { type: String },
    likes: { type: Number },
    created_on: { type: String },
    created_by: { type: Schema.Types.ObjectId }
});

var createPostSchema = new Schema({
    _id: { type: Schema.Types.ObjectId },
    content: { type: String },
    likes: { type: Number },
    created_by: { type: Schema.Types.ObjectId },
    created_on: { type: Date }
})

var getComments = function (post) {
    let comments = mongoose.model('comments', commentsSchema, 'comments');
    console.log(post);
    return comments.find({ parent_id: post._id }, function (err, comments) {
        if (err || !comments) { console.log("Internal server error"); }
        else if (comments.length == 0) { return []; }
        else { return comments; }
    });
}

exports.getPosts = function (req, res, next) {
    let posts = mongoose.model('posts', postsSchema, 'posts');
    posts.find({}, async function (err, posts) {
        if (err || !posts) { res.status(500).json({ message: 'Internal server error' }); }
        else if (posts.length == 0) { res.status(404).json({ message: 'No posts yet' }) }
        else {
            for (let post of posts) {
                let comments = await getComments(post);
                post.comments = comments;
                post.totalComments = comments.length;
            }
            res.status(200).send(posts);
        }
    });
}

exports.createPost = function (req, res, next) {
    let post = mongoose.model('createPost', createPostSchema, 'posts');
    let postData = {
        content: req.body.content,
        likes: 0,
        created_on: Date.now(),
        created_by: mongoose.Types.ObjectId(req.body.user)
    };
    post.insertMany([postData],
        function (err, docs) {
            if (err || !docs) { res.status(500).json({ message: 'Internal server error' }); }
            else {
                res.status(200).send(docs[0])
            }
        });
}

exports.addComment = function (req, res, next) {
    let comment = mongoose.model('comment', commentsSchema, 'comments');
    let commentData = {
        parent_id: req.body.postId,
        content: req.body.content,
        likes: 0,
        created_on: Date.now(),
        created_by: mongoose.Types.ObjectId(req.body.user)
    };
    comment.insertMany([commentData],
        function (err, docs) {
            if (err || !docs) { res.status(500).json({ message: 'Internal server error' }); }
            else {
                res.status(200).send(docs[0])
            }
        });
}