const { Router } = require('express')
const controllers = require('../controllers/products')
const restrict = require('../helpers/restrict')

const router = Router()

router.get('/products', controllers.getProducts)
router.get('/products/:id', controllers.getProduct)
router.post('/products', restrict, controllers.createProduct)
router.put('/products/:id', restrict, controllers.updateProduct)
router.delete('/products/:id', restrict, controllers.deleteProduct)

module.exports = router