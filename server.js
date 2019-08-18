const express = require("express");
const connectDB = require("./config/db");
const passport = require("passport");
const morgan = require("morgan");

// Routes
const users = require("./routes/api/users");
const profiles = require("./routes/api/profiles");
const animals = require("./routes/api/animals");

const app = express();

// Add middleware
app.use(morgan("dev"));
app.use(express.json({ extended: false }));
app.use(passport.initialize());

// Env variables
const port = process.env.PORT || 5000;

// Connect to DB
connectDB();

// Use Routes
app.use("/api/users", users);
app.use("/api/profiles", profiles);
app.use("/api/animals", animals);

app.listen(port, () => console.log(`Listening on port ${port}...`));