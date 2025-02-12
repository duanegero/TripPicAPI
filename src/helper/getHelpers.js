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

//export function to use else where in app
module.exports = {
  getImageDetails,
};
