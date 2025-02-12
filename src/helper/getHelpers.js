const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getImageDetails = async (imageUrl) => {
  try {
    console.log("Searching for image with URL:", imageUrl);

    const imageDetails = await prisma.images.findUnique({
      where: {
        s3_url: imageUrl,
      },
    });
    if (!imageDetails) {
      console.log("No image found for URL:", imageUrl);
    }
    return imageDetails;
  } catch (error) {
    console.error("Error fetching image data from database.", error);
    throw error;
  }
};

module.exports = {
  getImageDetails,
};
