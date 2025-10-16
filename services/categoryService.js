import Category from "../models/categoryModel.js";

export const createCate = async (data, image) => {
  return await Category.create({...data, image});
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

