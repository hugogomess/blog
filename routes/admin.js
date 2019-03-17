const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Category');
const Category = mongoose.model('Category');

router.get('/',(req, res) =>{
    res.render('admin/index');
});

router.get('/categorias',(req, res) =>{
    res.render('admin/category');
});

router.get('/categorias/nova',(req, res) =>{
    res.render('admin/add-category');
});

router.post('/categorias/nova',(req, res) =>{
    var errors = [];

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        errors.push({message: 'Nome ínvalido!'});
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        errors.push({message: 'Slug ínvalido!'});
    }

    if(errors.length > 0){
        res.render('admin/add-category', {errors: errors});
    } else {
        const category = {
            name: req.body.name,
            slug: req.body.slug
        };
    
        new Category(category).save().then(() => {
            req.flash('successMsg', 'Categoria criada com sucesso!');
            res.redirect('/admin/categorias');
        }).catch((err) => {
            req.flash('errorMsg', 'Ocorreu um erro ao tentar criar uma nova categoria, tente novamente mais tarde!');
            res.redirect('/admin/categorias');
        });
    
        
    }
    
    
});

module.exports = router;