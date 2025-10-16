import {
  createCate,
  deleteCate,
  getCates,
  updateCate,
} from "../services/categoryService.js";
import { getProductByCatId } from "../services/productService.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await getCates();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const createCategory = async (req, res) => {
  try {
    const image = req.file?.filename
    await createCate(req.body, image);
    res.status(201).json({ message: "category is created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await updateCate(id, req.body);
    res.status(200).json({ message: "category is updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const products = await getProductByCatId(id);
    if (products.length > 0) {
      return res
        .status(409)
        .json({
          message:
            "Category cannot be deleted because it has associated products",
        });
    }

    await deleteCate(id);
    res.status(200).json({ message: "category is deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
