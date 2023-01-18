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
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = require("mongoose");
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
const PORT = process.argv[2] || process.env.PORT || 4000;
const userRoutes = require("./lib/routes/user");
const diagnosticsRoutes = require("./lib/routes/diagnostic-center");
const testRoutes = require("./lib/routes/test");
app.use(body_parser_1.default.json());
app.use(helmet_1.default.hidePoweredBy());
app.use((0, helmet_1.default)());
app.use("/user", userRoutes.routes);
app.use("/diagnostic", diagnosticsRoutes.routes);
app.use("/test", testRoutes.routes);
app.get("/", (_, res) => {
    res.status(200).send(`API is running fine on ${PORT}`);
});
app.all("*", (_, res) => {
    res.status(404).send("<h1>Page Not found</h1>");
});
const setUpDB = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let connectionString = process.env.MONGO_ATLAS_URL;
    if (!connectionString) {
        throw new Error("MONGO_ATLAS_URL environment variable not set");
    }
    console.log("Setting up database");
    connectionString = connectionString.replace("<password>", (_a = process.env.MONGO_ATLAS_PASSWORD) !== null && _a !== void 0 ? _a : "");
    try {
        yield (0, mongoose_1.connect)(connectionString);
    }
    catch (error) {
        throw new Error(error.message);
    }
    console.log("APPLICATION STARTED RUNNING ON " + PORT);
});
app.listen(PORT, setUpDB);
