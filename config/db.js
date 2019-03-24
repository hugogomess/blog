const mongoose = require('mongoose');

var mongoURI;

if (process.env.NODE_ENV == 'production'){
    mongoURI = 'mongodb+srv://12345:12345@blogapp-prod-cua5t.mongodb.net/test?retryWrites=true';
} else {
    mongoURI = 'mongodb://localhost:27017/blog';
}

//connect to mongodb
mongoose.connect(mongoURI, { useNewUrlParser: true}).then(() => {
    console.log('Connected to mongodb!');
}).catch((err) => {
    console.log('Error to connect with mongodb: ' + err);
});

module.exports = mongoose;