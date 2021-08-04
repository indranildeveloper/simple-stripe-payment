import React, { useState } from "react";
import "./App.css";
import logo from "./logo.svg";
import StripeCheckout from "react-stripe-checkout";

const App = () => {
  const [product, setProduct] = useState({
    name: "The EBook",
    price: 15,
    productBy: "Indranil Halder",
  });

  const makePayment = (token) => {
    const body = {
      token,
      product,
    };
    const headers = {
      "Content-Type": "application/json",
    };

    return fetch(`http://localhost:7000/payment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log("RESPONSE", response);
        const { status } = response;
        console.log("STATUS", status);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="App bg-green">
      <div className="App-header">
        <h1>Learn React JS!</h1>
        <img className="App-logo" src={logo} alt="logo" />
        <h3>Click Below to Buy Now!</h3>
        <StripeCheckout
          token={makePayment}
          stripeKey={process.env.REACT_APP_KEY}
          name="Buy ReactJS EBook"
          amount={product.price * 100}
        >
          <button className="btn-large blue">
            Buy Ebook for ${product.price}
          </button>
        </StripeCheckout>
      </div>
    </div>
  );
};

export default App;
