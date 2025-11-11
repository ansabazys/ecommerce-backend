import Product from "../models/productModel.js";

export const create = async ({ ...data }) => {
  return await Product.create(data);
};

export const getProducts = async (page, limit) => {
  const skip = (page - 1) * limit;

  return Promise.all([
    Product.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments({ isDeleted: false }),
  ]);
};

export const categoryProducts = async (id, page) => {
  const limit = 8;
  const skip = (page - 1) * limit;

  return Promise.all([
    Product.find({ isDeleted: false, categoryId: id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments({ categoryId: id, isDeleted: false }),
  ]);
};

export const getProduct = async (id) => {
  return await Product.findById(id);
};

export const getProductByCatId = async (id) => {
  return await Product.find({ categoryId: id });
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
    },
  ]);
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
  return await Product.findByIdAndUpdate(id, { isDeleted: true });
};

export const search = async (filters, sortOption) => {
  return await Product.find(filters)
    .populate("categoryId", "title")
    .collation({ locale: "en", strength: 2 })
    .sort(sortOption);
};
