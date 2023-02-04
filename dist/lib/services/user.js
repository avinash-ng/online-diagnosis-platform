"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User = require("../models/user");
exports.findUserByEmail = (email) => {
    return User.find({ email: email })
        .exec();
};
exports.findUserById = (id) => {
    return User.findOne({ _id: id }).exec();
};
