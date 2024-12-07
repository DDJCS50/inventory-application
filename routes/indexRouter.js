// routes/usersRouter.js
const { Router } = require("express");
const indexController = require("../controllers/indexController");
const indexRouter = Router();

indexRouter.get("/", indexController.indexPageGet);
indexRouter.get("/createCategory", indexController.categoryCreateGet);
indexRouter.get("/createItem", indexController.itemCreateGet);
indexRouter.get("/category/:id", indexController.categoryDisplayGet);
indexRouter.get("/item/:id", indexController.itemDisplayGet);

module.exports = indexRouter;
