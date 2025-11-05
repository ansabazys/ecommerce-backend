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
  images: [String],
  isDeleted: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    required: true,
  },
  // sizes: {
  //   type: Number,
  //   min: 0,
  // },
  sizes: [
    {
      size: { type: String, required: true },
      stock: { type: Number, default: 0 },
    },
  ],
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  stockStatus: {
    type: String,
    enum: ["in stock", "out of stock"],
    default: "out of stock",
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", //TODO: fix the category issue
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  viewsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "views", //TODO: fix the category issue
  },
}, {timestamps: true});


productSchema.index({title: "text", description: "text"})


const Product = mongoose.model("Product", productSchema);
export default Product;
