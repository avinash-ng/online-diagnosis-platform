import express from "express";
import { IUser } from "../interfaces/user";

const bcrypt = require("bcrypt");

const User = require("../models/user");
const { findUserByEmail } = require("../services/user");

const router = express.Router();

const jwt = require("jsonwebtoken");

router.get("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(200).json([]);
});

router.post("/signup", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  findUserByEmail(req.body.email.toString())
    .then((users: IUser[]) => {
      if (users.length >= 1) {
        return res.status(409).send("Mail already in use");
      } else {
        bcrypt.hash(req.body.password.toString(), 10, (err: any, hash: any) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user:IUser = {
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
              .then((doc: IUser) => res.status(200).json(doc))
              .catch((err: any) => res.status(500).json({ error: err }));
          }
        });
      }
    });
});

router.post("/login", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  User.findOne({
    email: req.body.email.toString(),
  })
    .exec()
    .then((user: IUser) => {
      if (!user) {
        return res.status(404).json({
          error: "User not found",
        });
      } else {
        bcrypt.compare(req.body.password.toString(), user.password, (err: any, result: any) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          }
          if (!result) {
            res.status(404).send({
              message: "Wrong Password"
            })
          }
          const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
          }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
          return res.status(200).json({
            token: token,
            userId: user._id?.toString()
          });
        });
      }
    })
    .catch((error: any) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      res.status(error.statusCode).send({
        message: error.message
      })
    });
});

router.get("/getDetails", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(200).send({
    message: "User details fetched successfully"
  });

});

exports.routes = router;
