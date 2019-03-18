const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Post');
const Post = mongoose.model('Post');

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

module.exports = router;