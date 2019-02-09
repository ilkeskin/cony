const express = require("express");
const mongoose = require("mongoose");

// Routes
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const animals = require("./routes/api/animals");

const app = express();

// Env variables
const port = process.env.PORT || 5000;

// DB config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("Connected to MongoDB!"))
  .catch(error => console.log(error));

app.get("/", (req, res) => res.send("Hello"));

// Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/animals", animals);

app.listen(port, () => console.log(`Listening on port ${port}...`));
