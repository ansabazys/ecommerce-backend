import Order from "../models/orderModel.js";

export const createOdr = async (id) => {
  return await Order.create({ userId: id });
};

export const getOdr = async (id) => {
  return await Order.findById(id);
};

export const getOdrs = async (id) => {
  return await Order.find({ userId: id });
};

export const getOrdersAdmin = async () => {
  return await Order.find();
};

export const totalRevenue = async () => {
  return await Order.aggregate([{ $match: { orderStatus: "pending" }}, {$group: {_id: {$sum: "totalAmount"}}}]);
};
