const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoute = require("../routes/userRoute");
const foodRoute = require("../routes/foodRoute");
const cartRouter = require("../routes/cartRoute");
const checkoutRoute = require("../routes/checkoutRoute");
const orderRoute = require("../routes/orderRoute");
const connectDB = require("../db/connect/connect");
const app = express();
connectDB();
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

app.use("/api/user", userRoute);
app.use("/api/food", foodRoute);
app.use("/api/cart", cartRouter);
app.use("/api/checkout", checkoutRoute);
app.use("/api/order", orderRoute);

module.exports = app;
