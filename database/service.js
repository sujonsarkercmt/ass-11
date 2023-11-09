const mongoose = require('mongoose');

const connectToDatabase = async () => {
    // cutomer schema 
    let ServiceSch = new mongoose.Schema({
        imageURL: String,
        serviceName: String,
        yourName: String,
        yourEmail: String,
        serviceArea: String,
        Price: String,
        description: String,
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'login'
        },
        createdAt: {
            type: 'Date',
            default:new Date,
        }
    });

    let Service = mongoose.model('Service', ServiceSch);
    global.Service = Service
}

module.exports = {
    connectToDatabase,
}; 