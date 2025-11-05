import { createCart, getCart } from "../services/cartService.js";
import { getProduct } from "../services/productService.js";

export const addToCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const { size } = req.body;
    const userId = req?.session?.user?._id;

    const cart = await getCart(userId);

    const product = await getProduct(productId);
    if (!cart) {
      await createCart(userId, product, size);
      const cart = await getCart(userId);
      return res.status(201).json({ message: "added to the cart", data: cart });
    }

    const itemIndex = cart.items.findIndex(
      (dt) => dt.productId._id == productId && dt.selectedSize == size
    );

    if (itemIndex > -1) {
      console.log(cart.items[itemIndex]);
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({
        productId: product._id,
        productName: product.title,
        price: product.price,
        selectedSize: size,
      });
    }

    cart.totalAmount = cart.items.reduce((acc, curr) => {
      acc += curr.price * curr.quantity;
      return acc;
    }, 0);

    await cart.save();
    const newCart = await getCart(userId);

    res.status(201).json({ message: "added to the cart", data: newCart });
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

    const cartItems = cart.items.filter(
      (item) => item.productId._id != productId
    );
    cart.items = cartItems;

    const totalAmount = cart.items.reduce((acc, curr) => {
      acc += curr.price * curr.quantity;
      return acc;
    }, 0);

    cart.totalAmount = totalAmount;

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
    const  itemId  = req.params.id;
    const cart = await getCart(userId);

    const { quantity } = req.body;

    console.log(quantity)

    if (quantity) {
      cart.items.map((item) => {
        if (item._id == itemId) {
          item.quantity = quantity;
        }
      });
    }

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
