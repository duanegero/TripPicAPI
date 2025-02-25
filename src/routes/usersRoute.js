require("dotenv").config();
//importing required npms to use in app
const express = require("express");

//creating a variable to handle express
const router = express.Router();

//importing helper functions
const { postNewUser } = require("../helper/postHelpers");
const { deleteUser } = require("../helper/deleteHelpers");
const { updateUser } = require("../helper/putHelpers");
const { getUserDetials } = require("../helper/getHelpers");

const verifyToken = require("../middleware/token");

router.get("/:id", verifyToken, async (req, res) => {
  //getting user ID from URL
  const userId = req.params.id;

  try {
    //variable to handle helper function call with passed in variable
    const result = await getUserDetials(userId);

    //return ok status with result
    res.status(200).json(result);
  } catch (error) {
    //catch and log if any errors
    console.error(
      "Error occurred while fetching user details.",
      error.message,
      error.stack
    );

    //return error status with json messgae
    res.status(500).json({
      message: "An error occurred while fetching user details.",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  //creating variables to handle data from body
  const { first_name, last_name, email, password } = req.body;

  //if all feilds not fun return error
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: "Need all fields to create user." });
  }

  try {
    //create variable to handle helper function pass in variables
    const newUser = await postNewUser(first_name, last_name, email, password);

    //if nothing returned return error status message
    if (!newUser) {
      return res.status(400).json({ message: "Failed to create new user." });
    }

    //return success status message and new user
    res.status(201).json({
      message: "User Created",
      newUser,
    });
  } catch (error) {
    //catch if error and return status message
    console.error("Error creating new user.", error);
    res.status(500).json({ error: "Failed to create new user." });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  //get ID from URL
  const userId = req.params.id;

  //creating variables to handle data from body
  const { first_name, last_name, email, password } = req.body;

  //return error if no ID
  if (!userId) {
    return res.status(400).json({ message: "User ID is required " });
  }
  //if all feilds not fun return error
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: "Need all fields to create user." });
  }

  try {
    const updatedUser = await updateUser(
      userId,
      first_name,
      last_name,
      email,
      password
    );

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update user." });
    }
    res.status(200).json({ message: "Updated user", updatedUser });
  } catch (error) {
    console.error("Error occurred while updating user.", error);
    res.status(500).json({ error: "Error occurred while updating user" });
  }
});

router.delete("/:id", async (req, res) => {
  //get ID from URL
  const userId = req.params.id;

  //return error if no ID
  if (!userId) {
    return res.status(400).json({ message: "User ID is required " });
  }

  try {
    //variable to handle helper function
    const deletedUserDetails = await deleteUser(userId);

    //success status and message
    res.status(200).json({
      message: "User deleted successfully",
      deletedUserDetails,
    });
  } catch (error) {
    //error message and status
    console.error("Error occurred while deleting user.", error);
    res.status(500).json({ error: "Failed to delete user from database." });
  }
});

module.exports = router;
