const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//defining a async function with passed in variables
const postNewImage = async (imageUrl, name, user_id) => {
  try {
    const userIdInt = parseInt(user_id, 10);

    //create variable to handle prisma request, with passed in data
    const image = await prisma.images.create({
      data: {
        name: name || "Untitled Image",
        s3_url: imageUrl,
        user_id: userIdInt || null,
      },
    });
    //return image to use in app
    return image;
  } catch (error) {
    //catch and log any errors
    console.error("Error saving to database", error);
    throw error;
  }
};

//export functions to use else where in app
module.exports = {
  postNewImage,
};
