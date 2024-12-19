const { body, validationResult, query } = require("express-validator");
const asyncHandler = require("express-async-handler");
const db = require("../db/queries");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

const alphaErr = "must only contain letters.";

const validateCategoryInput = [body("categoryName").trim().isAlpha().withMessage(`Category name ${alphaErr}`)];
const validateItemInput = [body("itemName").trim().isAlpha().withMessage(`Item name ${alphaErr}`)];

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
  res.render("itemForm");
});

exports.categoryDisplayGet = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  if (!categoryId) {
    throw new CustomNotFoundError("Category not found");
  }

  const category = await db.getCategoryById(Number(categoryId));
  const items = await db.getItemsInCategory(Number(categoryId));

  res.render("categoryDisplay", {
    category: category[0],
    categoryName: category[0].name,
    items: items,
  });
});

exports.itemDisplayGet = asyncHandler(async (req, res) => {
  const itemId = req.params.id;
  if (!itemId) {
    throw new CustomNotFoundError("Item not found");
  }

  const item = await db.getItemById(Number(itemId));

  res.render("itemDisplay", {
    item: item[0],
    itemName: item[0].name,
  });
});

exports.categoryCreatePost = [
  validateCategoryInput,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("categoryForm", {
        errors: errors.array(),
      });
    }
    // TODO add posting logic and db checking
    res.redirect("/");
  }),
];

exports.itemCreatePost = [
  validateItemInput,
  validateCategoryInput,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("itemForm", {
        errors: errors.array(),
      });
    }
    const { itemName, categoryName, itemDescription, itemPrice } = req.body;

    const selectedCategory = await db.getCategoryByName(categoryName);
    const selectedItem = await db.getItemByName(itemName);

    if (selectedCategory.length == 0) {
      throw new CustomNotFoundError("Category not found");
    } else if (selectedItem.length != 0) {
      throw new CustomNotFoundError("Item already exists");
    }
    db.insertItem(itemName, selectedCategory[0].id, itemDescription, itemPrice);

    res.redirect("/");
  }),
];

exports.itemUpdateGet = asyncHandler(async (req, res) => {
  const itemId = req.params.id;
  if (!itemId) {
    throw new CustomNotFoundError("Item not found");
  }

  const item = await db.getItemById(Number(itemId));
  res.render("itemUpdate", {
    item: item[0],
  });
});
