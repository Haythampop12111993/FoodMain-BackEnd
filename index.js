const config = require("config");
const app = require("./server/server");
const paypal = require("paypal-rest-sdk");
const functions = require("firebase-functions");

require("dotenv");
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(` Server running..... on PORT ${port}`);
});
exports.api = functions.https.onRequest(app);
