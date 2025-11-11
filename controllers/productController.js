import { getCate, updateCate } from "../services/categoryService.js";
import {
  categoryProducts,
  create,
  getProduct,
  getProductDetails,
  getProducts,
  remove,
  search,
  update,
} from "../services/productService.js";
import { createViews } from "../services/viewsService.js";

export const createProduct = async (req, res) => {
  try {
    let { sizes, images, ...rest } = req.body;
    const newSize = JSON.parse(sizes).map((s) => {
      return { size: s.size, stock: parseInt(s.stock) };
    });

    const isStock = newSize.some((item) => item.stock > 0);

    isStock
      ? (rest.stockStatus = "in stock")
      : (rest.stockStatus = "out of stock");

    images = req.files.map((file) => file.filename);

    await create({ ...rest, images, sizes: newSize });
    const category = await getCate(req.body.categoryId);

    category.productsCount++;
    category.save();

    res.status(201).json({ message: "product created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const fetchProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8 ;

    const [products, totalCount] = await getProducts(page, limit);
    const totalPages = Math.ceil(totalCount / limit);
    if (products.length > 0) {
      return res.status(200).json({ products, totalPages, totalCount });
    }

    res.status(404).json({ message: "No products" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await getProduct(id);
    const viewsData = await createViews(id, req?.session?.user?._id); //views creation
    const product = await update(id, viewsData);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductDetails(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { sizes, ...rest } = req.body;

    const newSize = JSON.parse(sizes).map((s) => {
      return { size: s.size, stock: parseInt(s.stock) };
    });

    const product = await getProduct(id);
    product.sizes = newSize;

    product.save();

    const isStock = newSize.some((item) => item.stock > 0);

    let images = req.files.map((file) => file.filename);

    isStock
      ? (rest.stockStatus = "in stock")
      : (rest.stockStatus = "out of stock");

    const pr = await update(id, { newSize, images, ...rest });

    res.status(200).json({ message: "product updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id, cid } = req.params;
    const result = await remove(id);
    if (result === null)
      return res.status(409).json({ message: "product already deleted" });

    const category = await getCate(cid);
    category.productsCount--;
    category.save();
    res.status(200).json({ message: "product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q, price } = req.query;

    const filters = { isDeleted: false };

    if (q) {
      filters.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    let sortOption = { createdAt: -1 };

    if (price) {
      if (price === "low") sortOption = { price: 1 };
      if (price === "high") sortOption = { price: -1 };
    }

    const products = await search(filters, sortOption);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error during search" });
  }
};
