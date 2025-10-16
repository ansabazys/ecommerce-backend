import express from 'express'
import { addToCart, deleteCartItem, getCartItems, updateCartItem } from '../controllers/cartController.js'
import { checkUser } from '../middlewares/checkAuth.js'
import { createOrder, getOrders, updateOrder } from '../controllers/orderController.js'

const router = express.Router()

router.use(checkUser)
//cart
router.get("/cart" ,getCartItems)
router.post("/cart/:id" ,addToCart)
router.delete("/cart/:id" ,deleteCartItem)
router.put("/cart/:id" ,updateCartItem)

//order
router.get("/orders", getOrders)
router.post("/orders", createOrder)
router.put("/orders/:id", updateOrder)


export default router