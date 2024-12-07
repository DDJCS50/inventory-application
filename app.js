const express = require("express");
const app = express();
require("dotenv").config();
const path = require("node:path");
const { mountRoutes } = require("./routes/index");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

mountRoutes(app);

app.use((req, res, next) => {
  console.log("Route does not exist");
  res.status(404).send({
    status: 404,
    message: "Route does not exist",
    type: "internal",
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
