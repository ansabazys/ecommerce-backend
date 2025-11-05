import Cart from "../models/cartModel.js";

export const createCart = async (userId, product, size) => {
  return await Cart.create({
    userId: userId,
    items: [
      {
        productId: product._id,
        productName: product.title,
        price: product.price,
        selectedSize: size,
      },
    ],
    totalAmount: product.price
  })
};

export const getCart = async (id) => {
  return await Cart.findOne({ userId: id }).populate(
    "items.productId",
    "title images price categoryId sizes"
  );
};

export const clearCart = async (id) => {
  return await Cart.findOneAndDelete({ userId: id });
};


