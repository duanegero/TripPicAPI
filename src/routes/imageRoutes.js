require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
//importing required npms to use in app
const express = require("express");
const { S3 } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

//creating a variable to handle express
const router = express.Router();

//importing helper functions to use in app
const { postNewImage } = require("../helper/postHelpers");
const { getImageDetails } = require("../helper/getHelpers");

//creating a new S3 with the keys and region from env
const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

//confing middleware multer to upload files to AWS S3
const upload = multer({
  storage: multerS3({
    //storage engine to save directly to S3
    s3: s3, //S3 created above
    bucket: process.env.S3_BUCKET_NAME, //bucket name from env
    // acl: "public-read", //make the file public accessible
    metadata: (req, file, cb) => {
      //add metadat to the file
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      //sets the file name in S3
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});

//defining a route to post to S3 bucket
router.post("/", upload.single("image"), async (req, res) => {
  //checks if the file has been uploaded
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  //creating varibles to handle image data
  const imageUrl = req.file.location;
  const { name, user_id } = req.body;

  try {
    //create variable to handle call of helper function
    const newImage = await postNewImage(imageUrl, name, user_id);

    //if no new image returned return error status
    if (!newImage) {
      return res.status(400).json({ message: "Failed post new image." });
    }

    //return success status with data
    res.status(201).json({
      message: "File Uploaded",
      imageUrl: newImage.s3_url,
      imageId: newImage.id,
      createdAt: newImage.created_at,
      userId: newImage.user_id,
    });
  } catch (error) {
    //catch, log and return if any errors
    console.error("Error saving to database", error);
    res.status(500).json({ error: "Fild to save URL to database" });
  }
});

//defining a route to get from S3 bucket
router.get("/:key", async (req, res) => {
  //getting file name from URL
  const fileKey = req.params.key;

  //creating an object to send to S3 bucket
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
  };

  try {
    await s3.headObject(params); //check if the object exists in S3

    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    const imageDetails = await getImageDetails(imageUrl);

    res
      .status(200)
      .json({
        imageUrl: imageUrl,
        name: imageDetails.name,
        userId: imageDetails.user_id,
      }); //send the inage Url as a response
  } catch (error) {
    //catch and log errors with status code
    console.error("Error fetching images from S3", error);
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

module.exports = router;
