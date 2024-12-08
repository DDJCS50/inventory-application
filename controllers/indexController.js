const { body, validationResult, query } = require("express-validator");
const asyncHandler = require("express-async-handler");
const db = require("../db/queries");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

const alphaErr = "must only contain letters.";

const validateInput = [body("category-name").trim().isAlpha().withMessage(`Category name ${alphaErr}`)];

exports.indexPageGet = asyncHandler(async (req, res) => {
  const categoriesSelected = await db.getAllCategories();

  if (!categoriesSelected) {
    throw new CustomNotFoundError("Main page not found");
  }

  res.render("index", { categories: categoriesSelected });
});

exports.categoryCreateGet = asyncHandler(async (req, res) => {
  res.render("categoryForm");
});

exports.itemCreateGet = asyncHandler(async (req, res) => {
  const temp = "query item creation page here";
  if (!temp) {
    throw new CustomNotFoundError("Item form not found");
  }

  res.send(temp);
});

exports.categoryDisplayGet = asyncHandler(async (req, res) => {
  const temp = `query category displayed page here, id: ${req.params.id}`;
  if (!temp) {
    throw new CustomNotFoundError("Category not found");
  }

  res.send(temp);
});

exports.itemDisplayGet = asyncHandler(async (req, res) => {
  const temp = `query item displayed page here, id: ${req.params.id}`;
  if (!temp) {
    throw new CustomNotFoundError("Item not found");
  }

  res.send(temp);
});

exports.categoryCreatePost = [
  validateInput,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("categoryForm", {
        errors: errors.array(),
      });
    }

    const categoriesSelected = await db.getAllCategories();

    if (!categoriesSelected) {
      throw new CustomNotFoundError("Category form not found");
    }

    res.redirect("/");
  }),
];
