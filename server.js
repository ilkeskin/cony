const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const morgan = require("morgan");

// Routes
const users = require("./routes/api/users");
const profiles = require("./routes/api/profiles");
const animals = require("./routes/api/animals");

const app = express();

// Add middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());

// Env variables
const port = process.env.PORT || 5000;

// DB config
const db = require("./config/keys").mongoURI;
require("./config/passport")(passport);

// Connect to MongoDB
mongoose.connect(db)
    .then(() => console.log("Connected to MongoDB!"))
    .catch(error => console.log(error));

app.get("/", (req, res) => res.send("Hello"));

// Use Routes
app.use("/api/users", users);
app.use("/api/profiles", profiles);
app.use("/api/animals", animals);

app.listen(port, () => console.log(`Listening on port ${port}...`));