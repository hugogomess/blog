const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Post');
const Post = mongoose.model('Post');

router.get('/',(req, res) => {
    res.redirect('/');
});

router.get('/:slug', async(req, res) => {
    await Post.findOne({slug: req.params.slug}).populate('category').then((post) => {

        if (post) {
            res.render('post/index', {post: post});
        } else {
            req.flash('errorMsg', 'Essa pagina não existe!')
            res.redirect('/');
        };

    }).catch((err) => {
        req.flash('errorMsg', 'Ocorreu um erro interno!')
        res.redirect('/');
    });
});

module.exports = router;