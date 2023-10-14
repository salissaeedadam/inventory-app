// controllers/cartController.js

const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Add a product to the user's cart
const addToCart = async (req, res) => {
  const { productId } = req.params;
  const { user } = req;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: user.id });

    if (!cart) {
      // If the user doesn't have a cart, create one
      cart = new Cart({ user: user.id, items: [] });
    }

    // Check if the product is already in the cart
    const existingCartItem = cart.items.find((item) => item.product.toString() === productId);

    if (existingCartItem) {
      // If the product is in the cart, increase the quantity
      existingCartItem.quantity += 1;
    } else {
      // If the product is not in the cart, add it
      cart.items.push({ product: productId, quantity: 1 });
    }

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding product to the cart' });
  }
};

// Retrieve the user's cart
const getCart = async (req, res) => {
  const { user } = req;

  try {
    const cart = await Cart.findOne({ user: user.id }).populate('items.product');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving cart' });
  }
};

// Remove a product from the user's cart
const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const { user } = req;

  try {
    const cart = await Cart.findOne({ user: user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the cart item to remove
    const cartItem = cart.items.find((item) => item.product.toString() === productId);

    if (cartItem) {
      // If the item is found in the cart, remove it
      cart.items = cart.items.filter((item) => item.product.toString() !== productId);
      await cart.save();
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing product from the cart' });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
};
