const userModel = require("../db/models/userModel");
const { resGenerator } = require("../helper/helper");
class UserController {
  static test = async (req, res) => {
    res.send("test");
  };
  static addUser = async (req, res) => {
    try {
      const userData = new userModel(req.body);
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
}

module.exports = UserController;
