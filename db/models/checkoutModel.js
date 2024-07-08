const mongoose = require("mongoose");
const cheackoutSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    isOrder: { type: Boolean, required: true, default: false },
    cartItems: [
      {
        foodId: { type: String, required: true },
        quantity: { type: Number, required: true },
        name: { type: String, required: true },
        foodImage: { type: String, required: true },
        foodPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        isDelete: { type: Boolean, required: true, default: false },
      },
    ],
    allTotalPrice: { type: Number, required: true },
    status: { type: String, required: true, default: "Pending" },
    deliveryCost: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Checkout = mongoose.model("Checkout", cheackoutSchema);

module.exports = Checkout;
