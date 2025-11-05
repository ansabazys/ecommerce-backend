import { clearCart, getCart } from "../services/cartService.js";
import {
  createOdr,
  getOdr,
  getOdrs,
  getOrdersAdmin,
  orderByMonth,
  totalRevenue,
} from "../services/orderService.js";
import { getProduct } from "../services/productService.js";
import { getUser } from "../services/userService.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req?.session?.user?._id;
    const cart = await getCart(userId);
    if (cart.items.length === 0) {
      return res.status(404).json({ message: "cart is empty" });
    }

    const { address, paymentMethod } = req.body;
    const user = await getUser(userId);
    const { totalAmount, items } = cart;

    user.address = address;

    const order = await createOdr(userId);

    order.items = items;
    order.totalAmount = totalAmount;
    order.paymentMethod = paymentMethod;
    order.address = user.address;

    order.items.map(async (item) => {
      try {
        const product = await getProduct(item.productId);

        product.sizes.map((size) => {
          if (size.size == item.selectedSize) {
            size.stock -= item.quantity;
          }
        });

        const isStock = product.sizes.some((item) => item.stock > 0);

        isStock
          ? (product.stockStatus = "in stock")
          : (product.stockStatus = "out of stock");

        await product.save();
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    console.log(order);

    await user.save();
    await order.save();
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    res.status(201).json({ message: "Order is created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;
    const order = await getOdr(id);

    async function updateStock(status) {
      order.items.map(async (item) => {
        try {
          const product = await getProduct(item.productId);
          if (status == "canceled") {
            product.stock += item.quantity;
          } else if (status == "completed") {
            product.stock -= item.quantity;
          }

          product.stock > 0
            ? (product.stockStatus = "in stock")
            : (product.stockStatus = "out of stock");

          await product.save();
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      });
    }

    if (orderStatus) {
      if (orderStatus == "canceled" && order.orderStatus != "canceled") {
        await updateStock("canceled", "increment");
      } else if (
        orderStatus == "completed" &&
        order.orderStatus != "completed"
      ) {
        await updateStock("completed", "decrement");
      }

      order.orderStatus = orderStatus;
      await order.save();
      return res.status(200).json(order);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req?.session?.user?._id;
    const orders = await getOdrs(userId);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const adminGetOrders = async (req, res) => {
  try {
    const orders = await getOrdersAdmin();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTotalRevenue = async (req, res) => {
  try {
    const total = await totalRevenue();
    res.status(200).json(total);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderByMonth = async (req, res) => {
  try {
    const total = await orderByMonth();
    res.status(200).json(total);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
