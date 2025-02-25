const express = require("express"); //importing exprees
const cors = require("cors"); //importing cors

const app = express(); //setting variable to handle express
const PORT = process.env.PORT || 3005; //setting port number for server

app.use(express.json()); //middleware to parse and handle json
app.use(cors()); //enable cors for all routes

const imageRoute = require("./routes/imageRoute");
const usersRoute = require("./routes/usersRoute");
const loginRoute = require("./routes/loginRoute");
const supportRoute = require("./routes/supportRoute");
app.use("/imageRoute", imageRoute);
app.use("/usersRoute", usersRoute);
app.use("/loginRoute", loginRoute);
app.use("/supportRoute", supportRoute);

app.get("/", (req, res) => {
  res.send("Welcome To TripPic API");
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
