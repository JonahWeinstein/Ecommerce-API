const express = require('express');
const { update } = require('../models/cart');
const Cart = require('../models/cart')
const updateCartQuantity = require('../utils/updateCartQuantity')

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
// change cart quantity by id

router.patch('/cart/change/:id', async (req, res) => {
    
    const updates = Object.keys(req.body)
    const allowedUpdates = ['quantity']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidUpdate){
        return res.status(400).send({ error: 'Invalid Update'})
    }
    try{
        const updatedCartItem = await updateCartQuantity(req.params.id, req.body.quantity)
        res.send(updatedCartItem)
    } catch(e) {
        res.status(500).send()
    }

})


module.exports = router