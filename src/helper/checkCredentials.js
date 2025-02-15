//import prisma client to connect to data base
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const checkCredentials = async (email, password) => {
  const checkUser = await prisma.users.findFirst({
    where: {
      email: email,
      password: password,
    },
  });

  return checkUser;
};

module.exports = { checkCredentials };
