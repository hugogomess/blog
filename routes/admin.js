const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Category');
const Category = mongoose.model('Category');

router.get('/',(req, res) =>{
    res.render('admin/index');
});

router.get('/categorias',(req, res) =>{
    Category.find().sort({date: 'desc'}).then((categories) => {
        res.render('admin/category', {categories: categories});
    }).catch((err) => {
        req.flash('errorMsg', 'Ocorreu um erro ao listar as categorias, tente novamente mais tarde!');
        res.redirect('admin/categorias');
    });
});

router.post('/categorias/nova',(req, res) =>{
    var errors = [];
    
    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        errors.push({message: 'Nome ínvalido! '});
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        errors.push({message: 'Slug ínvalido! '});
    }

    if(errors.length > 0){
        var error = '';
        for (var i = 0; i < errors.length; i++){
            error += errors[i].message;       
        }

        req.flash('errorMsg', error);
        res.redirect('/admin/categorias');

    } else {
        const category = {
            name: req.body.name,
            slug: req.body.slug
        };
    
        new Category(category).save().then(() => {
            req.flash('successMsg', 'A categoria ' + category.name + ' foi criada com sucesso!');
            res.redirect('/admin/categorias');
        }).catch((err) => {
            req.flash('errorMsg', 'Ocorreu um erro ao tentar criar uma nova categoria, tente novamente mais tarde!');
            res.redirect('/admin/categorias');       
        });
    }
});

router.post('/categorias/editar',(req, res) => {
    var errors = [];

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        errors.push({message: 'Nome ínvalido! '});
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        errors.push({message: 'Slug ínvalido!'});
    }

    if(errors.length > 0){
        var error = '';
        for (var i = 0; i < errors.length; i++){
            error += errors[i].message;       
        }

        req.flash('errorMsg', error);
        res.redirect('/admin/categorias');

    } else {
        Category.findOne({_id: req.body.id}).then((category) => {
            category.name = req.body.name;
            category.slug = req.body.slug;
    
            category.save().then(() => {
                req.flash('successMsg', 'A categoria ' + category.name + ' foi atualizada com sucesso!');
                res.redirect('/admin/categorias');
            }).catch((err) => {
                req.flash('errorMsg', 'Ocorreu um erro ao tentar atualizar , tente novamente mais tarde!');
                res.redirect('/admin/categorias');
            });
        }).catch((err) => {
            req.flash('errorMsg','Ocorreu um erro, tente novamente mais tarde!');
            res.redirect('/admin/categorias');
        });
    }    
});

router.post('/categorias/excluir',(req, res) => {
    Category.deleteOne({_id: req.body.id}).then(() => {
        req.flash('successMsg', 'A categoria ' + req.body.name + ' foi excluida com sucesso!');
        res.redirect('/admin/categorias');
    }).catch((err) => {
        req.flash('errorMsg', 'Ocorreu um erro, tente novamente mais tarde!');
        res.redirect('/admin/categorias');
    });
});

module.exports = router;