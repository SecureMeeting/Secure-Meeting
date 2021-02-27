const stripe = require("stripe")(process.env.SECRET_KEY);
const { Response } = require("../models/Response");

/**
 * Checks if a users login is correct
 * @param email email of the user
 * @param code
 * @returns {Response}
 */
exports.donate = async (req, res) => {
  const { amount, currency } = req.body;
  console.log("amount:", amount);
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};
