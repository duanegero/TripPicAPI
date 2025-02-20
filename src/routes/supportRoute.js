const express = require("express");
//creating a variable to handle express
const router = express.Router();

//import helper functions
const { postNewRequest } = require("../helper/postHelpers");

//defining a route for post
router.post("/", async (req, res) => {
  //variable to res=quest and user ID from the body
  const { request, userId } = req.body;

  //if both aren't in body return error status
  if (!request || !userId) {
    return res
      .status(400)
      .json({ error: "Need a request and user ID to proceed" });
  }

  try {
    //variable to handle helper with passed in variables
    const newRequest = await postNewRequest(request, userId);

    //if helper returns noth return error status
    if (!newRequest) {
      return res.status(400).json({ message: "Failed to create new request." });
    }

    //return success status with json and result
    res.status(201).json({
      message: "Request Created.",
      newRequest,
    });
  } catch (error) {
    //catch if any errors, log and return error status
    console.error("Error creating new request.", error);
    res.status(500).json({ error: "Failed to create new request." });
  }
});

module.exports = router;
