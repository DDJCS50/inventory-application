// routes/usersRouter.js
const { Router } = require("express");
const indexController = require("../controllers/indexController");
const indexRouter = Router();

indexRouter.get("/", indexController.indexPageGet);
indexRouter.get("/createCategory", indexController.categoryCreateGet);
indexRouter.get("/createItem", indexController.itemCreateGet);
indexRouter.get("/category/:id", indexController.categoryDisplayGet);
indexRouter.get("/item/:id", indexController.itemDisplayGet);
indexRouter.get("/updateItem/:id", indexController.itemUpdateGet);
indexRouter.post("/updateItem/:id", indexController.itemUpdatePost);

indexRouter.post("/createCategory", indexController.categoryCreatePost);
indexRouter.post("/createItem", indexController.itemCreatePost);

indexRouter.use((req, res, next) => {
  console.log("Route does not exist");
  res.status(404).send({
    status: 404,
    message: "Route does not exist",
    type: "internal",
  });
});

module.exports = indexRouter;
