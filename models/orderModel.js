import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["completed", "returned", "canceled", "pending"],
      default: "pending",
    },
    items: [],
    totalAmount: {
      type: Number,
    },
    paymentMethod: {
      type: String,
    },
    address: {
      type: Object,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
