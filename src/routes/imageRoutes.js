require("dotenv").config();
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
const { deleteImage } = require("../helper/deleteHelpers");

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

    //creating a varible to handle image URL
    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    //creating a varible to handle call to helper function
    const imageDetails = await getImageDetails(imageUrl);

    //return ok status with image info
    res.status(200).json({
      imageUrl: imageUrl,
      name: imageDetails.name,
      userId: imageDetails.user_id,
    });
  } catch (error) {
    //catch and log errors with status code
    console.error("Error fetching images from S3", error);
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

//defining a route to delete from S3 bucket
router.delete("/:key", async (req, res) => {
  //getting file name from URL
  const fileKey = req.params.key;

  //if no filekey return errors status and message
  if (!fileKey) {
    return res.status(400).json({ error: "No file key provided." });
  }

  //creating an object to send to S3 bucket
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
  };

  try {
    //sending delete object to S3 bucket
    await s3.deleteObject(params);

    //creating a variable to hand the URL of image
    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    //calling helper function and passing in the image url
    const deleteImageDetails = await deleteImage(imageUrl);

    //return ok status with json
    res.status(200).json({
      message: "Image deleted successfully",
      imageUrl: fileKey,
      deleteImageDetails,
    });
  } catch (error) {
    //catch if any errors, log and throw status
    console.error("Error deleting image from S3", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

module.exports = router;
