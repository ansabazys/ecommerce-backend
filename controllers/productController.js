import cloudinary from "../config/cloudinary.js";
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
import { uploadImage } from "../utils/uploadCloudinary.js";

export const createProduct = async (req, res) => {
  try {
    let { sizes, ...rest } = req.body;

    // Parse sizes
    let parsedSizes = [];

    if (sizes) {
      try {
        parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;

        parsedSizes = parsedSizes.map((item) => ({
          size: item.size,
          stock: Number(item.stock),
        }));
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid sizes format",
        });
      }
    }

    // Determine stock status
    rest.stockStatus = parsedSizes.some((item) => item.stock > 0)
      ? "in stock"
      : "out of stock";

    // Image is required
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    // Upload image to Cloudinary
    const uploaded = await uploadImage(req.file.buffer);

    const image = {
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
    };

    // Create product
    const product = await create({
      ...rest,
      image,
      sizes: parsedSizes,
    });

    // Update category product count
    const category = await getCate(rest.categoryId);

    if (category) {
      category.productsCount += 1;
      await category.save();
    }

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const fetchProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;

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
    let { sizes, ...rest } = req.body;

    // Get existing product
    const product = await getProduct(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Parse sizes
    let parsedSizes = [];

    if (sizes) {
      parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;

      parsedSizes = parsedSizes.map((item) => ({
        size: item.size,
        stock: Number(item.stock),
      }));
    }

    // Stock status
    rest.stockStatus = parsedSizes.some((item) => item.stock > 0)
      ? "in stock"
      : "out of stock";

    const updatePayload = {
      ...rest,
      sizes: parsedSizes,
    };

    // New image uploaded
    if (req.file) {
      // Delete old Cloudinary image
      if (product.image?.public_id) {
        await cloudinary.uploader.destroy(product.image.public_id);
      }

      // Upload new image
      const uploaded = await uploadImage(req.file.buffer);

      updatePayload.image = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };
    }

    const updatedProduct = await update(id, updatePayload);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id, cid } = req.params;

    const product = await getProduct(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Delete image from Cloudinary
    if (product.image?.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    await remove(id);

    const category = await getCate(cid);

    if (category) {
      category.productsCount--;
      await category.save();
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
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
