const path = require ('path');
const productos = require ('../models/product');


let productsControllers = {

    productDetail: function (req, res) {
        res.render('products/product-detail');
    },

    carrito: function (req, res) {
        res.render('products/carrito');
    },

    AllProducts: function (req, res) {
        res.render('products/productos', {products: productos.getAll()});

    },

}

module.exports = productsControllers;