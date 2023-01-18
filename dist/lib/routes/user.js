"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { findUserByEmail } = require("../services/user");
const router = express_1.default.Router();
const jwt = require("jsonwebtoken");
router.get("/", (req, res, next) => {
    res.status(200).json([]);
});
router.post("/signup", (req, res, next) => {
    findUserByEmail(req.body.email.toString())
        .then((users) => {
        if (users.length >= 1) {
            return res.status(409).send("Mail already in use");
        }
        else {
            bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err,
                    });
                }
                else {
                    const user = {
                        name: req.body.name.toString(),
                        email: req.body.email.toString(),
                        password: hash,
                        phone: req.body.phone.toString(),
                        country: req.body.country.toString(),
                        state: req.body.state.toString(),
                        landmark: req.body.landmark.toString(),
                        street: req.body.street.toString(),
                        location: {
                            type: "Point",
                            coordinates: req.body.location
                        }
                    };
                    new User(user)
                        .save()
                        .then((doc) => res.status(200).json(doc))
                        .catch((err) => res.status(500).json({ error: err }));
                }
            });
        }
    });
});
router.post("/login", (req, res, next) => {
    User.findOne({
        email: req.body.email.toString(),
    })
        .exec()
        .then((user) => {
        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }
        else {
            bcrypt.compare(req.body.password.toString(), user.password, (err, result) => {
                var _a;
                if (err) {
                    return res.status(500).json({
                        error: err,
                    });
                }
                if (!result) {
                    res.status(404).send({
                        message: "Wrong Password"
                    });
                }
                const token = jwt.sign({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
                return res.status(200).json({
                    token: token,
                    userId: (_a = user._id) === null || _a === void 0 ? void 0 : _a.toString()
                });
            });
        }
    })
        .catch((error) => {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
router.get("/getDetails", (req, res, next) => {
    res.status(200).send({
        message: "User details fetched successfully"
    });
});
exports.routes = router;
