import Product from "../models/productModel.js";

export const create = async (data) => {
  return await Product.create(data);
};

export const getProducts = async () => {
  return await Product.find();
};

export const getProduct = async (id) => {
  return await Product.findById(id);
};

export const getProductDetails = async (id) => {
  return await Product.aggregate([
    {
      $lookup: {
        from: "views",
        localField: "_id",
        foreignField: "productId",
        as: "viewAnalatics",
      },
    }]);
};

export const update = async (id, data) => {
  if (data.count) {
    return await Product.findByIdAndUpdate(
      id,
      { $inc: { views: data.count } },
      { new: true }
    );
  }
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

export const remove = async (id) => {
  return await Product.findByIdAndDelete(id);
};
