"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BookingSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    center: {
        type: Schema.Types.ObjectId,
        ref: 'DiagnosticCenter',
        required: true
    },
    tests: {
        type: [Schema.Types.ObjectId],
        ref: 'Test',
        required: true
    },
    onDate: Date,
    patientName: {
        type: String,
        required: true
    },
    patientDetails: {
        type: String,
        required: true,
    }
});
module.exports = mongoose.model('Booking', BookingSchema);
