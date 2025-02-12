//import prisma client to connect to data base
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//defining a helper function
const deleteImage = async (imageUrl) => {
  //cerating a variable to handle query to prisma
  const imageToDelete = await prisma.images.findUnique({
    where: {
      s3_url: imageUrl,
    },
  });

  //if nothing found throw error
  if (!imageToDelete) {
    throw new Error("Image not found");
  }

  //sending a prisma delete
  await prisma.images.delete({
    where: {
      s3_url: imageUrl,
    },
  });

  //return resluts to app
  return imageToDelete;
};

//export function to use else where in app
module.exports = {
  deleteImage,
};
