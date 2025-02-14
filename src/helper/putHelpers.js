//require and create a variable for prisma to send requests to database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const updateImageName = async (imageUrl, name) => {
  //sending a prisma query with passed in variables
  const updateImageNameDetails = await prisma.images.update({
    where: { s3_url: imageUrl },
    data: {
      name: name,
      created_at: new Date(),
    },
  });

  //return results to use else where
  return updateImageNameDetails;
};

const updateUser = async (id, first_name, last_name, email, password) => {
  //converting user Id into an INT
  const userIdInt = parseInt(id, 10);

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

  return updateUserDetails;
};

module.exports = { updateImageName, updateUser };
