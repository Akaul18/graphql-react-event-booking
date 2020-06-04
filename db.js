const mongoose = require('mongoose')

const startDb = () => {
    mongoose
        .connect('mongodb://localhost:27017/eventApp', {
            useNewUrlParser: true,
            keepAlive: 1,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log('mongodb successfull connected')
        })
    return mongoose.connection
        .on('error', console.error)
        .on('disconnected', startDb)
}

module.exports = startDb
