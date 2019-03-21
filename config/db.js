const mongoose = require('mongoose');

//connect to mongodb
mongoose.connect('mongodb://localhost:27017/blog', { useNewUrlParser: true}).then(() => {
    console.log('Connected to mongodb!');
}).catch((err) => {
    console.log('Error to connect with mongodb: ' + err);
});

module.exports = mongoose;