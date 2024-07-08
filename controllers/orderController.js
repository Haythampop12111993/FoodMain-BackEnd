const orderModel = require("../db/models/orderModel");
const checkoutModel = require("../db/models/checkoutModel");
const { resGenerator } = require("../helper/helper");
const axios = require("axios");
const config = require("config");
// const paypal = require("paypal-rest-sdk");
const stripe = require("stripe")(config.get("stripe_Key"));
class orderController {
  static createOrder = async (req, res) => {
    try {
      //   res.send("Order Done");
      const userOrder = req.body;
      if (userOrder.order.length <= 0) throw new Error("Order is Empty");
      await orderModel.deleteOne({
        userId: req.user._id,
        status: "New",
      });
      const OrderItem = new orderModel({ ...req.body, userId: req.user._id });
      await OrderItem.save();
      resGenerator(res, 200, true, OrderItem, "Order Placed Successfully");
    } catch (e) {
      resGenerator(res, 500, false, null, e.massage);
    }
  };
  static getOrder = async (req, res) => {
    try {
      const order = await orderModel
        .findOne({
          userId: req.user._id,
          status: "New",
        })
        .populate("userId", ["name", "address"])
        .populate("order.foodId", ["name", "price", "quantity", "totalPrice"]);
      if (!order) throw new Error("Order Not Found");
      resGenerator(res, 200, true, order, "Order Found");
    } catch (e) {
      resGenerator(res, 500, false, null, e.massage);
    }
  };
  static pay = async (req, res) => {
    try {
      const { paymentID, paymentSource } = req.body;
      const order = await orderModel.findOne({
        userId: req.user._id,
        status: "New",
      });
      if (!order) throw new Error("Order Not Found");
      console.log(req.body);
      console.log(paymentID);
      console.log(paymentSource);
      order.paymentId = paymentID;
      if (!paymentID) throw new Error("Payment failed please try again");
      order.paymentMethod = paymentSource;
      order.status = "Payed";
      await order.save();
      await checkoutModel.findOneAndDelete({
        userId: req.user._id,
        isOrder: false,
      });
      resGenerator(res, 200, true, order, "Order Payed Successfully");
    } catch (e) {
      resGenerator(res, 500, false, null, e.massage);
    }
  };
  // static createPayment = async (req, res) => {
  //   try {
  //     const order = await orderModel.findOne({
  //       userId: req.user._id,
  //       status: "New",
  //     });
  //     if (!order) throw new Error("Order Not Found");
  //     paypal.configure({
  //       mode: "sandbox", //sandbox or live
  //       client_id: config.get("client_id"),
  //       client_secret: config.get("client_secret"),
  //     });
  //     const create_payment_json = {
  //       intent: "sale",
  //       payer: {
  //         payment_method: "paypal",
  //       },
  //       redirect_urls: {
  //         return_url: "http://localhost:3000/success",
  //         cancel_url: "http://localhost:3000/cancel",
  //       },
  //       transactions: [
  //         {
  //           item_list: {
  //             items: order.order.map((item) => ({
  //               name: item.foodId.name,
  //               foodId: item.foodId._id,
  //               price: item.foodId.price,
  //               currency: "USD",
  //               quantity: item.quantity,
  //             })),
  //           },
  //           amount: {
  //             currency: "USD",
  //             total: order.AllTotalPrice,
  //           },
  //           description: "This is the payment description.",
  //         },
  //       ],
  //     };

  //     if (!create_payment_json) throw new Error("Payment Not Found");

  //     paypal.payment.create(create_payment_json, function (error, payment) {
  //       if (error) {
  //         throw new Error(error);
  //       }

  //       const approvalUrl = payment.links.find(
  //         (link) => link.rel === "approval_url"
  //       );
  //       if (approvalUrl) {
  //         res.redirect(approvalUrl.href);
  //       }
  //     });
  //   } catch (e) {
  //     resGenerator(res, 500, false, null, e.massage);
  //   }
  // };
  ///////////////////////////////////////////////////////////////////////

  // static paypalSuccess = async (req, res) => {
  //   try {
  //     const payerId = req.query.PayerID;
  //     const paymentId = req.query.paymentId;
  //     const userOrder = await orderModel.findOne({
  //       userId: req.user._id,
  //       status: "New",
  //     });
  //     if (!userOrder) throw new Error("Order Not Found");
  //     const execute_payment_json = {
  //       payer_id: payerId,

