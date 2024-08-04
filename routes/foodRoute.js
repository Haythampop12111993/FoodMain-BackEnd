const foodRoute = require("express").Router();
const FoodController = require("../controllers/foodController");
const { userAuth, adminAuth } = require("../middleware/middleware");
const upload = require("../middleware/multer");

foodRoute.get("/test", FoodController.test);
foodRoute.post(
  "/addFood",
  userAuth,
  adminAuth,
  upload.single("foodImage"),
  FoodController.addFood
);
foodRoute.get("/allFood", FoodController.allFood);
foodRoute.get("/foodDetails/:_id", FoodController.foodDetails);
foodRoute.get("/foodByTag/:tag", FoodController.foodByTag);
foodRoute.get("/searchFood", FoodController.searchFood);
foodRoute.get("/searchFoodWithTag/:tag", FoodController.searchFoodWithTag);
foodRoute.get(
  "/showAllFood",
  userAuth,
  adminAuth,
  FoodController.ShowFoodInDashboard
);

// foodRoute.delete("/deleteFood/:_id", userAuth, adminAuth, FoodController.deleteFood);

foodRoute.patch(
  "/updateFood/:foodId",
  userAuth,
  adminAuth,
  FoodController.editFood
);
foodRoute.delete(
  "/deleteFood/:foodId",
  userAuth,
  adminAuth,
  FoodController.deleteFood
);

module.exports = foodRoute;
