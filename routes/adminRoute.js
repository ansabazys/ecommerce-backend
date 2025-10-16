import express from "express";
import { deleteAdmin, loginAdmin, registerAdmin, updateAdmin } from "../controllers/adminController.js";
import { validateProduct, validateUser } from "../middlewares/validate.js";
import checkExist from "../middlewares/checkExist.js";
import { checkAdmin, checkSuperAdmin } from "../middlewares/checkAuth.js";
import { fetchUser, fetchUsers, updateUser } from "../controllers/userController.js";
import { createCategory, deleteCategory, updateCategory } from "../controllers/categoryController.js";
import { createProduct, deleteProduct, fetchProductDetails, fetchProducts, updateProduct } from "../controllers/productController.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

//admin
router.post("/login", validateUser, loginAdmin);
router.post("/register", validateUser, checkSuperAdmin ,checkExist, registerAdmin);
router.delete("/delete/:id", checkSuperAdmin ,deleteAdmin);


//middlewa
router.use(checkAdmin)

router.put("/update/:id", updateAdmin);


//user
router.get("/users", fetchUsers)
router.get("/users/:id", fetchUser)
router.put("/users/:id", updateUser)

//categories
router.post("/categories", upload.single('image') ,createCategory)
router.put("/categories/:id", updateCategory)
router.delete("/categories/:id", deleteCategory)

//products
router.post("/products/:id", validateProduct ,createProduct)
router.put("/products/:id" ,updateProduct)
router.delete("/products/:id" ,deleteProduct)
router.get("/products", fetchProducts)
router.get("/products/:id", fetchProductDetails)





export default router;
