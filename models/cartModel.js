import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      productName: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      selectedSize: {
        type: String,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    default: 0,
  },
}, {timestamps: true});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