  //       transactions: [
  //         {
  //           amount: {
  //             currency: "USD",
  //             total: userOrder.AllTotalPrice,
  //           },
  //         },
  //       ],
  //     };
  //   } catch (e) {
  //     resGenerator(res, 500, false, null, e.massage);
  //   }
  // };
  ///////////////////////////////////////////////////////////
  // static createPaypalOrder = async (req, res) => {
  //   try {
  //     const userOrder = orderModel.findOne({
  //       userId: req.user._id,
  //       status: "New",
  //     });
  //     if (!userOrder) throw new Error("Order Not Found");
  //     const accessToken = await payPalService.generateAccessToken();
  //     if (!accessToken) throw new Error("Access Token Not Found");
  //     console.log(accessToken);
  //     const response = await axios({
  //       url: `${config.get("Paypal_Url")}/v2/checkout/orders`,
  //       method: "post",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //       data: {
  //         intent: "CAPTURE",
  //         purchase_units: [
  //           {
  //             items: userOrder.order.map((item) => ({
  //               name: item.foodId.name,
  //               foodId: item.foodId._id,
  //               quantity: item.quantity,
  //             })),
  //             amount: {
  //               currency_code: "USD",
  //               value: userOrder.AllTotalPrice,
  //               breakdown: {
  //                 item_total: {
  //                   currency_code: "USD",
  //                   value: userOrder.AllTotalPrice,
  //                 },
  //               },
  //             },
  //             description: "This is the payment description.",
  //           },
  //         ],
  //         application_context: {
  //           brand_name: "Food Store",
  //           landing_page: "NO_PREFERENCE",
  //           user_action: "PAY_NOW",
  //           // return_url: "http://localhost:3000/success",
  //           // cancel_url: "http://localhost:3000/cancel",
  //         },
  //       },
  //     });
  //     res.send(response);

  //     // resGenerator(res, 200, true, response.data, null);

  //     // const create_payment_json = {
  //     //   intent: "sale",
  //     //   payer: {
  //     //     payment_method: "paypal",
  //     //   },
  //     //   redirect_urls: {
  //     //     return_url: "http://localhost:3000/success",
  //     //     cancel_url: "http://localhost:3000/cancel",
  //     //   },
  //     //   transactions: [
  //     //     {
  //     //       item_list: {
  //     //         items: userOrder.order.map((item) => ({
  //     //           name: item.foodId.name,
  //     //           foodId: item.foodId._id,
  //     //         })),
  //     //       },
  //     //       amount: {
  //     //         currency: "USD",
  //     //         total: userOrder.AllTotalPrice,
  //     //       },
  //     //       description: "This is the payment description.",
  //     //     },
  //     //   ],
  //     // };
  //     // if (!create_payment_json) throw new Error("Payment Not Found");
  //     // paypal.payment.create(create_payment_json, function (error, payment) {
  //     //   if (error) {
  //     //     throw new Error(error);
  //     //   }
  //     //   const approvalUrl = payment.links.find(
  //     //     (link) => link.rel === "approval_url"
  //     //   );
  //     //   if (approvalUrl) {
  //     //     res.redirect(approvalUrl.href);
  //     //   }
  //     // });
  //   } catch (e) {
  //     resGenerator(res, 500, false, null, e.massage);
  //   }
  // };
  ///////////////////////////////////////////////////////////////
  // static stripeCheckout = async (req, res) => {
  //   try {
  //     const userOrder = await orderModel.findOne({
  //       userId: req.user._id,
  //       status: "New",
  //     });
  //     if (!userOrder) throw new Error("Order Not Found");
  //     const session = await stripe.checkout.sessions.create({
  //       line_items: userOrder.order.map((item) => ({
  //         price_data: {
  //           currency: "usd",
  //           product_data: {
  //             name: item.foodId.name,
  //             images: [item.foodId.image],
  //           },
  //           unit_amount: item.foodId.price * 100,
  //         },
  //         quantity: item.quantity,
  //       })),
  //       mode: "payment",
  //       success_url: "http://localhost:3000/success",
  //       cancel_url: "http://localhost:3000/cancel",
  //     });
  //     console.log(session);

  //     // res.send({ url: session.url });

  //     // resGenerator(res, 200, true, session.url, null);
  //   } catch (e) {
  //     resGenerator(res, 500, false, null, e);
  //   }
  // };
  //////////////////////////////////////////////////
  static trackOrder = async (req, res) => {
    try {
      const order = await orderModel
        .findById({
          _id: req.params.id,
        })
        .populate("userId", ["name", "address"])
        .populate("order.foodId", ["name", "price", "quantity", "totalPrice"]);
      if (!order) throw new Error("Order Not Found");
      resGenerator(res, 200, true, order, "Order Track");
    } catch (e) {
      resGenerator(res, 500, false, null, e.massage);
    }
  };
}

module.exports = orderController;
