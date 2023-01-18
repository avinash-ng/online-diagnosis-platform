"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DiagnosticCenter = require("../models/diagnosticCenter");
const Test = require("../models/test");
const { findUserById } = require("../services/user");
const { checkForAuth } = require("../middlewares/auth");
const { findCentersByLocation } = require("../services/diagnosticCenter");
const router = express_1.default.Router();
router.get("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const centers = yield DiagnosticCenter.find({});
        res.status(200).json(centers);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
router.post("/register", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const diagnosticCenter = new DiagnosticCenter({
        name: req.body.name.toString(),
        tests: req.body.tests,
        state: req.body.state.toString(),
        phone: req.body.phone.toString(),
        landmark: req.body.landmark.toString(),
        street: req.body.street.toString(),
        location: {
            type: "Point",
            coordinates: req.body.location
        },
        technician: req.body.technician.toString(),
    });
    try {
        const doc = yield diagnosticCenter.save();
        res.status(200).json(doc);
    }
    catch (error) {
        res.status(200).json({
            message: error.message,
        });
    }
}));
router.get("/search", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const testName = (_a = req.query.test) === null || _a === void 0 ? void 0 : _a.toString();
    try {
        const centers = yield DiagnosticCenter.find({ tests: testName });
        if (centers.length > 0) {
            res.status(200).json(centers);
        }
        else {
            res.status(404).json({
                message: "Center not found",
            });
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
router.post("/addTestToCenter", (req, res, next) => {
    DiagnosticCenter.findById(req.body.centerId)
        .then((center) => {
        console.log("Center : " + center);
        Test.findById(req.body.testId)
            .then((test) => {
            center.tests.push(test);
            center
                .save()
                .then((updatedCenter) => res.status(201).json(updatedCenter))
                .catch((err) => res.status(500).send({
                message: "Failed to update test",
            }));
        })
            .catch((err) => res.status(500).send(err.message));
    })
        .catch((err) => {
        res.status(500).send(err.message);
    });
});
router.get("/show-near-centers", checkForAuth, (req, res, next) => {
    if (!req.userId) {
        return res.status(404).send({
            message: "Missing user id "
        });
    }
    findUserById(req.userId).then((user) => {
        findCentersByLocation(user.location)
            .then((centers) => res.status(200).json(centers))
            .catch((err) => {
            res.status(404).send({
                message: "Diagnostic centers not found : " + err.message
            });
        });
    }).catch((err) => {
        res.status(404).send({
            message: "User not found : " + err.message
        });
    });
});
router.get("/slots", (req, res, next) => {
    console.log("FETCHED AVAILABLE SLOTS SUCCESFULLY");
});
router.post("/book", checkForAuth, (req, res, next) => {
    console.log("APPOINTMENT BOOKED SUCCESSFULLY : " + req);
});
router.delete("/cancel", (req, res, next) => {
    console.log("APPINTMENT CANCELLED SUCCESFULLY");
});
exports.routes = router;
