import express from "express";
import { IDiagnosticCenter } from "../interfaces/diagnostic-center";

const DiagnosticCenter = require("../models/diagnostic-center");
const Test = require("../models/test");
const userService = require("../services/user");
const testService = require("../services/test");
const { checkForAuth } = require("../middlewares/auth");
const { findCentersByLocation } = require("../services/diagnostic-center")

const router = express.Router();


router.get("/", async (_, res: express.Response) => {
  try {
    const centers: IDiagnosticCenter[] = await DiagnosticCenter.find({});
    res.status(200).json(centers);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

router.post("/register", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const diagnosticCenter: IDiagnosticCenter = {
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
    country: req.body.country.toString(),
  }
  try {
    const doc = await new DiagnosticCenter(diagnosticCenter).save();
    res.status(200).json(doc);
  } catch (error: any) {
    res.status(200).json({
      message: error.message,
    });
  }
});

router.get("/search", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const testName = req.query.test?.toString();
  try {
    const testIds = await testService.findByName(testName);
    const centers: IDiagnosticCenter[] = await DiagnosticCenter.find({ tests: { $all: testIds } });
    if (centers.length > 0) {
      res.status(200).json(centers);
    } else {
      res.status(404).json({
        message: "Center not found",
      });
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

router.post("/addTestToCenter", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  DiagnosticCenter.findById(req.body.centerId)
    .then((center: any) => {
      Test.findById(req.body.testId)
        .then((test: any) => {
          center.tests.push(test);
          center
            .save()
            .then((updatedCenter: any) => res.status(201).json(updatedCenter))
            .catch((err: any) =>
              res.status(500).send({
                message: err.message,
              })
            );
        })
        .catch((err: any) => res.status(500).send(err.message));
    })
    .catch((err: any) => {
      res.status(500).send(err.message);
    });
});

router.get("/show-near-centers", checkForAuth, (req: any, res: express.Response, next: express.NextFunction) => {
  if (!req.userId) {
    return res.status(404).send({
      message: "Missing user id "
    })
  }
  userService.findUserById(req.userId).then((user: any) => {
    findCentersByLocation(user.location)
      .then((centers: any) => res.status(200).json(centers))
      .catch((err: any) => {
        res.status(404).send({
          message: "Diagnostic centers not found : " + err.message
        })
      })
  }).catch((err: any) => {
    res.status(404).send({
      message: "User not found : " + err.message
    })
  })
});

router.get("/slots", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log("FETCHED AVAILABLE SLOTS SUCCESFULLY");
});

router.post("/book", checkForAuth, (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log("APPOINTMENT BOOKED SUCCESSFULLY : " + req);
});

router.delete("/cancel", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log("APPINTMENT CANCELLED SUCCESFULLY");
});

exports.routes = router;
