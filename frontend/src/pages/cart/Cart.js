import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ADD_TO_CART,
  CALCULATE_SUBTOTAL,
  CALCULATE_TOTAL_QUANTITY,
  CLEAR_CART,
  DECREASE_CART,
  REMOVE_FROM_CART,
  SAVE_URL,
  selectCartItems,
  selectCartTotalAmount,
  selectCartTotalQuantity,
} from "../../redux/features/cart/cartSlice";
import styles from "./CartPage.module.scss";
import { FaTrashAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/card/Card";
import {
  selectIsLoggedIn,
  selectUser,
} from "../../redux/features/auth/authSlice";

import { usePaystackPayment } from "react-paystack";

const product = [];
let totalAmount = 0;
let totalQuantity = 0;

const Cart = () => {
  const user = useSelector(selectUser);

  console.log(user);

  let cartItems = useSelector(selectCartItems);
  // getCart().then((res) => {
  //   console.log(res)
  //   if (res.items) {
  //     cartItems = res
  //   }
  // })
  const cartTotalAmount = useSelector(selectCartTotalAmount);
  const cartTotalQuantity = useSelector(selectCartTotalQuantity);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const navigate = useNavigate();

  const increaseCart = (cart) => {
    dispatch(ADD_TO_CART(cart));
  };

  const decreaseCart = (cart) => {
    dispatch(DECREASE_CART(cart));
  };

  const removeFromCart = (cart) => {
    dispatch(REMOVE_FROM_CART(cart));
  };

  const clearCart = () => {
    dispatch(CLEAR_CART());
  };

  useEffect(() => {
    dispatch(CALCULATE_SUBTOTAL());
    dispatch(CALCULATE_TOTAL_QUANTITY());
    dispatch(SAVE_URL(""));
  }, [cartItems, dispatch]);

  const url = window.location.href;

  //paystack integration below
  console.log(totalAmount);

  //paystack config for the particular payment
  const config = {
    reference: Math.random(),
    email: user?.email || "salissaeedadam@gmail.com",
    amount: totalAmount * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey:
      process.env.REACT_APP_PAYSTACK_PUBLIC ||
      "pk_test_b44d3dd68d464a9b4df98646246397b752a97ccc",
  };

  const onSuccess = () => {
    console.log("reference");
    // implementation for  whatever you want to do when the Payment is successful.
    checkout();
  };

  // you can call this function anything
  const onClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    alert("transaction closed");
  };

  console.log(config);

  const initializePayment = usePaystackPayment(config); //initializing the payment

  const checkout = () => {
    if (isLoggedIn) {
      navigate("/salesHistory");
    } else {
      dispatch(SAVE_URL(url));
      // navigate("/login");
    }
  };

  return (
    <section>
      <div className={`container ${styles.table}`}>
        <h2>Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <>
            <p>Your cart is currently empty.</p>
            <br />
            <div>
              <Link to="/#products">&larr; Back To Dashboard </Link>
            </div>
          </>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((cart, index) => {
                  console.log(cart);
                  const { name, price, image } = cart.product;
                  const { _id, quantity } = cart;

                  if (!product.includes(_id)) {
                    product.push(_id);
                    totalAmount += Number(price) * Number(quantity);
                    totalQuantity += Number(quantity);
                  }

                  console.log(totalAmount);
                  return (
                    <tr key={_id}>
                      <td>{index + 1}</td>
                      <td>
                        <p>
                          <b>{name}</b>
                        </p>
                        <img
                          src={image.filePath}
                          alt={name}
                          style={{ width: "100px" }}
                        />
                      </td>
                      <td>{price}</td>
                      <td>
                        <div className={styles.count}>
                          <p>
                            <b>{quantity}</b>
                          </p>
                          {/* <button
                              className="--btn"
                              onClick={() => increaseCart(cart)}
                            >
                              +
                            </button> */}
                        </div>
                      </td>
                      <td>{(Number(price) * quantity).toFixed(2)}</td>
                      <td className={styles.icons}>
                        <FaTrashAlt
                          size={19}
                          color="red"
                          onClick={() => removeFromCart(cart)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className={styles.summary}>
              <button className="--btn --btn-danger" onClick={clearCart}>
                Clear Cart
              </button>
              <div className={styles.checkout}>
                <div>
                  <Link to="/#products">&larr; Continue shopping</Link>
                </div>
                <br />
                <Card cardClass={styles.card}>
                  <p>
                    <b> {`Cart item(s): ${totalQuantity}`}</b>
                  </p>
                  <div className={styles.text}>
                    <h4>Subtotal:</h4>
                    <h3>{`$${totalAmount}`}</h3>
                  </div>
                  <button
                    onClick={() => {
                      initializePayment(onSuccess, onClose);
                    }}
                    className="--btn --btn-primary --btn-block"
                  >
                    Checkout
                  </button>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Cart;
