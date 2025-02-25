//requiring prisma to sen queries to database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//defining async function
const getImageDetails = async (imageUrl) => {
  try {
    //creating a varible to handle prisma query
    const imageDetails = await prisma.images.findUnique({
      where: {
        s3_url: imageUrl,
      },
    });
    //if nothing found log message
    if (!imageDetails) {
      console.log("No image found for URL:", imageUrl);
    }
    //return found results to use in app
    return imageDetails;
  } catch (error) {
    //catch and log any errors if found
    console.error("Error fetching image data from database.", error);
    throw error;
  }
};

const getAllUserImages = async (userId) => {
  //converting user Id into an INT
  const userIdInt = parseInt(userId, 10);
  try {
    //varible to handle prisma query
    const userImages = await prisma.images.findMany({
      where: {
        user_id: userIdInt,
      },
      select: {
        s3_url: true,
        name: true,
        created_at: true,
        id: true,
      },
    });

    //if nothing found return error
    if (!userImages) {
      console.log("No images found for user:", userId);
    }

    //return results to use else where
    return userImages;
  } catch (error) {
    //catch and log any errors if found
    console.error("Error fetching image data from database.", error);
    throw error;
  }
};

const getUserDetials = async (userId) => {
  const userIdInt = parseInt(userId, 10);

  try {
    const userDetails = await prisma.users.findUnique({
      where: { id: userIdInt },
    });

    if (!userDetails) {
      console.log("No user found.");
    }

    return userDetails;
  } catch (error) {
    console.error("Error occurred fetch user details.", error);
    throw error;
  }
};

//export function to use else where in app
module.exports = {
  getImageDetails,
  getAllUserImages,
  getUserDetials,
};
