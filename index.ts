require("dotenv").config();

import express from "express";

import bodyParser from "body-parser";
import { connect } from "mongoose";
import helmet from "helmet";

const app = express();
const PORT = process.argv[2] || process.env.PORT || 4000;

const userRoutes = require("./lib/routes/user");
const diagnosticsRoutes = require("./lib/routes/diagnostic-center");
const testRoutes = require("./lib/routes/test");

app.use(bodyParser.json());
app.use(helmet.hidePoweredBy())
app.use(helmet());

app.use("/user", userRoutes.routes);
app.use("/diagnostic", diagnosticsRoutes.routes);
app.use("/test", testRoutes.routes);

app.get("/", (_, res: express.Response) => {
  res.status(200).send(`API is running fine on ${PORT}`);
});

app.all("*", (_, res: express.Response) => {
  res.status(404).send("<h1>Page Not found</h1>");
});

const setUpDB = async () => {
  let connectionString = process.env.MONGO_ATLAS_URL;
  if (!connectionString) {
    throw new Error("MONGO_ATLAS_URL environment variable not set");
  }
  console.log("Setting up database");
  connectionString = connectionString.replace(
    "<password>",
    process.env.MONGO_ATLAS_PASSWORD ?? ""
  );
  try {
    await connect(connectionString);
  } catch (error: any) {
    throw new Error(error.message);
  }
  console.log("APPLICATION STARTED RUNNING ON " + PORT);
  
};

app.listen(PORT, setUpDB);
