import { Router } from 'express'
import * as controllers from '../controllers/users.js'

const router = Router()

router.post('/sign-up', controllers.signUp)
router.post('/sign-in', controllers.signIn)
router.get('/verify', controllers.verify)
router.post('/change-password', controllers.changePassword)

router.get('/users/:id/products', controllers.getUserProducts)
router.get('/users/:id/products/:productId', controllers.getUserProduct)
router.post('/users/:id/products', controllers.createUserProduct)
router.put('/users/:id/products/:productId', controllers.updateUserProduct)
router.delete('/users/:id/products/:productId', controllers.deleteUserProduct)

export default router
