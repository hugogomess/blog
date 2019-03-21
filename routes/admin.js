const express = require('express');
const router = express.Router();
const {adminPermissionOnly} = require('../helpers/permission');
const category = require('./admin/category');
const post = require('./admin/post');

router.use('/postagens', post);
router.use('/categorias', category);

router.get('/', adminPermissionOnly, (req, res) =>{
    res.render('admin/index');
});

module.exports = router;