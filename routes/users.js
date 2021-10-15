import { Router } from 'express'
import * as controllers from '../controllers/users.js'
import isLoggedIn from '../helpers/isLoggedIn.js'
import isManager from '../helpers/isManager.js'

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
router.post('/users/:id/products', isManager, controllers.createUserProduct)
router.put('/users/:id/products/:productId', isManager, controllers.updateUserProduct)
router.delete('/users/:id/products/:productId', isManager, controllers.deleteUserProduct)

// custom nested routes
router.get("/users/:id/cart", controllers.getCart)
router.post("/users/:id/cart/:cartItemId", isLoggedIn, controllers.addToCart)
router.delete("/users/:id/cart/:cartItemId", isLoggedIn, controllers.removeFromCart)
router.delete("/users/:id/cart", isLoggedIn, controllers.clearCart)

export default router
