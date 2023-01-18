const jwt = require("jsonwebtoken");

exports.checkForAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(401).send({
      message: "Missing authorization header",
    });
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    return res.status(401).send({
      message: err.message,
    });
  }

  if (!decodedToken) {
    return res.status(401).send({
      message: "Token is invalid",
    });
  }
  req.userId = decodedToken.id;
  next();
};
