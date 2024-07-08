const mongoose = require("mongoose");
const LatLngSchema = new mongoose.Schema({
  lat: {
    type: String,
    required: true,
  },
  lng: {
    type: String,
    required: true,
  },
});
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        foodImage: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    AllTotalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "New",
      enum: ["New", "Payed", "Cooking", "Ready", "Delivered"],
    },
    paymentMethod: {},
    addressLatLng: {
      type: LatLngSchema,
      required: true,
    },
    paymentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const orderModel = new mongoose.model("order", orderSchema);
module.exports = orderModel;
