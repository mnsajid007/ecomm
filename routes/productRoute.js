const express = require('express');
const { createProductCon, getAllProduct, getSingleProd, deleteProduct, getPhoto, updateProduct, filterProd, productCount, productList, searchProduct, braintreeToken, braintreePayment, orderDetails } = require('../controller/productController');
const formidable = require('express-formidable');
const { requireSignIn } = require('../middleware/authMiddleware');
const router = express.Router();

//create product
router.post('/create-product', formidable(), createProductCon);

//update product
router.put('/update-product/:pid', formidable(), updateProduct);

//get Product
router.get('/get-product', getAllProduct);

//get singleProduct
router.get('/get-product/:slug', getSingleProd);

//get single photo
router.get('/get-photo/:pid', getPhoto)

//delete product 
router.delete('/delete-product/:pid', deleteProduct);

router.post('/filter-product', filterProd);

//count controller 
router.get('/product-count', productCount);

//page count
router.get('/product-list/:page', productList);

//search route
router.get('/search', searchProduct);

//braintree token route
router.get('/braintree/token', braintreeToken);

//braintree payment process
router.post('/braintree/payment', requireSignIn, braintreePayment)

router.get('/order', requireSignIn, orderDetails);

module.exports = router;