import User from "../models/userModel.js";

export const createUser = async (password, data) => {
  return await User.create({ ...data, password });
};

export const inspectUser = async (data) => {
  return await User.findOne({ email: data.email });
};

export const getUsers = async (page, limit) => {
  const skip = (page - 1) * limit;

  return Promise.all([
    User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(),
  ]);
};


export const getUser = async (id) => {
  return await User.findById(id).select("-password");
};

export const uptUser = async (id, data) => {
  return await User.findByIdAndUpdate(id, data);
};
