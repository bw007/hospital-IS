const express = require("express");
require("dotenv").config();
const path = require('path');

const router = require("./routes");

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files
app.use(express.static("public"));

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// Route
app.use(router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
