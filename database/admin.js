const mongoose = require('mongoose');

const connectToDatabase = async () => {

     
 


    // //userpermissions
    // let Permissionsch = new mongoose.Schema({
    //     userID: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'login'
    //     },
    //     removeUser: Boolean,
    //     message: Boolean,
    //     updateUser: Boolean,
    //     userCreate: {
    //         type: Boolean,
    //         default:false,
    //     },
    // });

    // let Permission = mongoose.model('Permission', Permissionsch);
    // global.Permission = Permission


}

module.exports = {
    connectToDatabase,
};