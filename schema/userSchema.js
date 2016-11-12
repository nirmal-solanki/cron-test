var mongoose = require("mongoose");

var mongoSchema = mongoose.Schema;
var userSchema = {
    "email": String,
    "password": String
};
module.exports = mongoose.model('userLogin', userSchema);