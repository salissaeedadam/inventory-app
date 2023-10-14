// components/cart/Cart.js

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart } from '../../redux/features/cart/cartSlice'; // Use removeFromCart
import './CartPage.scss';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId)); // Use removeFromCart
  };

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.product._id}>
            <span>{item.product.name}</span>
            <span>Quantity: {item.quantity}</span>
            <button onClick={() => handleRemoveItem(item.product._id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cart;
