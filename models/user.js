var mongoose = require('mongoose');
// create schema
var userSchema  = mongoose.Schema({
    "username" : String,
    "password" : String
},{
    timestamps: true
});
// create model if not exists.
module.exports = mongoose.model('User',userSchema);

