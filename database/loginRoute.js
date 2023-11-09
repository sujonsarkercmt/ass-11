const mongoose = require('mongoose');

const connectToDatabase = async () => {


    let mywork = new mongoose.Schema({
 
        date: Date,
        area: String,
        serviceState: String,

        OriginalService: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service'
        },
        serviceBookedby: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'login'
        },
        serviceProvideBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'login'
        },
        trackID: String,
    })


    let mybookedService = new mongoose.Schema({

        date: Date,
        area: String,
        serviceState: String,

        OriginalService: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service'
        },
        serviceBookedby: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'login'
        },
        serviceProvideBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'login'
        }, 
        trackID: String,
    })


    // cutomer schema 
    let loginsch = new mongoose.Schema({
        username: String,
        password: String,
        email: String,
        imageURL: String,
        Services: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service'
        }],
        myBookService: [mybookedService],
        myWork: [mywork],
    });

    let login = mongoose.model('login', loginsch);
    global.login = login


}

module.exports = {
    connectToDatabase,
};