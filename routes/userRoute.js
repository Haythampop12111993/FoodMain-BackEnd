const UserController = require("../controllers/userController");
const { userAuth, adminAuth } = require("../middleware/middleware");

const userRoute = require("express").Router();
userRoute.get("/test", UserController.test);
userRoute.post("/register", UserController.addUser);
userRoute.post("/login", UserController.login);
userRoute.post("/adminLogin", UserController.adminLogin);
userRoute.get("/getAdmin", userAuth, adminAuth, UserController.getAdmin);
userRoute.get("/getUser", userAuth, UserController.getUser);
userRoute.delete("/logout", userAuth, UserController.logout);
userRoute.delete(
  "/dashboardLogout",
  userAuth,
  adminAuth,
  UserController.dashboardLogout
);
userRoute.get(
  "/getUsers",
  userAuth,
  adminAuth,
  UserController.getUsersInDashboard
);
userRoute.delete(
  "/deleteUserByAdmin/:userId",
  userAuth,
  adminAuth,
  UserController.deleteUserByAdmin
);
userRoute.patch(
  "/blockUser/:userId",
  userAuth,
  adminAuth,
  UserController.blockUser
);
userRoute.patch(
  "/unBlockUser/:userId",
  userAuth,
  adminAuth,
  UserController.unBlockUser
);

module.exports = userRoute;
