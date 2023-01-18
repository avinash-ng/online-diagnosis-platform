const DiagnosticCenter = require("../models/diagnostic-center");

exports.findCentersByLocation = (location: any) => {    
    return DiagnosticCenter.find({
        location: {
            $near: {
                $geometry: location,
                $maxDistance: 1000,
                $minDistance: 0
            }
        }
    }).exec()
}