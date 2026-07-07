import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    image: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    price: {
      type: Number,
      required: true,
    },

    sizes: [
      {
        size: {
          type: String,
          required: true,
        },
        stock: {
          type: Number,
          default: 0,
        },
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
      ref: "Category",
      required: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    viewsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "views",
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index({
  title: "text",
  description: "text",
});

const Product = mongoose.model("Product", productSchema);

export default Product;
