import {
  createCate,
  deleteCate,
  getCates,
  updateCate,
} from "../services/categoryService.js";

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
    await createCate(req.body);
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
    await deleteCate(id);
    res.status(200).json({ message: "category is deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
