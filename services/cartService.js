import Cart from "../models/cartModel.js";

export const createCart = async (userId, product) => {
  return await Cart.create({
    userId: userId,
    items: [
      {
        productId: product._id,
        productName: product.title,
        price: product.price,
      },
    ],
    totalAmount: product.price,
  });
};

export const getCart = async (id) => {
  return await Cart.findOne({ userId: id });
};

export const clearCart = async (id) => {
  return await Cart.findOneAndDelete({ userId: id });
};




