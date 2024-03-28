const productService = require ('../models/productService');


let productsControllers = {

    detail: function (req, res) {
        let productId = (productService.getBy(req.params.id));
        res.render('products/detail', {productId});
    },

    detailEdit: function (req, res) {
        res.redirect('/products/edit')
    },

    detailAll: function (req, res) {
        res.send('Producto agregado al carrito');
    },


    cart: function (req, res) {
        res.render('products/cart');
    },


    create: function (req, res) {
        res.render('products/create');
    },

    edit: function (req, res) {
        res.render('products/edit');
    },

    getAll: function (req, res) {
        res.render('products/products', {products: productService.getAll()});

    }

}

module.exports = productsControllers;