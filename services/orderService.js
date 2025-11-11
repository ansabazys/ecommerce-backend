import Order from "../models/orderModel.js";

export const createOdr = async (id) => {
  return await Order.create({ userId: id });
};

export const getOdr = async (id) => {
  return await Order.findById(id);
};

export const getOdrs = async (id) => {
  return await Order.find({ userId: id }).sort({ createdAt: -1 });
};
export const upadteOrderStatus = async (id, data) => {
  return await Order.findByIdAndUpdate(id, data);
};


export const getOrdersAdmin = async (page, limit) => {
  const skip = (page - 1) * limit;

  return Promise.all([
    Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(),
  ]);
};

export const totalRevenue = async () => {
  return await Order.aggregate([
    { $match: { orderStatus: "completed" } },
    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    { $project: { _id: 0, totalRevenue: 1 } },
  ]);
};

export const orderByMonth = async () => {
  return await Order.aggregate([
    { $match: { orderStatus: "completed" } },
    { $group: { _id: { $month: "$createdAt" }, orders: { $sum: 1 } } },
    { $project: { _id: 0, month: "$_id", orders: 1 } },
    { $sort: { month: 1 } },
  ]);
};
