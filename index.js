const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

// Loading environment variables
require('dotenv').config();

// BodyParser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define port from environment variables with a fallback
const port = process.env.PORT || 3000;

const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Define a schema for the register form
const registerSchema = new mongoose.Schema({
  email: String,
  password: String
});

// Creating a model from the schema
const Register = mongoose.model("Register", registerSchema);

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/index.html");
});

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const registerData = new Register({
      email,
      password
    });

    await registerData.save();
    res.redirect("/success");
  } catch (error) {
    console.error(error);
    res.redirect("/error");
  }
});

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/pages/success.html");
});

app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/pages/error.html");
});

// Server listening
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});