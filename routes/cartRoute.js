const cartController = require("../controllers/cartController");
const { userAuth } = require("../middleware/middleware");

const cartRouter = require("express").Router();

cartRouter.post("/addToCart", userAuth, cartController.addToCart);
cartRouter.get("/getCart", userAuth, cartController.getCart);
cartRouter.delete(
  "/deleteCartItem/:foodId",
  userAuth,
  cartController.deleteCartItem
);
cartRouter.put(
  "/updateQuantity/:foodId",
  userAuth,
  cartController.updateQuantity
);
cartRouter.delete("/deleteCart", userAuth, cartController.deleteCart);

module.exports = cartRouter;
