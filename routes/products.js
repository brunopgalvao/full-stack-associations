import { Router } from 'express'
import * as controllers from '../controllers/products.js'
import isManager from '../helpers/isManager.js'

const router = Router()

router.get('/products', controllers.getProducts)
router.get('/products/:id', controllers.getProduct)
router.post('/products', isManager, controllers.createProduct)
router.put('/products/:id', isManager, controllers.updateProduct)
router.delete('/products/:id', isManager, controllers.deleteProduct)

export default router
