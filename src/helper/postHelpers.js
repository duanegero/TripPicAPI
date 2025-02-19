//requiring prisma to sen queries to database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//defining a async function with passed in variables
const postNewImage = async (imageUrl, name, user_id) => {
  try {
    //converting user Id into an INT
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

const postNewUser = async (first_name, last_name, email, password) => {
  try {
    //creating a variable to handle prisma query, with passed in variables
    const newUser = await prisma.users.create({
      data: {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
      },
    });
    //return resutls to use else where
    return newUser;
  } catch (error) {
    //catch if any error and log
    console.error("Error creating new user.", error);
    throw error;
  }
};

const postNewRequest = async (request, userId) => {
  try {
    const newRequest = await prisma.supportRequests.create({
      data: {
        request: request,
        user_id: parseInt(userId, 10),
      },
    });
    return newRequest;
  } catch (error) {
    console.error("Error creating new request.");
    throw error;
  }
};

//export functions to use else where in app
module.exports = {
  postNewImage,
  postNewUser,
  postNewRequest,
};
