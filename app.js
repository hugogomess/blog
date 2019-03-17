const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const admin = require('./routes/admin');
const index = require('./routes/index');

const app = express();

//view engine setup
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Config dependencies
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//connect to mongodb
mongoose.connect('mongodb://localhost:27017/blog', { useNewUrlParser: true}).then(() => {
    console.log('connected to mongodb');
}).catch((err) => {
    console.log('error to connect with mongodb: ' + err);
});

//Config main routes
app.use('/', index);
app.use('/admin', admin);

app.listen(3000,() => {
    console.log('Server running...');
});