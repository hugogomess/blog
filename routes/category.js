const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Post');
const Post = mongoose.model('Post');

require('../models/Category');
const Category = mongoose.model('Category');

router.get('/', async(req, res) => {
    await Category.find().sort({name: ''}).then((categories) => {
        res.render('category/index', {categories: categories});
    }).catch((err) => {
        req.flash('errorMsg', 'Ocorreu um erro interno!');
        res.redirect('/');
    });
});

router.get('/:slug', async(req, res) => {
    await Category.findOne({slug: req.params.slug}).then( async(category) => {

        if (category){
            
            await Post.find({category: category._id}).then((posts) => {
                res.render('category/post', {posts: posts, category: category});
            }).catch((err) => {
                req.flash('errorMsg', 'Ocorreu um erro interno!');
                res.redirect('/categorias');
            });

        } else {
            req.flash('errorMsg', 'Essa categoria não existe!');
            res.redirect('/categorias');
        };


    }).catch((err) => {
        req.flash('errorMsg', 'Ocorreu um erro interno!');
        res.redirect('/categorias');
    });
});

module.exports = router;