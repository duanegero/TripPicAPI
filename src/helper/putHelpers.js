//require and create a variable for prisma to send requests to database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const updateImageName = async (imageId, name) => {
  const imageIdInt = parseInt(imageId, 10);
  try {
    //sending a prisma query with passed in variables
    const updateImageNameDetails = await prisma.images.update({
      where: { id: imageIdInt },
      data: {
        name: name,
        created_at: new Date(),
      },
    });
    console.log("Updated image details:", updateImageNameDetails);
    return updateImageNameDetails;
  } catch (error) {
    console.error("Error updating image:", error);
    throw new Error("Failed to update image, Please try again");
  }
};

const updateUser = async (id, first_name, last_name, email, password) => {
  //converting user Id into an INT
  const userIdInt = parseInt(id, 10);

  //varible to handle prisma query
  const updateUserDetails = await prisma.users.update({
    where: { id: userIdInt },
    data: {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
      created_at: new Date(),
    },
  });

  //return results to use else where
  return updateUserDetails;
};

module.exports = { updateImageName, updateUser };
