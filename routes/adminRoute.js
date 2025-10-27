import express from "express";
import {
  deleteAdmin,
  getCurrentAdmin,
  loginAdmin,
  registerAdmin,
  updateAdmin,
} from "../controllers/adminController.js";
import { validateProduct, validateUser } from "../middlewares/validate.js";
import checkExist from "../middlewares/checkExist.js";
import { checkAdmin, checkSuperAdmin } from "../middlewares/checkAuth.js";
import {
  fetchUser,
  fetchUsers,
  updateUser,
} from "../controllers/userController.js";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import {
  createProduct,
  deleteProduct,
  fetchProductDetails,
  fetchProducts,
  updateProduct,
} from "../controllers/productController.js";
import upload from "../middlewares/multer.js";
import { adminGetOrders, getTotalRevenue } from "../controllers/orderController.js";
const router = express.Router();

//admin
router.post("/login", validateUser, loginAdmin);
router.post(
  "/register",
  validateUser,
  checkSuperAdmin,
  checkExist,
  registerAdmin
);
router.delete("/delete/:id", checkSuperAdmin, deleteAdmin);

//middleware
router.use(checkAdmin);

router.put("/update/:id", updateAdmin);
router.get("/me", getCurrentAdmin);

//user
router.get("/users", fetchUsers);
router.get("/users/:id", fetchUser);
router.put("/users/:id", updateUser);

//categories
router.post("/categories", upload.single("image"), createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

//products
router.post(
  "/products/:id",
  validateProduct,
  upload.array("image"),
  createProduct
);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.get("/products", fetchProducts);
router.get("/products/:id", fetchProductDetails);

//orders
router.get("/orders", adminGetOrders);
router.get("/orders/totalrevenue", getTotalRevenue);


export default router;
