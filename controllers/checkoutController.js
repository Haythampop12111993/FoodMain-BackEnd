const checkoutModel = require("../db/models/checkoutModel");
const { resGenerator } = require("../helper/helper");

class checkoutController {
  static createCheckout = async (req, res) => {
    try {
      let cartItems = req.body;
      let newCheckout;
      cartItems = cartItems.map((item) => {
        return {
          foodId: item.foodId._id || item.foodId,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          name: item.foodName,
          foodPrice: item.foodPrice,
          isDelete: false,
          foodImage: item.foodImage,
        };
      });
      console.log(cartItems);
      let allTotalPrice = 0;

      //   cartItems.forEach((element) => {
      //     console.log(element.foodId_id || element.foodId);
      //   });

      const isUserHaveCheckout = await checkoutModel.findOne({
        userId: req.user._id,
        isOrder: false,
      });
      if (isUserHaveCheckout) {
        cartItems.forEach((element) => {
          let itemFound = false;
          isUserHaveCheckout.cartItems.forEach((item) => {
            if (item.foodId === element.foodId) {
              item.quantity += element.quantity;
              item.totalPrice += element.totalPrice;
              itemFound = true;
              return;
            }
          });
          if (!itemFound) {
            isUserHaveCheckout.cartItems.push(element);
          }
        });
        isUserHaveCheckout.allTotalPrice = isUserHaveCheckout.cartItems.reduce(
          (acc, item) => acc + item.totalPrice,
          0
        );
        isUserHaveCheckout.status = "Pending";
        isUserHaveCheckout.deliveryCost =
          isUserHaveCheckout.cartItems.length * 3;
        await isUserHaveCheckout.save();
        resGenerator(
          res,
          200,
          true,
          isUserHaveCheckout,
          "Checkout updated successfully"
        );
      } else {
        newCheckout = new checkoutModel({
          userId: req.user._id,
          cartItems: cartItems,
          isOrder: false,
          allTotalPrice: cartItems.reduce(
            (acc, item) => acc + item.totalPrice,
            0
          ),
          status: "Pending",
          deliveryCost: cartItems.length * 3,
        });
        await newCheckout.save();
        resGenerator(
          res,
          200,
          true,
          newCheckout,
          "Checkout created successfully"
        );
      }
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };
  static getCheckout = async (req, res) => {
    try {
      const checkout = await checkoutModel.find({
        userId: req.user._id,
        isOrder: false,
      });
      let checkoutItems;
      let filterCheckoutItems;
      if (!checkout) {
        resGenerator(res, 200, true, checkout, "No checkout found");
      } else {
        checkoutItems = await checkoutModel.findOne({
          userId: req.user._id,
          isOrder: false,
        });
        console.log(checkoutItems);
        filterCheckoutItems = checkoutItems.cartItems.filter(
          (item) => item.isDelete === false
        );
        console.log("filterCheckoutItems", filterCheckoutItems);
        checkoutItems.allTotalPrice = filterCheckoutItems.reduce(
          (acc, item) => acc + item.totalPrice,
          0
        );
        console.log(checkoutItems.allTotalPrice);
        checkoutItems.cartItems = filterCheckoutItems;
        console.log(checkoutItems);
        resGenerator(
          res,
          200,
          true,
          checkoutItems,
          "Checkout fetched successfully"
        );
      }
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };
  static updateCheckOutQuantity = async (req, res) => {
    try {
      const { foodId, quantity } = req.body;
      let newCheckout;
      console.log(foodId, quantity);
      let checkout = await checkoutModel.findOne({
        userId: req.user._id,
        isOrder: false,
      });
      if (!checkout) {
        resGenerator(res, 200, true, checkout, "No checkout found");
      } else {
        // checkout.cartItems.forEach((item) => {
        //   if (item.foodId.toString() === foodId.toString()) {
        //     console.log("match found", item);
        //     item.quantity = quantity;
        //     item.totalPrice = quantity * item.foodPrice;
        //   }
        // });
        // console.log(checkout);
        // console.log(checkout);
        checkout.cartItems.forEach((item) => {
          if (item.foodId === foodId) {
            if (quantity === 0) {
              item.isDelete = true;
              const checkoutItems = checkout.cartItems.filter(
                (item) => !item.isDelete
              );
              checkout.cartItems = checkoutItems;
              checkout.allTotalPrice = checkout.cartItems.reduce(
                (acc, item) => acc + item.totalPrice,
                0
              );
            } else {
              item.quantity = quantity;
              item.totalPrice = quantity * item.foodPrice;
            }
            checkout.allTotalPrice = checkout.cartItems.reduce(
              (acc, item) => acc + item.totalPrice,
              0
            );
          }
        });
        await checkout.save();
        resGenerator(res, 200, true, checkout, "Checkout updated successfully");
      }
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };
  static deleteCheckout = async (req, res) => {
    try {
      const checkout = await checkoutModel.findOne({
        userId: req.user._id,
        isOrder: false,
      });
      if (!checkout) {
        throw new Error("Order Not Found");
      }
      await checkoutModel.deleteOne({
        userId: req.user._id,
      });
      resGenerator(res, 200, true, null, "Checkout deleted successfully");
    } catch (e) {
      resGenerator(res, 500, false, null, e.message);
    }
  };
}

module.exports = checkoutController;
