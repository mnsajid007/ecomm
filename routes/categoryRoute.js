const express = require('express');
const { requireSignIn, isAdmin } = require('../middleware/authMiddleware');
const { createCategoryCon, updateCategory, deleteCategory, getAllCategory, singleCategory } = require('../controller/categoryController');

const route = express.Router();

route.post('/create-category', requireSignIn, isAdmin, createCategoryCon);

//update category
route.put('/update-category/:id', requireSignIn, isAdmin, updateCategory);

//delete category
route.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategory);

//delete category
route.get('/all-category',  getAllCategory);

//single category
route.get('/single-category/:slug', singleCategory)

module.exports = route;