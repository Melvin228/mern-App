const express = require("express");
const mongoose = require("mongoose");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

//DB config
const db = require("./config/key").mongoURI;

//Connect to MongoDb
mongoose
  .connect(db)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Error occured:", err);
  });

app.get("/", (req, res) => {
  res.send("<p>Hello there </p>");
});

//built in body-parser
app.use(express.json());
// app.use(express.urlencoded());

//Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = require("./config/key").port || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
