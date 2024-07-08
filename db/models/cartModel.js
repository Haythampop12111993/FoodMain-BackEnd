const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    food: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        foodName: {
          type: String,
          required: true,
        },
        foodPrice: {
          type: Number,
          required: true,
        },
        foodImage: {
          type: String,
          required: true,
        },
        foodCookingTime: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          required: true,
        },
        totalPrice: {
          type: Number,
          default: 0,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const cartModel = mongoose.model("Cart", cartSchema);

module.exports = cartModel;
