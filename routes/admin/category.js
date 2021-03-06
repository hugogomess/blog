const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { adminPermissionOnly } = require('../../helpers/permission');
const { check, validationResult } = require('express-validator/check');


require('../../models/Category');
const Category = mongoose.model('Category');

router.get('/', adminPermissionOnly, async (req, res) => {
    try {
        const categories = await Category.find().sort({ date: 'desc' });
        return res.render('admin/category', { categories });
    } catch (err) {
        req.flash('errorMsg', 'Ocorreu um erro ao listar as categorias, tente novamente mais tarde!');
        return res.redirect('admin/categorias');
    }
});

router.post('/nova', adminPermissionOnly, [
    check('name').isEmail(),
    check('slug').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    const { name, slug } = req.body;

    if (!errors.isEmpty()) {
        var err = '';
        for (error of errors.array()) {
            err += error.msg;
        }

        console.log(errors.array());
        req.flash('errorMsg', ' ' + err);
        return res.redirect('/admin/categorias');

    } else {
        const category = {
            name,
            slug
        };

        try {
            await new Category(category).save();
            req.flash('successMsg', 'A categoria ' + category.name + ' foi criada com sucesso!');
            return res.redirect('/admin/categorias');
        } catch (err) {
            req.flash('errorMsg', 'Ocorreu um erro ao tentar criar uma nova categoria, tente novamente mais tarde!');
            return res.redirect('/admin/categorias');
        }
    }
});

router.post('/editar', adminPermissionOnly, async (req, res) => {
    var errors = [];

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        errors.push({ message: 'Nome ínvalido! ' });
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        errors.push({ message: 'Slug ínvalido! ' });
    }

    if (errors.length > 0) {
        var error = '';
        for (var i = 0; i < errors.length; i++) {
            error += errors[i].message;
        }

        req.flash('errorMsg', error);
        res.redirect('/admin/categorias');

    } else {
        await Category.findOne({ _id: req.body.id }).then(async (category) => {
            category.name = req.body.name;
            category.slug = req.body.slug;

            await category.save().then(() => {
                req.flash('successMsg', 'A categoria ' + category.name + ' foi atualizada com sucesso!');
                res.redirect('/admin/categorias');
            }).catch((err) => {
                req.flash('errorMsg', 'Ocorreu um erro ao tentar atualizar , tente novamente mais tarde!');
                res.redirect('/admin/categorias');
            });
        }).catch((err) => {
            req.flash('errorMsg', 'Ocorreu um erro, tente novamente mais tarde!');
            res.redirect('/admin/categorias');
        });
    }
});

router.post('/excluir', adminPermissionOnly, async (req, res) => {
    await Category.deleteOne({ _id: req.body.id }).then(() => {
        req.flash('successMsg', 'A categoria ' + req.body.name + ' foi excluida com sucesso!');
        res.redirect('/admin/categorias');
    }).catch((err) => {
        req.flash('errorMsg', 'Ocorreu um erro, tente novamente mais tarde!');
        res.redirect('/admin/categorias');
    });
});

module.exports = router;
