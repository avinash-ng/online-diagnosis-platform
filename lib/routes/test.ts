import express from "express";
const router = express.Router();
const { createTest } = require("../services/test");

router.post("/", (req:express.Request, res:express.Response, next:express.NextFunction) => {
  // if request is fine
  createTest(req.body)
    .then((doc:any) => res.status(200).json(doc))
    .catch((err:any) =>
      res.status(500).send({
        message: err.message,
      })
    );
});

exports.routes = router;
