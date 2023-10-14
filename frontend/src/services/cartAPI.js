import axios from 'axios';

const getCart = async () => {
  try {
    // Replace with your actual API endpoint to retrieve the cart
    const response = await axios.get('/api/cart/get-cart');
    const cartData = response.data; // Assuming the response contains cart data

  } catch (error) {
    console.error('Error retrieving cart:', error);
  }
};

// Example of sending a POST request to add a product to the cart
const addToCart = async (productId) => {
  try {
    await axios.post(`/api/cart/add-to-cart/${productId}`);

  } catch (error) {
    console.error('Error adding to cart:', error);
  }
};

// Example of sending a DELETE request to remove a product from the cart
const removeFromCart = async (productId) => {
  try {
    await axios.delete(`/api/cart/remove-from-cart/${productId}`);

  } catch (error) {
    console.error('Error removing from cart:', error);
  }
};

export { getCart, addToCart, removeFromCart };
