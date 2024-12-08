const db = require("../db/index.js");

// TODO: add query scripts after db and table initialization

async function getAllCategories() {
  const { rows } = await db.query("SELECT * FROM categories");
  return rows;
}

// async function insertMessage(username, textInput, added, details) {
//   await db.query("INSERT INTO messages (username, textinput, added, details) VALUES ($1, $2, $3, $4)", [username, textInput, added, details]);
// }

async function getCategoryById(searchedId) {
  const { rows } = await db.query("SELECT * FROM categories WHERE id=($1)", [searchedId]);
  return rows;
}

async function getItemById(searchedId) {
  const { rows } = await db.query("SELECT * FROM items WHERE id=($1)", [searchedId]);
  return rows;
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
};
