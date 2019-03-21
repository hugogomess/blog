const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {visitorPermissionOnly, loggedPermissionOnly} = require('../helpers/permission');

require('../models/User');
const User = mongoose.model('User');

router.get('/cadastro', visitorPermissionOnly, (req, res) => {
    res.render('user/singup');
});

router.post('/cadastro', visitorPermissionOnly, (req, res) => {
    var errors = [];

    if (!req.body.username || typeof req.body.username == undefined || req.body.username == null){
        errors.push({message: 'O nome de usuário não pode ficar vazio!'})
    };

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        errors.push({message: 'O email não pode ficar vazio!'})
    };

    if (!req.body.password || typeof req.body.password == undefined || req.body.password == null){
        errors.push({message: 'A senha não pode ficar vazio!'})
    } else if (req.body.password.length < 12) {
        errors.push({message: 'Senha muito curta!'})
    } else if (req.body.password != req.body.passwordValidate) {
        errors.push({message: 'As senhas não são iguais!'})
    };

    if (errors.length > 0){
        res.render('user/singup', {errors: errors});
    } else {
        User.findOne({username: req.body.username.toLowerCase()}).then((user) => {

            if (user){
                errors.push({message: 'Esse nome de usuário já existe!'});
                res.render('user/singup', {errors: errors, user: req.body});
            } else {
                User.findOne({email: req.body.email.toLowerCase()}).then((user) => {

                    if (user){
                        req.flash('errorMsg', 'Já existe uma conta com esse email!');
                        res.redirect('/user/cadastro');
                    } else {
                        const newUser = new User({
                            username: req.body.username.toLowerCase(),
                            email: req.body.email.toLowerCase(),
                            password: req.body.password
                        })

                        bcrypt.genSalt(10, (error, salt) => {
                            bcrypt.hash(newUser.password, salt, (error, hash) => {

                                if (error){
                                    req.flash('errorMsg', 'Ocorreu um erro interno!');
                                    res.redirect('/user/cadastro');
                                } else {
                                    newUser.password = hash;
                                    newUser.save().then(() => {
                                        req.flash('successMsg', 'Conta criada com sucesso!');
                                        res.redirect('/user/entrar');
                                    }).catch((err) => {
                                        req.flash('errorMsg', 'Ocorreu um erro interno!');
                                        res.redirect('/user/cadastro');
                                    })
                                }
                            })
                        }).catch((err) => {
                            req.flash('errorMsg', 'Ocorreu um erro interno!');
                            res.redirect('/user/cadastro');
                        })
                    }
                })
            }

        }).catch((err) => {
            req.flash('errorMsg', 'Ocorreu um erro interno!');
            res.redirect('/user/cadastro');
        })
    }

    
});

router.get('/entrar', visitorPermissionOnly, (req, res) => {
    res.render('user/login');
})

router.post('/entrar', visitorPermissionOnly, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/entrar',
        failureFlash: true
    })(req, res, next);
})

router.get('/sair', loggedPermissionOnly, (req, res) => {
    req.logout();
    req.flash('successMsg', 'Deslogado com sucesso!');
    res.redirect('/');
})

module.exports = router;