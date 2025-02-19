const express = require("express");
//creating a variable to handle express
const router = express.Router();

const { postNewRequest } = require("../helper/postHelpers");

router.post("/", async (req, res) => {
  const { request, userId } = req.body;

  if (!request || !userId) {
    return res
      .status(400)
      .json({ error: "Need a request and user ID to proceed" });
  }

  try {
    const newRequest = await postNewRequest(request, userId);

    if (!newRequest) {
      return res.status(400).json({ message: "Failed to create new request." });
    }

    res.status(201).json({
      message: "Request Created.",
      newRequest,
    });
  } catch (error) {
    console.error("Error creating new request.", error);
    res.status(500).json({ error: "Failed to create new request." });
  }
});

module.exports = router;
