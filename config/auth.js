const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

require('../models/User');
const User = mongoose.model('User');

module.exports = (passport) => {
    
    passport.use(new localStrategy({usernameField: 'username', passwordField: 'password'}, (username, password, done) => {

        User.findOne({username: username}).then((user) => {
            if(!user){
                return done(null, false, {message: 'Esse usuario não existe!'});
            } else {
                bcrypt.compare(password, user.password, (error, equals) => {
                    if(equals){
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'Senha incorreta!'});
                    }
                })
            }
        })
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id)
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        })
    })
}