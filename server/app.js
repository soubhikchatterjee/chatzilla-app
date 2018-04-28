const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

mongoose.connect("mongodb://192.168.100.200:27017/chatzilla");
let db = mongoose.connection;

// Check for DB errors
db.on("error", error => {
  console.log(error);
});

// Check connection
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const app = express();

// Middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Enable dev logging
app.use(morgan("dev"));

// Enable CORS
app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "*");

  if (request.method === "OPTIONS") {
    response.header(
      "Access-Control-Allow-Methods",
      "GET, PUT, POST, PATCH, DELETE"
    );
    return response.status(200).json({});
  }

  next();
});

// Routes
// app.use("/teams", require("./routes/teams"));
app.use("/chats", require("./routes/chats"));
app.use("/channels", require("./routes/channels"));
app.use("/starred", require("./routes/starred"));
app.use("/users", require("./routes/users"));
app.use("/auth", require("./routes/auth"));

// Handling 404 and 500 errors
app.use((request, response, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, request, response, next) => {
  response.status(error.status || 500);
  response.json({
    error: {
      message: error.message
    }
  });
});

app.listen(3000, () => {
  console.log("Server running...");
});
