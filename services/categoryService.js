import Category from "../models/categoryModel.js";

export const createCate = async (data) => {
  return await Category.create({ ...data });
};

export const updateCate = async (id, data) => {
  return await Category.findByIdAndUpdate(id, data);
};
export const deleteCate = async (id) => {
  return await Category.findByIdAndDelete(id);
};

export const getCates = async () => {
  return await Category.find();
};

export const getCate = async (id) => {
  return await Category.findOne({ _id: id });
};
