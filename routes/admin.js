const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Category');
const Category = mongoose.model('Category');

router.get('/',(req, res) =>{
    return res.render('admin/index');
});

router.get('/categorias',(req, res) =>{
    return res.render('admin/category');
});

router.get('/categorias/nova',(req, res) =>{
    return res.render('admin/add-category');
});

router.post('/categorias/nova',(req, res) =>{
    const category = {
        name: req.body.name,
        slug: req.body.slug
    };

    new Category(category).save();

    return res.redirect('/admin/categorias');
});

module.exports = router;