const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.get('/categories', productController.getAllCategories);
router.get('/:slug', productController.getProductBySlug);

module.exports = router;
