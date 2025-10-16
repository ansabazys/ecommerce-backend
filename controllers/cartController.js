import { createCart, getCart } from "../services/cartService.js";
import { getProduct } from "../services/productService.js";

export const addToCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req?.session?.user?._id;

    const cart = await getCart(userId);
    const product = await getProduct(productId);
    if (!cart) {
      await createCart(userId, product);
      return res.status(201).json({ message: "added to the cart" });
    }

    const itemIndex = cart.items.findIndex((dt) => dt.productId == productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({
        productId: product._id,
        productName: product.title,
        price: product.price,
      });
    }

    cart.totalAmount = cart.items.reduce((acc, curr) => {
      acc += curr.price * curr.quantity;
      return acc;
    }, 0);

    await cart.save();
    res.status(201).json({ message: "added to the cart" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCartItems = async (req, res) => {
  try {
    const userId = req?.session?.user?._id;
    const cart = await getCart(userId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const userId = req?.session?.user?._id;
    // const {productId} = req.body  //implement frontend logic
    const productId = req.params.id;
    const cart = await getCart(userId);

    const cartItems = cart.items.filter((item) => item.productId != productId);
    cart.items = cartItems;

    cart.totalAmount = cart.items.reduce((acc, curr) => {
      acc += curr.price * curr.quantity;
      return acc;
    }, 0);

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req?.session?.user?._id;
    // const {productId} = req.body  //implement frontend logic
    const productId = req.params.id;
    const cart = await getCart(userId);

    const { quantity } = req.body;

    if (quantity) {
      cart.items.map( (item) => {
        if(item.productId == productId) {
          item.quantity = quantity
        }
      });
    }

    console.log(cart)

    cart.totalAmount = cart.items.reduce((acc, curr) => {
      acc += curr.price * curr.quantity;
      return acc;
    }, 0);

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
