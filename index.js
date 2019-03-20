const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const db = require('./db');
const passport = require('passport');
require('./config/auth')(passport);

const admin = require('./routes/admin');
const index = require('./routes/index');
const user = require('./routes/user');

const app = express();

//Config middlewares
app.use(session({secret: '@@NãoEXIStÉ-seguRaçajjk', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.successMsg = req.flash('successMsg');
    res.locals.errorMsg = req.flash('errorMsg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//Config main routes
app.use('/', index);
app.use('/admin', admin);
app.use('/', user);

//view engine setup
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.listen(3000,() => {
    console.log('Server running at http://localhost:3000');
});