const jwt = require("jsonwebtoken");
const { myKey } = require("../routes/loginRoute");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Authorization header is missing." });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token is missing or wrong." });
  }

  try {
    jwt.verify(token, myKey);
    next();
  } catch (error) {
    //catch and log any errors
    console.log("ERROR", error);
    res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = verifyToken;
