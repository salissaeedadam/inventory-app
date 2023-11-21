import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const API_URL = `${BACKEND_URL}/api/cart`;

const getCart = async () => {
  try {
    // Replace with your actual API endpoint to retrieve the cart
    const response = await axios.get(`${API_URL}/get-cart`);
    const cartData = response.data; // Assuming the response contains cart data

    return cartData;
  } catch (error) {
    console.error('Error retrieving cart:', error);
  }
};

// Example of sending a POST request to add a product to the cart
const addToCart = async (productId) => {
  try {
    await axios.post(`${API_URL}/add-to-cart/${productId}`);

  } catch (error) {
    console.error('Error adding to cart:', error);
  }
};

// Example of sending a DELETE request to remove a product from the cart
const removeFromCart = async (productId) => {
  try {
    await axios.delete(`${API_URL}/remove-from-cart/${productId}`);

  } catch (error) {
    console.error('Error removing from cart:', error);
  }
};

export { getCart, addToCart, removeFromCart };
