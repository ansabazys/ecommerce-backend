import express from 'express'
import {getCurrentUser, loginUser, logoutUser, registerUser} from '../controllers/userController.js'
import { validateUser } from '../middlewares/validate.js'
import { checkAuth } from '../middlewares/checkAuth.js'
import checkExist from '../middlewares/checkExist.js'
import { getCategories } from '../controllers/categoryController.js'
import { fetchProduct, fetchProducts } from '../controllers/productController.js'
const router = express.Router()



router.get("/me",checkAuth ,getCurrentUser)
router.post("/register", validateUser , checkExist ,registerUser)
router.post("/login", validateUser, loginUser)
router.delete("/logout", checkAuth, logoutUser)


//categories
router.get("/categories", getCategories)

//products
router.get("/products", fetchProducts)
router.get("/products/:id", fetchProduct)


export default router