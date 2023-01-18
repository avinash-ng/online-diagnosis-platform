const User = require("../models/user");

exports.findUserByEmail = (email:string) => {
    return User.find({ email: email })
    .exec()
}

exports.findUserById = (id: string) => {    
    return User.findOne({_id: id}).exec()
}