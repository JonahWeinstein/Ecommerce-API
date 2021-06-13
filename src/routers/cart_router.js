const express = require('express')
const Cart = require('../models/cart')

const router = new express.Router();

// add product to cart

router.post('/cart/add', async (req, res) => {
    const cartItem = Cart.build(req.body)
    try{    
        await cartItem.save()
        res.status(201).send(cartItem)
    } catch (e) {
        res.status(400).send(e)
    }
})

// read all cart items

router.get('/cart', async (req, res) => {
    try{
        const products = await Cart.findAll()
        res.send(products)

    } catch(e) {
        res.status(500).send()
    }
})


module.exports = router