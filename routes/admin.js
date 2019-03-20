const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {adminPermissionOnly} = require('../helpers/permission');

require('../models/Category');
const Category = mongoose.model('Category');

require('../models/Post');
const Post = mongoose.model('Post');

router.get('/', adminPermissionOnly, (req, res) =>{
    res.render('admin/index');
});

router.get('/categorias', adminPermissionOnly, (req, res) =>{
    Category.find().sort({date: 'desc'}).then((categories) => {
        res.render('admin/category', {categories: categories});
    }).catch((err) => {
        req.flash('errorMsg', 'Ocorreu um erro ao listar as categorias, tente novamente mais tarde!');
        res.redirect('admin/categorias');
    });
});

router.post('/categorias/nova', adminPermissionOnly, (req, res) =>{
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

router.post('/categorias/editar', adminPermissionOnly, (req, res) => {
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

router.post('/categorias/excluir', adminPermissionOnly, (req, res) => {
    Category.deleteOne({_id: req.body.id}).then(() => {
        req.flash('successMsg', 'A categoria ' + req.body.name + ' foi excluida com sucesso!');
        res.redirect('/admin/categorias');
    }).catch((err) => {
        req.flash('errorMsg', 'Ocorreu um erro, tente novamente mais tarde!');
        res.redirect('/admin/categorias');
    });
});

router.get('/postagens', adminPermissionOnly, (req, res) => {
    Post.find().populate('category').sort({date: 'desc'}).then((posts) => {
        res.render('admin/post', {posts: posts});
    }).catch((err) => {
        req.flash('errorMsg', 'Ocorreu um erro ao tentar listar postagens!');
        req.redirect('/admin/postagens');
    });

    
});

router.get('/postagens/nova', adminPermissionOnly, (req, res) => {
    Category.find().then((categories) => {
        res.render('admin/post-add', {categories: categories});
    }).catch((err) => {
        req.flash('errorMsg', 'Ocorreu um erro ao carregar o formulario!');
        res.render('admin/post-add');
    });
    
});

router.post('/postagens/nova', adminPermissionOnly, (req, res) => {
    var errors = [];

    if(!req.body.title || typeof req.body.title == undefined || req.body.title == null){
        errors.push({message: 'Titulo ínvalido! '});
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        errors.push({message: 'Slug ínvalido! '});
    }

    if(!req.body.description || typeof req.body.description == undefined || req.body.description == null){
        errors.push({message: 'Descrição ínvalida! '});
    }

    if(!req.body.content || typeof req.body.content == undefined || req.body.content == null){
        errors.push({message: 'Conteúdo ínvalido! '});
    }

    if (req.body.category == 0){
        errors.push({message: 'Por favor selecione uma categoria válida! '});
    } else if (req.body.category == 1){
        errors.push({message: 'Por favor cadastre uma categoria antes de cadastrar uma postagem! '});
    }

    if(errors.length > 0){
        var error = '';
        for (var i = 0; i < errors.length; i++){
            error += errors[i].message;       
        }

        req.flash('errorMsg', error);
        res.redirect('/admin/postagens/nova');
    } else {
        const post = {
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            content: req.body.content,
            category: req.body.category,
        }

        new Post(post).save().then(() => {
            req.flash('successMsg', 'Postagem criada com sucesso!');
            res.redirect('/admin/postagens');
        }).catch((err) => {
            req.flash('errorMsg', 'Ocorreu um erro ao tentar criar postagem!');
            res.redirect('/admin/postagens/nova');
        });
    }
});

router.get('/postagens/editar/:id', adminPermissionOnly, (req, res) => {
    Post.findOne({_id: req.params.id}).then((post) => {
        Category.find().then((categories) => {
            res.render('admin/post-update', {post: post, categories: categories});

        }).catch((err) => {
            req.flash('errorMsg', 'Ocorreu um erro ao listar as categorias do formulario!');
            res.redirect('/admin/postagens');

        });
    }).catch((err) => {
        req.flash('errorMsg', 'Ocorreu um erro ao carregar o formulario de edição!');
        res.redirect('/admin/postagens');

    });
});

router.post('/postagens/editar', adminPermissionOnly, (req, res) => {
    Post.findOne({_id: req.body.id}).then((post) => {
        var errors = [];

        if(!req.body.title || typeof req.body.title == undefined || req.body.title == null){
            errors.push({message: 'Titulo ínvalido! '});
        }

        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
            errors.push({message: 'Slug ínvalido! '});
        }

        if(!req.body.description || typeof req.body.description == undefined || req.body.description == null){
            errors.push({message: 'Descrição ínvalida! '});
        }

        if(!req.body.content || typeof req.body.content == undefined || req.body.content == null){
            errors.push({message: 'Conteúdo ínvalido! '});
        }

        if (req.body.category == 0){
            errors.push({message: 'Por favor selecione uma categoria válida! '});
        } else if (req.body.category == 1){
            errors.push({message: 'Por favor cadastre uma categoria antes de cadastrar uma postagem! '});
        }

        if(errors.length > 0){
            var error = '';
            for (var i = 0; i < errors.length; i++){
                error += errors[i].message;       
            }

            req.flash('errorMsg', error);
            res.redirect('/admin/postagens/editar/' + req.body.id);
        } else {
            post.title = req.body.title;
            post.slug = req.body.slug;
            post.description = req.body.description;
            post.content = req.body.content;
            post.category = req.body.category;

            post.save().then(() => {
                req.flash('successMsg', 'Postagem atualizada com sucesso!');
                res.redirect('/admin/postagens');
            }).catch((err) => {
                req.flash('errorMsg', 'Ocorreu um erro ao tentar editar a postagem!');
                res.redirect('/admin/postagens/editar/' + req.body.id);
            });
        }}).catch((err) => {
            req.flash('errorMsg', 'Ocorreu um erro ao salvar as alterações!')
            res.redirect('/admin/postagens');
    });
});

router.post('/postagens/excluir', adminPermissionOnly, (req, res) => {
    Post.deleteOne({_id: req.body.id}).then(() => {
        req.flash('successMsg', 'A Postagem ' + req.body.title + ' foi excluida com sucesso!');
        res.redirect('/admin/postagens');
    }).catch((err) => {
        req.flash('errorMsg', 'Ocorreu um erro, tente novamente mais tarde!');
        res.redirect('/admin/postagens');
    });

});

module.exports = router;