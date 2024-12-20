const db = require("../db/index.js");

async function getAllCategories() {
  const { rows } = await db.query("SELECT * FROM categories");
  return rows;
}

async function getCategoryById(searchedId) {
  const { rows } = await db.query("SELECT * FROM categories WHERE id=($1)", [searchedId]);
  return rows;
}

async function getItemById(searchedId) {
  const { rows } = await db.query("SELECT * FROM items WHERE id=($1)", [searchedId]);
  return rows;
}

async function getCategoryByName(searchedName) {
  const { rows } = await db.query("SELECT * FROM categories WHERE name LIKE ($1)", [`%${searchedName}%`]);
  return rows;
}

async function insertItem(itemName, categoryId, itemDescription, itemPrice) {
  await db.query("INSERT INTO items (name, category_id, description, price) VALUES ($1, $2, $3, $4)", [itemName, categoryId, itemDescription, itemPrice]);
}

async function getItemByName(searchedName) {
  const { rows } = await db.query("SELECT * FROM items WHERE name LIKE ($1)", [`%${searchedName}%`]);
  return rows;
}

async function insertCategory(categoryName) {
  await db.query("INSERT INTO categories (name) VALUES ($1)", [categoryName]);
}

async function updateItemById(itemName, categoryId, itemDescription, itemPrice, itemId) {
  await db.query("UPDATE items SET name = ($1), category_id = ($2), description = ($3), price = ($4) WHERE id=($5)", [itemName, categoryId, itemDescription, itemPrice, itemId]);
}

// async function deleteUsernames() {
//   await db.query("DELETE FROM messages");
// }

async function getItemsInCategory(searchedId) {
  const { rows } = await db.query("SELECT * FROM items WHERE category_id=($1)", [searchedId]);
  return rows;
}

module.exports = {
  getAllCategories,
  getCategoryById,
  getItemsInCategory,
  getItemById,
  getCategoryByName,
  insertItem,
  getItemByName,
  insertCategory,
  updateItemById,
};
