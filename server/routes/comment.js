const express = require("express");
const router = express.Router();
const keys = require("../config/keys");

const Comment = require("../models/Comment");
//Post Comment

router.post('/', (req, res) => {
    Comment.find({ imdb: req.body.imdb }, (err, comments) => {
        if (err) throw err;
        else {
            res.json(comments)
        }
    })
});

router.post('/post', (req, res) => {
    let comment = new Comment(req.body);
    comment.save()
    .then(post => {
        res.status(200).json(post);
    })
    .catch(err => {
        res.status(400).send("unable to save to database");
    });
});

module.exports = router;