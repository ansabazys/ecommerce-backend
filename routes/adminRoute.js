import express from "express";
import { deleteAdmin, loginAdmin, registerAdmin, updateAdmin } from "../controllers/adminController.js";
import { validateProduct, validateUser } from "../middlewares/validate.js";
import checkExist from "../middlewares/checkExist.js";
import { checkAdmin, checkSuperAdmin } from "../middlewares/checkAuth.js";
import { fetchUser, fetchUsers, updateUser } from "../controllers/userController.js";
import { createCategory, deleteCategory, updateCategory } from "../controllers/categoryController.js";
import { createProduct, deleteProduct, fetchProductDetails, fetchProducts, updateProduct } from "../controllers/productController.js";
const router = express.Router();

//admin
router.post("/register", validateUser, checkSuperAdmin ,checkExist, registerAdmin);
router.put("/update/:id", checkAdmin, updateAdmin);
router.post("/login", validateUser, loginAdmin);
router.delete("/delete/:id", checkSuperAdmin ,deleteAdmin);

//user
router.get("/users", checkAdmin, fetchUsers)
router.get("/users/:id", checkAdmin, fetchUser)
router.put("/users/:id", checkAdmin, updateUser)

//categories
router.post("/categories", checkAdmin, createCategory)
router.put("/categories/:id", checkAdmin, updateCategory)
router.delete("/categories/:id", checkAdmin, deleteCategory)

//products
router.post("/products", checkAdmin, validateProduct ,createProduct)
router.put("/products/:id", checkAdmin ,updateProduct)
router.delete("/products/:id", checkAdmin ,deleteProduct)
router.get("/products", checkAdmin, fetchProducts)
router.get("/products/:id", checkAdmin, fetchProductDetails)





export default router;
