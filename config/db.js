const mongoose = require('mongoose');

const mongoURL = 'mongodb://localhost:27017/blog';
const options = {
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 5,
    useNewUrlParser: true
};

mongoose.set('useCreateIndex', true);

//connect to mongodb
mongoose.connect(mongoURL, options).then(() => {
    console.log('Connected to mongodb!');
}).catch((err) => {
    console.log('Error to connect with mongodb: ' + err);
});

mongoose.connection.on('error', (err) => {
    console.log('Error in mongodb connection: ' + err);
});

module.exports = mongoose;