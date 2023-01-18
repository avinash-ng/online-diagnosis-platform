"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { createTest } = require("../services/test");
router.post("/", (req, res, next) => {
    // if request is fine
    createTest(req.body)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(500).send({
        message: err.message,
    }));
});
exports.routes = router;
