import User from "../models/userModel.js";

export const createUser = async (password, data) => {
  return await User.create({ ...data, password });
};

export const inspectUser = async (data) => {
  return await User.findOne({email: data.email})

};

export const getUsers = async () => {
  return await User.find().sort({ createdAt: -1 });
};


export const getUser = async (id) => {
  return await User.findById(id).select("-password")
};

export const uptUser = async (id, data) => {
  return await User.findByIdAndUpdate(id, data)
};
