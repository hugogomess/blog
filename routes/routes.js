const express = require('express');
const router = express.Router();

const admin = require('./admin');
const index = require('./index');
const user = require('./user');
const post = require('./post');
const category = require('./category');

//Config main routes
router.use('/admin', admin);
router.use('/', index);
router.use('/user', user);
router.use('/postagens', post);
router.use('/categorias', category);

module.exports = router;