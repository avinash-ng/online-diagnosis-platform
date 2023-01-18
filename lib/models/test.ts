const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TestSchema = new Schema({
    name: String,
    description: String,
    cost: Number,
    requirements: [String],
    averageTime: {
        type: Number,
        description: "This is the average time of the test(in minutes)"
    }
})

module.exports = mongoose.model('Test', TestSchema);