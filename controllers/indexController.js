const { body, validationResult, query } = require("express-validator");
const asyncHandler = require("express-async-handler");
const db = require("../db/queries");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

const alphaErr = "must only contain letters.";

const validateCategoryInput = [body("categoryName").trim().isAlpha("en-US", { ignore: " " }).withMessage(`Category name ${alphaErr}`)];
const validateItemInput = [body("itemName").trim().isAlpha("en-US", { ignore: " " }).withMessage(`Item name ${alphaErr}`)];

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

    const { categoryName } = req.body;

    const selectedCategory = await db.getCategoryByName(categoryName);

    if (selectedCategory.length != 0) {
      throw new CustomNotFoundError("Category already exists");
    }

    db.insertCategory(categoryName);

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
  const category = await db.getCategoryById(Number(item[0].category_id));
  res.render("itemUpdate", {
    item: item[0],
    categoryName: category[0].name,
  });
});

exports.itemUpdatePost = asyncHandler(async (req, res) => {
  const itemId = req.params.id;
  if (!itemId) {
    throw new CustomNotFoundError("Item not found");
  }

  const { itemName, categoryName, itemDescription, itemPrice } = req.body;

  const selectedItem = await db.getItemById(itemId);
  const selectedCategory = await db.getCategoryByName(categoryName);

  const duplicateItemName = await db.getItemByName(itemName);

  if (selectedCategory.length == 0) {
    throw new CustomNotFoundError("Category not found, category must exist before updating item");
  } else if (selectedItem.length == 0) {
    throw new CustomNotFoundError("Item id not found in records");
  } else if (duplicateItemName.length != 0) {
    throw new CustomNotFoundError("Item name already exists!");
  }

  db.updateItemById(itemName, selectedCategory[0].id, itemDescription, itemPrice, selectedItem[0].id);
  res.redirect("/");
});

exports.categoryUpdateGet = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  if (!categoryId) {
    throw new CustomNotFoundError("Category not found");
  }

  const category = await db.getCategoryById(Number(categoryId));
  res.render("categoryUpdate", {
    category: category[0],
    categoryName: category[0].name,
  });
});

exports.categoryUpdatePost = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  if (!categoryId) {
    throw new CustomNotFoundError("Category not found");
  }

  const { categoryName } = req.body;

  const selectedCategory = await db.getCategoryById(Number(categoryId));

  const duplicateCategoryName = await db.getCategoryByName(categoryName);

  if (selectedCategory.length == 0) {
    throw new CustomNotFoundError("Category id not found in records");
  } else if (duplicateCategoryName.length != 0) {
    throw new CustomNotFoundError("Category name already exists!");
  }

  db.updateCategoryById(categoryName, selectedCategory[0].id);
  res.redirect("/");
});

exports.itemDeletePost = asyncHandler(async (req, res) => {
  const itemId = req.params.id;
  if (!itemId) {
    throw new CustomNotFoundError("Item not found");
  }

  const selectedItem = await db.getItemById(Number(itemId));
  console.log(selectedItem);

  await db.deleteItemById(selectedItem[0].id);
  res.redirect("/");
});

exports.categoryDeletePost = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  if (!categoryId) {
    throw new CustomNotFoundError("Category not found");
  }

  const selectedCategory = await db.getCategoryById(Number(categoryId));

  await db.deleteCategoryById(selectedCategory[0].id);

  res.redirect("/");
});
