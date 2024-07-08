const jwt = require("jsonwebtoken");
const userModel = require("../db/models/userModel");
const { resGenerator } = require("../helper/helper");
const config = require("config");

const userAuth = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token) throw new Error("Not Authorized");
    token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, config.get("tokenKey"));
    const _id = decoded._id;
    const userData = await userModel.findById({
      _id: _id,
      "tokens.token": token,
    });
    if (!userData) {
      resGenerator(res, 401, false, null, "Not Authorized");
      return;
    }
    req.user = userData;
    req.token = token;
    next();
  } catch (err) {
    resGenerator(res, 401, false, null, "Not Authorized");
  }
};
const adminAuth = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role !== "admin") {
      resGenerator(res, 401, false, null, "Not Authorized");
      return;
    }
    next();
  } catch (err) {
    resGenerator(res, 401, false, null, "Not Authorized");
  }
};

module.exports = { userAuth, adminAuth };
