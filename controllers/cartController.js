const cartModel = require("../db/models/cartModel");
const foodModel = require("../db/models/foodModel");
const { resGenerator } = require("../helper/helper");

class cartController {
  static addToCart = async (req, res) => {
    // res.send("add to cart");
    try {
      const userId = req.user._id;
      console.log(req.user._id);
      const foodId = req.body.foodId;
      const food = await foodModel.findById({ _id: foodId });
      const quantity = Number(req.body.quantity);
      const totalPrice = Number(food.price) * quantity;
      const checkIfUserHaveCart = await cartModel.findOne({ userId: userId });
      let addedFood;
      let checkFood;
      if (checkIfUserHaveCart) {
        checkFood = await cartModel.findOne({
          userId: userId,
          "food.foodId": foodId,
        });
        if (checkFood) {
          checkFood.food.forEach((item) => {
            if (item.foodId == foodId) {
              item.quantity = Number(item.quantity) + Number(quantity);
              item.totalPrice = Number(item.totalPrice) + Number(totalPrice);
              checkFood.save();
              addedFood = checkFood;
            }
          });
        } else {
          addedFood = await cartModel.findByIdAndUpdate(
            checkIfUserHaveCart._id,
            {
              $push: {
                food: {
                  foodId: foodId,
                  quantity,
                  totalPrice: totalPrice,
                  foodName: food.name,
                  foodPrice: food.price,
                  foodImage: food.foodImage,
                  foodCookingTime: food.cookingTime,
                },
              },
            }
          );
          addedFood = await cartModel.findById(checkIfUserHaveCart._id);
        }
      } else {
        addedFood = await cartModel.create({
          userId: userId,
          food: {
            foodId: foodId,
            quantity,
            totalPrice: totalPrice,
            foodName: food.name,
            foodPrice: food.price,
            foodImage: food.foodImage,
            foodCookingTime: food.cookingTime,
          },
        });
      }
      resGenerator(res, 200, true, addedFood, "Cart added successfully");
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };
  static getCart = async (req, res) => {
    try {
      const userId = req.user._id;
      const cart = await cartModel
        .findOne({ userId: userId })
        .populate("food.foodId", "name price");
      if (!cart) {
        throw new Error("Cart Not Found");
      }
      resGenerator(res, 200, true, cart, "Cart fetched successfully");
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };
  static updateQuantity = async (req, res) => {
    try {
      const userId = req.user._id;
      let cart = await cartModel.findOne({ userId: userId });
      if (!cart) {
        resGenerator(res, 404, false, null, "Cart not found");
      }
      const foodId = req.params.foodId;
      const food = await foodModel.findById(foodId);
      if (!food) {
        resGenerator(res, 404, false, null, "Food not found");
      }
      const newQuantity = Number(req.body.quantity);
      cart.food.forEach((item) => {
        if (item.foodId == foodId) {
          item.quantity = newQuantity;
          item.totalPrice = Number(food.price) * newQuantity;
          cart.save();
        }
      });
      cart = await cartModel
        .findById(cart._id)
        .populate("food.foodId", "name price");
      resGenerator(res, 200, true, cart, "Cart updated successfully");
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };
  // static updateCart = async (req, res) => {
  //   try {
  //     const userId = req.user._id;
  //     const cart = await cartModel.findOne({ userId: userId });
  //     if (!cart) {
  //       resGenerator(res, 404, false, null, "Cart not found");
  //     }
  //     const foodId = req.body.foodId;
  //     const quantity = req.body.quantity;
  //     const totalPrice = req.body.totalPrice;

  //     resGenerator(res, 200, true, updatedCart, "Cart updated successfully");
  //   } catch (e) {
  //     resGenerator(res, 500, false, null, e.message);
  //   }
  // };
  static deleteCart = async (req, res) => {
    try {
      const userId = req.user._id;
      const cart = await cartModel.findOne({ userId: userId });
      if (!cart) {
        throw new Error("Cart Not Found");
      }
      await cartModel.findByIdAndDelete(cart._id);
      resGenerator(res, 200, true, null, "Cart deleted successfully");
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };
  static deleteCartItem = async (req, res) => {
    try {
      const userId = req.user._id;
      const cart = await cartModel.findOne({ userId: userId });
      if (!cart) {
        resGenerator(res, 404, false, null, "Cart not found");
      }
      const foodId = req.params.foodId;
      const food = await cartModel.findOne({
        userId: userId,
        "food.foodId": foodId,
      });
      if (!food) {
        resGenerator(res, 404, false, null, "Food not found in cart");
      }
      let updatedCart = await cartModel.findByIdAndUpdate(cart._id, {
        $pull: { food: { foodId: foodId } },
      });
      updatedCart = await cartModel.findById(cart._id);
      resGenerator(
        res,
        200,
        true,
        updatedCart,
        "Cart item deleted successfully"
      );
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };
}
module.exports = cartController;
