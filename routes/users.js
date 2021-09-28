import { Router } from 'express'
import * as controllers from '../controllers/users.js'

const router = Router()

router.post('/sign-up', controllers.signUp)
router.post('/sign-in', controllers.signIn)
router.get('/verify', controllers.verify)

// bonus challenge
router.post('/change-password', controllers.changePassword)

// basic routes
router.get('/users/:id', controllers.getUser)
router.get('/users', controllers.getUsers)

// generic nested routes
router.get('/users/:id/products', controllers.getUserProducts)
router.get('/users/:id/products/:productId', controllers.getUserProduct)
router.post('/users/:id/products', controllers.createUserProduct)
router.put('/users/:id/products/:productId', controllers.updateUserProduct)
router.delete('/users/:id/products/:productId', controllers.deleteUserProduct)

// custom nested routes
router.get("/users/:id/cart", controllers.getCart)
router.post("/users/:id/cart/:cartItemId", controllers.addToCart)
router.delete("/users/:id/cart/:cartItemId", controllers.removeFromCart)
router.delete("/users/:id/cart", controllers.clearCart)

export default router
