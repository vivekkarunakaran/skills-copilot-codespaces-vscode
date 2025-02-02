// Create Web server
// Create a comment
// Get all comments
// Get a comment
// Update a comment
// Delete a comment

// Load modules
const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const mongoose = require('mongoose');

// Create a comment
router.post('/', (req, res, next) => {
    const comment = new Comment({
        _id: new mongoose.Types.ObjectId(),
        postId: req.body.postId,
        comment: req.body.comment
    });
    comment.save()
        .then(result => {
            res.status(201).json({
                message: 'Comment created',
                createdComment: {
                    _id: result._id,
                    postId: result.postId,
                    comment: result.comment
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

// Get all comments
router.get('/', (req, res, next) => {
    Comment.find()
        .select('_id postId comment')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                comments: docs.map(doc => {
                    return {
                        _id: doc._id,
                        postId: doc.postId,
                        comment: doc.comment
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

// Get a comment
router.get('/:commentId', (req, res, next) => {
    const id = req.params.commentId;
    Comment.findById(id)
        .select('_id postId comment')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    comment: doc
                });
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});
