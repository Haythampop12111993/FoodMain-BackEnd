const userModel = require("../db/models/userModel");
const { resGenerator } = require("../helper/helper");
class UserController {
  static test = async (req, res) => {
    res.send("test");
  };
  static addUser = async (req, res) => {
    try {
      const userData = new userModel({
        ...req.body,
        image: "assets/default-user-img.png",
      });
      await userData.save();
      resGenerator(res, 200, true, userData, "User created successfully");
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };

  static login = async (req, res) => {
    try {
      const userData = await userModel.logMe(req.body.email, req.body.password);
      if (!userData) throw new Error("User not found");
      if (userData.isBlocked) throw new Error("User is blocked you cant login");
      const token = await userData.generateToken();
      resGenerator(
        res,
        200,
        true,
        {
          userData: userData,
          token: token,
        },
        "login successfully"
      );
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };
  static adminLogin = async (req, res) => {
    try {
      const userData = await userModel.adminLogin(
        req.body.email,
        req.body.password
      );
      if (!userData) throw new Error("User not found");
      const token = await userData.generateToken();
      resGenerator(
        res,
        200,
        true,
        {
          userData: userData,
          token: token,
        },
        "login successfully"
      );
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };

  static getUser = async (req, res) => {
    try {
      const userData = req.user;
      if (!userData) throw new Error("User not found");
      if (userData.isBlocked) throw new Error("User is blocked you cant login");
      resGenerator(res, 200, true, userData, "User data");
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };
  static getAdmin = async (req, res) => {
    try {
      const userData = req.user;
      resGenerator(res, 200, true, userData, "User data");
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };
  static logout = async (req, res) => {
    try {
      const userData = req.user;
      const token = req.token;
      userData.tokens = userData.tokens.filter((t) => t.token !== token);
      await userData.save();
      resGenerator(res, 200, true, null, "Logout successfully");
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };
  static dashboardLogout = async (req, res) => {
    try {
      const userData = req.user;
      const token = req.token;

      if (!userData) throw new Error("User not found");
      userData.tokens = userData.tokens.filter((t) => t.token !== token);
      await userData.save();
      resGenerator(res, 200, true, null, "Logout successfully");
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };
  static getUsersInDashboard = async (req, res) => {
    try {
      const AllUsers = await userModel.find();
      if (!AllUsers) throw new Error("No users found");
      resGenerator(res, 200, true, AllUsers, "All users");
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };
  static deleteUserByAdmin = async (req, res) => {
    try {
      const userData = await userModel.findById({ _id: req.params.userId });
      if (!userData) throw new Error("User Not Found");
      if (userData.role == "admin") {
        if (req.user.role == "admin")
          // throw new Error("You are Admin And not allowed to delete Admin");
          resGenerator(
            res,
            401,
            true,
            null,
            "You are Admin And not allowed to delete Admin"
          );
      } else if (userData.role == "user") {
        if (req.user == "user") {
          // throw new Error("You are not allowed to delete user");
          resGenerator(
            res,
            401,
            true,
            null,
            "You are User And not allowed to delete"
          );
        } else {
          await userModel.findByIdAndDelete({ _id: req.params.userId });
          const allUsers = await userModel.find();
          resGenerator(res, 200, true, allUsers, "User deleted");
        }
      }
      
    }
    catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }

  }
  ;
  static blockUser = async (req, res) => {
    try {
      const userData = await userModel.findById({ _id: req.params.userId });
      if (!userData) throw new Error("User not found");
      if (userData.role == "user") {
        await userModel.findByIdAndUpdate(
          { _id: req.params.userId },
          { isBlocked: true }
        );
        const allUsers = await userModel.find();
        resGenerator(res, 200, true, allUsers, "User blocked");
      } else {
        if (userData.role == "admin") {
          if (req.user.role == "admin") {
            throw new Error("You Admin , You can't block Admin");
          }
        }
      }
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };
  static unBlockUser = async (req, res) => {
    try {
      const blockUserData = await userModel.findById({
        _id: req.params.userId,
        isBlocked: true,
      });
      if (!blockUserData) throw new Error("User not found");
      if (blockUserData.role == "user") {
        await userModel.findByIdAndUpdate(
          { _id: req.params.userId },
          { isBlocked: false }
        );
        const allUsers = await userModel.find();
        resGenerator(res, 200, true, allUsers, "User unblocked");
      } else {
        if (blockUserData.role == "admin") {
          if (req.user.role == "admin") {
            throw new Error("You Admin , You can't unblock Admin");
          }
        }
      }
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };
}

module.exports = UserController;
