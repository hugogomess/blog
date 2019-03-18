const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Post');
const Post = mongoose.model('Post');

require('../models/Category');
const Category = mongoose.model('Category');

router.get('/',(req, res) =>{
    Post.find().populate('category').sort({date: 'desc'}).then((posts) => {
        
        res.render('index', {posts: posts});

    }).catch((err) => {
        
        req.flash('errorMsg', 'Ocorreu um erro interno!');
        res.redirect('/404');

    }); 
});

router.get('/404',(req, res) => {
    res.send('Error 404 :(');
});

router.get('/postagens',(req, res) => {
    res.redirect('/');
});

router.get('/postagens/:slug',(req, res) => {
    Post.findOne({slug: req.params.slug}).populate('category').then((post) => {

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

router.get('/categorias',(req, res) => {
    Category.find().sort({name: ''}).then((categories) => {
        res.render('category/index', {categories: categories});
    }).catch((err) => {
        req.flash('errorMsg', 'Ocorreu um erro interno!');
        res.redirect('/');
    });
});

router.get('/categorias/:slug',(req, res) => {
    Category.findOne({slug: req.params.slug}).then((category) => {

        if (category){
            
            Post.find({category: category._id}).then((posts) => {
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