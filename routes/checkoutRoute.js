const checkoutRoute = require("express").Router();
const checkoutController = require("../controllers/checkoutController");
const { userAuth } = require("../middleware/middleware");

checkoutRoute.post(
  "/createCheckout",
  userAuth,
  checkoutController.createCheckout
);
checkoutRoute.get("/getCheckout", userAuth, checkoutController.getCheckout);
checkoutRoute.put(
  "/updateCheckoutQuantity",
  userAuth,
  checkoutController.updateCheckOutQuantity
);
checkoutRoute.delete(
  "/deleteCheckout",
  userAuth,
  checkoutController.deleteCheckout
);

module.exports = checkoutRoute;
