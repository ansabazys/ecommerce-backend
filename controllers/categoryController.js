import {
  createCate,
  deleteCate,
  getCate,
  getCates,
  updateCate,
} from "../services/categoryService.js";
import {
  categoryProducts,
  getProductByCatId,
} from "../services/productService.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await getCates();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategoryProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;

    const [products, totalCount] = await categoryProducts(id, page);
    console.log(totalCount)
    const totalPages = Math.ceil(totalCount / 8)
    res.status(200).json({products, totalPages});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const image = req.file?.filename;
    const category = await createCate(req.body);
    res
      .status(201)
      .json({ message: "category is created", category: category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await updateCate(id, req.body);
    res
      .status(200)
      .json({ message: "category is updated", category: category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await getCate(id);
    if (category.productsCount > 0) {
      return res.status(409).json({
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
