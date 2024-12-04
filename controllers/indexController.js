const { body, validationResult, query } = require("express-validator");

exports.indexPageGet = (req, res) => {
  res.send("I'm the main page!");
};
