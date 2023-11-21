// models/cartModel.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to your User model
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to your Product model
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;


// const mongoose = require("mongoose");

// const CartSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User"
//     },
//     products: [
//       {
//         productId: Number,
//         quantity: Number,
//         name: String,
//         price: Number
//       }
//     ],
//     active: {
//       type: Boolean,
//       default: true
//     },
//     modifiedOn: {
//       type: Date,
//       default: Date.now
//     }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Cart", CartSchema);