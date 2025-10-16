import {
  create,
  getProduct,
  getProductDetails,
  getProducts,
  remove,
  update,
} from "../services/productService.js";
import { createViews } from "../services/viewsService.js";

export const createProduct = async (req, res) => {
  try {
    const { stock } = req.body;
    const {id} = req.params //category id
    stock > 0
      ? (req.body.stockStatus = "in stock")
      : (req.body.stockStatus = "out of stock");
    const product = await create(req.body, id);
    res.status(201).json({ message: "product created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchProducts = async (req, res) => {
  try {
    const products = await getProducts(req.body);
    if(products.length > 0){
       return res.status(200).json(products);
    }

     res.status(404).json({message: "No products"});
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
    if(!product) {
      return res.status(404).json({message: "Product not found!"})
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchProductDetails = async (req, res) => {         //TODO add analatics
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
    const { stock } = req.body;
    stock > 0
      ? (req.body.stockStatus = "in stock")
      : (req.body.stockStatus = "out of stock");
    await update(id, req.body);
    res.status(200).json({ message: "product updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await remove(id);
    if (result === null)
      return res.status(409).json({ message: "product already deleted" });
    res.status(200).json({ message: "product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
