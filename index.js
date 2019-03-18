const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');

const admin = require('./routes/admin');
const index = require('./routes/index');

const app = express();

//Config session middlewares
app.use(session({secret: '@@NãoEXIStÉ-seguRaçajjk', resave: true, saveUninitialized: true}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.successMsg = req.flash('successMsg');
    res.locals.errorMsg = req.flash('errorMsg');
    next();
});

//Config others middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//Config main routes
app.use('/', index);
app.use('/admin', admin);

//view engine setup
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//connect to mongodb
mongoose.connect('mongodb://localhost:27017/blog', { useNewUrlParser: true}).then(() => {
    console.log('Connected to mongodb!');
}).catch((err) => {
    console.log('Error to connect with mongodb: ' + err);
});

app.listen(3000,() => {
    console.log('Server running at http://localhost:3000');
});