const foodModel = require("../db/models/foodModel");
const { resGenerator } = require("../helper/helper");
const cloudinary = require("../utils/cloudinary");

class Food {
  static test = async (req, res) => {
    try {
      resGenerator(res, 200, true, "test", "test");
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };
  static addFood = async (req, res) => {
    try {
      console.log(req.body);
      console.log(req.file);
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "food",
      });
      console.log("image", result.secure_url);
      const food = new foodModel({
        ...req.body,
        foodImage: result.secure_url,
        whoAdded: req.user._id,
      });
      console.log(food);
      await food.save();
      resGenerator(res, 200, true, food, "Food added successfully");
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };
  static allFood = async (req, res) => {
    try {
      let { foodPageNumber } = req.query;
      const itemsPerPage = 4;
      const countItems = await foodModel.countDocuments();
      const totalPages = Math.ceil(countItems / itemsPerPage);
      const skip = (foodPageNumber - 1) * itemsPerPage;
      let food = await foodModel
        .find()
        .populate("whoAdded", "_id name")
        .skip((foodPageNumber - 1) * itemsPerPage)
        .limit(itemsPerPage);
      if (food.length === 0) {
        foodPageNumber = 1;
        food = await foodModel
          .find()
          .skip(foodPageNumber - 1)
          .limit(itemsPerPage);
        // throw new Error("No food found in this page ");
      }
      resGenerator(
        res,
        200,
        true,
        { totalPages, food },
        "Food fetched successfully"
      );
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };
  static foodDetails = async (req, res) => {
    try {
      const food = await foodModel.findById(req.params._id);
      if (!food) {
        throw new Error("Food not found");
      }
      console.log(food.tags);
      const foodsWithSameTag = await foodModel
        .find({
          _id: { $ne: food._id },
          tags: { $in: food.tags },
        })
        .select("_id name foodImage");
      console.log(foodsWithSameTag);

      resGenerator(
        res,
        200,
        true,
        { food, foodsWithSameTag },
        "Food fetched successfully"
      );
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };
  static searchFood = async (req, res) => {
    try {
      const { search } = req.query;
      const food = await foodModel.find({
        name: { $regex: search, $options: "i" },
      });
      if (food.length === 0) {
        throw new Error("No food found with this name");
      }
      resGenerator(res, 200, true, food, "Food fetched successfully");
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };
  static foodByTag = async (req, res) => {
    try {
      const tag =
        req.params.tag.charAt(0).toUpperCase() +
        req.params.tag.slice(1).toLowerCase();
      if (!tag) {
        throw new Error("Tag is required");
      }
      let food;
      if (tag == "All") {
        food = await foodModel.find();
      } else {
        food = await foodModel.find({ tags: tag });
      }
      if (food.length === 0) {
        throw new Error("No food found with this tag");
      }
      resGenerator(res, 200, true, food, "Food fetched successfully");
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };
  static searchFoodWithTag = async (req, res) => {
    try {
      const { page } = req.query;
      console.log(page);
      const itemsPerPage = 4;
      let skip = (page - 1) * itemsPerPage;
      const tag =
        req.params.tag.charAt(0).toUpperCase() +
        req.params.tag.slice(1).toLowerCase();
      console.log(typeof tag);
      console.log(tag);
      if (!tag) {
        throw new Error("Tag is required");
      }
      let { search } = req.query;
      if (!search) {
        search = "";
      }
      console.log(search);
      console.log(typeof search);
      let food;
      let totalPages;
      if (tag == "All") {
        const countItems = await foodModel.countDocuments({
          name: { $regex: search, $options: "i" },
        });
        totalPages = Math.ceil(countItems / itemsPerPage);
        if (page > totalPages || page < 1) {
          skip = 0;
        }
        console.log(page);
        food = await foodModel
          .find({
            name: { $regex: search, $options: "i" },
          })
          .skip(skip)
          .limit(itemsPerPage);
        console.log(food.length);
      } else {
        const countItems = await foodModel.countDocuments({
          name: { $regex: search, $options: "i" },
          tags: tag,
        });
        food = await foodModel
          .find({
            name: { $regex: search, $options: "i" },
            tags: tag,
          })
          .skip(skip)
          .limit(itemsPerPage);
        totalPages = Math.ceil(countItems / itemsPerPage);
      }
      if (food.length === 0) {
        throw new Error("No food found with this name");
      }
      console.log(totalPages);
      console.log(page);
      resGenerator(
        res,
        200,
        true,
        { totalPages, food },
        "Food fetched successfully"
      );
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };
}
module.exports = Food;
