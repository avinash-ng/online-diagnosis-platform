"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DiagnosticCenter = require("../models/diagnostic-center");
exports.findCentersByLocation = (location) => {
    return DiagnosticCenter.find({
        location: {
            $near: {
                $geometry: location,
                $maxDistance: 1000,
                $minDistance: 0
            }
        }
    }).exec();
};
