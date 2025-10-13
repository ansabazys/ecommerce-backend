import express from 'express'
import { addToCart, deleteCartItem, getCartItems } from '../controllers/cartController.js'
import { checkUser } from '../middlewares/checkAuth.js'
import { createOrder, getOrders, updateOrder } from '../controllers/orderController.js'

const router = express.Router()

//cart
router.get("/cart/:id", checkUser ,getCartItems)
router.post("/cart/:id", checkUser ,addToCart)
router.delete("/cart/:id", checkUser ,deleteCartItem)

//order
router.get("/orders", checkUser, getOrders)
router.post("/orders", checkUser, createOrder)
router.put("/orders/:id", checkUser, updateOrder)


export default router