const mongoose = require("mongoose");
const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    cookingTime: {
      type: String,
      required: true,
    },
    foodImage: {
      type: String,
      required: true,
    },
    stars: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 5,
    },
    origins: {
      type: [String],
      required: true,
      enum: [
        "Indian",
        "Italian",
        "Chinese",
        "American",
        "Japanese",
        "French",
        "German",
        "Mediterranean",
        "Thai",
        "Vietnamese",
        "Brazilian",
        "Korean",
        "Mexican",
        "Middle eastern",
        "Moroccan",
        "Peruvian",
        "Spanish",
        "Turkish",
        "Vegan",
        "Vegetarian",
        "Western",
        "Egyptian",
      ],
    },
    tags: {
      type: [String],
      required: true,
      enum: [
        "Juice",
        "Drink",
        "Snack",
        "Dessert",
        "Fastfood",
        "Pizza",
        "Lunch",
        "Slowfood",
        "Hamburger",
        "Fry",
        "Soup",
      ],
    },
    whoAdded: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const foodModel = new mongoose.model("Food", foodSchema);

module.exports = foodModel;
