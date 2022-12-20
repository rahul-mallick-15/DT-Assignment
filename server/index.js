require("dotenv").config();
require("express-async-errors");

const PORT = process.env.PORT || 3000;
const express = require("express");
const multer = require("multer");
const upload = multer();
const app = express();

const { connect } = require("./db/connect");
const events = require("./routes/events");
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(upload.single("image"));

app.use("/api/v3/app/events", events);
app.use(notFound);
app.use(errorHandlerMiddleware);

const start = async () => {
  connect((err) => {
    try {
      if (err !== undefined) throw err;
      console.log("connected to database");
      app.listen(PORT, console.log(`server listening on port ${PORT}`));
    } catch (error) {
      console.log(error);
      console.log("Failed to Connect");
    }
  });
};

start();
