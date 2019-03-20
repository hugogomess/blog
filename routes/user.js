const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

require('../models/User');
const User = mongoose.model('User');

router.get('/cadastro',(req, res) => {
    res.render('user/singup');
});

router.post('/cadastro',(req, res) => {
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
                req.flash('errorMsg', 'Esse nome de usuário já existe!');
                res.redirect('/cadastro');
            } else {
                User.findOne({email: req.body.email.toLowerCase()}).then((user) => {

                    if (user){
                        req.flash('errorMsg', 'Já existe uma conta com esse email!');
                        res.redirect('/cadastro');
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
                                    res.redirect('/cadastro');
                                } else {
                                    newUser.password = hash;
                                    newUser.save().then(() => {
                                        req.flash('successMsg', 'Conta criada com sucesso!');
                                        res.redirect('/entrar');
                                    }).catch((err) => {
                                        req.flash('errorMsg', 'Ocorreu um erro interno!');
                                        res.redirect('/cadastro');
                                    })
                                }
                            })
                        }).catch((err) => {
                            req.flash('errorMsg', 'Ocorreu um erro interno!');
                            res.redirect('/cadastro');
                        })
                    }
                })
            }

        }).catch((err) => {
            req.flash('errorMsg', 'Ocorreu um erro interno!');
            res.redirect('/cadastro');
        })
    }

    
});

router.get('/entrar', (req, res) => {
    res.render('user/login');
})

router.post('/entrar', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/entrar',
        failureFlash: true
    })(req, res, next);
})

module.exports = router;