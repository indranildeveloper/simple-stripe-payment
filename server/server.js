const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { log } = require("nodemon/lib/utils");
require('dotenv').config()

const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("<h1>Hello Stripe!</h1>");
});

app.post("/payment", (req, res) => {
  const { product, token } = req.body;
  console.log("Product: ", product);
  console.log("Price: ", product.price);
  const itempotencyKey = uuidv4();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `Purchase of ${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
        },
        { itempotencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((error) => console.log(error));
});

// Listen
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
