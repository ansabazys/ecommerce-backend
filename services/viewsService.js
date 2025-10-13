import Views from "../models/viewsModel.js";

export const createViews = async (id, userId) => {
  return await Views.create({ productId: id, count: 1, userId: userId});
};

export const getViews = async (id) => {
  return await Views.findById(id)
}