const express = require("express");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { checkCredentials } = require("../helper/checkCredentials");

//importing the key from the .env file
const myKey = process.env.API_KEY;
console.log(myKey);

//post request to login
router.post("/", async (req, res) => {
  //vaiables to handle email and password from body
  const { email, password } = req.body;
  //log for testing
  console.log(email, password);

  //if not email or pass return error
  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    //variable to handle helper function
    const checkUser = await checkCredentials(email, password);

    //if nothing returned return error json
    if (!checkUser) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    //variable to handle user ID
    const userId = checkUser.id;
    //log for testing
    console.log(userId);
    //creating payload with user ID
    const payload = { userId: userId };

    //creating token
    const token = jwt.sign(payload, myKey);

    //return json with token and user ID
    return res.json({ token, userId });
  } catch (error) {
    //catch and log if any errors
    console.error("Error occurred during login", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//export router and key to use else where
module.exports = router;
module.exports.myKey = myKey;
