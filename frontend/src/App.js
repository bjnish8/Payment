import React, { useState } from "react";
import "./App.scss";
import StripeForm from "./components/stripe/index";

const products = [
  {
    id: 1,
    name: "Jacket",
    price: 39.99,
    image:
      "https://cache.mrporter.com/variants/images/10375442618850077/in/w2000_q80.jpg",
  },
  {
    id: 2,
    name: "Shirt",
    price: 11.99,
    image:
      "https://www.ramblersway.com/sites/default/files/product_photos/708-Western-Chambray-Shirt.jpg",
  },
  {
    id: 3,
    name: "Pent",
    price: 19.99,
    image:
      "https://www.companybe.com/Uprise/product_photos/rd_images/rd_July19VansAuthenticChinoProPantMilitaryKhaki.jpg",
  },
];

const totalReducer = (acc, item) => {
  return acc + item.price * item.quantity;
};

const animateCheckout = (setTop) => {
  const foo = document.getElementById("ordersummary");
  foo.style.transition = "all 0.40s linear";
  foo.style.position = "absolute";
  foo.style.width = "420px";

  let top = 0;
  let currentTop = parseFloat(getComputedStyle(foo).top);
  setTop(currentTop);
  while (top < currentTop) {
    foo.style.top = parseFloat(getComputedStyle(foo).top) - top + "px";
    top += 10;
  }
};

const Product = ({ name, price, image, updateCart }) => {
  return (
    <div className="product">
      <div className="details">
        <span className="item-name"> {name} </span>
        <span> ${price} </span>
        <input
          className="item-input"
          type="number"
          min={0}
          onChange={updateCart}
          placeholder="Enter quantity"
        />
      </div>
      <img src={image} alt="product" />
    </div>
  );
};

const CheckoutCart = ({
  chosenItems,
  totalPrice,
  readyCheckout,
  setReadyCheckout,
}) => {
  const [currentTop, setCurrentTop] = useState(0);
  return (
    <div className={"checkout " + (chosenItems.length > 0 ? "" : "hidden")}>
      {readyCheckout && (
        <div className="checkout-header">
          <h2> Order Summary </h2>
          <button
            className="cancel-button"
            onClick={() => {
              const summary = document.getElementById("ordersummary");
              summary.style.width = "320px";
              summary.style.transition = "none";
              summary.style.top = currentTop + "px";
              setReadyCheckout(false);
            }}
          >
            X
          </button>
        </div>
      )}
      {chosenItems.map((item) => {
        return (
          <p key={item.id} className="item">
            {item.quantity} X {item.price} =
            <span className="price">
              {(item.quantity * item.price).toFixed(2)}
            </span>
          </p>
        );
      })}
      <p className="item">
        Total: <span className="price">${totalPrice}</span>
      </p>
      {!readyCheckout && (
        <button
          onClick={() => {
            setReadyCheckout(true);
            animateCheckout(setCurrentTop);
          }}
        >
          Checkout
        </button>
      )}
    </div>
  );
};

const ProductContainer = ({
  setTotalPrice,
  chosenItems,
  setChosenItems,
  readyCheckout,
}) => {
  return (
    <div className={"product-container " + (readyCheckout ? "overlay" : "")}>
      {products.map((item) => {
        return (
          <Product
            key={item.id}
            name={item.name}
            price={item.price}
            image={item.image}
            updateCart={(e) => {
              const updatedItems = chosenItems.filter(
                (obj) => obj.id !== item.id
              );
              setChosenItems([
                ...updatedItems,
                {
                  id: item.id,
                  name: item.name,
                  quantity: e.target.value,
                  price: item.price,
                },
              ]);
              setTotalPrice(chosenItems.reduce(totalReducer, 0).toFixed(2));
            }}
          />
        );
      })}
    </div>
  );
};

function App() {
  const [chosenItems, setChosenItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [readyCheckout, setReadyCheckout] = useState(false);
  return (
    <React.Fragment>
      <h2 className="header"> Market Place </h2>
      <ProductContainer
        setTotalPrice={setTotalPrice}
        chosenItems={chosenItems}
        setChosenItems={setChosenItems}
        readyCheckout={readyCheckout}
      />
      <div id="ordersummary" className="order-summary">
        <CheckoutCart
          chosenItems={chosenItems}
          totalPrice={totalPrice}
          readyCheckout={readyCheckout}
          setReadyCheckout={setReadyCheckout}
        />
        {readyCheckout && <StripeForm total={totalPrice} />}
      </div>
    </React.Fragment>
  );
}

export default App;
