import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    // unique: true
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    min: 0,
  },
  stockStatus: {
    type: String,
    enum: ["in stock", "out of stock"],
    default: "out of stock",
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories",                         //TODO: fix the category issue
  },
  views: {
    type: Number,
    default: 0
  }
});

const Product = mongoose.model("Product", productSchema)
export default Product