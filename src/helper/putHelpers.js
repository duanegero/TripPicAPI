//require and create a variable for prisma to send requests to database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const updateImageName = async (imageUrl, name) => {
  const updateImageNameDetails = await prisma.images.update({
    where: { s3_url: imageUrl },
    data: {
      name: name,
      created_at: new Date(),
    },
  });

  return updateImageNameDetails;
};

module.exports = { updateImageName };
