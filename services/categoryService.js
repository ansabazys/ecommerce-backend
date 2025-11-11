import Category from "../models/categoryModel.js";

export const createCate = async (data) => {
  return await Category.create({ ...data });
};

export const updateCate = async (id, data) => {
  return await Category.findByIdAndUpdate(id, data);
};
export const inspectCategory = async (data) => {
  return await Category.findOne({title: {$regex: data, $options: "i"}});
};
export const deleteCate = async (id) => {
  return await Category.findByIdAndDelete(id);
};




export const getCates = async (page, limit) => {
  const skip = (page - 1) * limit;

  return Promise.all([
    Category.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Category.countDocuments(),
  ]);
};


export const getCate = async (id) => {
  return await Category.findOne({ _id: id })
};


