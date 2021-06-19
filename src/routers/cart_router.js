const express = require('express');
const {Cart, Product} = require('../models/sequelize')
const updateCartQuantity = require('../utils/updateCartQuantity')

const router = new express.Router();

// add product to cart

router.post('/cart/add', async (req, res) => {
    // check if product is already in cart
    const cartCurrent = await Cart.findOne({where: {ProductId: req.body.ProductId}, include: Product})
    // get new total cart quantity
    if(cartCurrent){
        const newQuantity = cartCurrent.dataValues.cart_quantity +req.body.cart_quantity
        // make sure new quanitity isn't greater than product quantity (inventory)
        if(newQuantity>cartCurrent.Product.dataValues.quantity){
            return res.status(400).send({error: 'Not Enough Inventory'})
        }

        try {
            const updatedCartItem = await updateCartQuantity(req.body.ProductId, newQuantity)
            return res.send(updatedCartItem)
        } catch (e) {
            return res.status(500).send()
        }
    }
    const product = await Product.findOne({where: {id: req.body.ProductId}})
    if(!product){
        return res.status(400).send({error: 'cannot find product'})
    }
    if(product.cart_quantity < req.body.cart_quantity){
        return res.status(400).send({error: 'Not Enough Inventory'})
    }
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
        const products = await Cart.findAll({include: [Product]})
        res.send(products)

    } catch(e) {
        res.status(500).send()
    }
})
// change cart quantity by id

router.patch('/cart/change/:id', async (req, res) => {
    // only allow upadtes to cart item quantity
    const updates = Object.keys(req.body)
    const allowedUpdates = ['cart_quantity']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidUpdate){
        return res.status(400).send({ error: 'Invalid Update'})
    }
    try{
        const updatedCartItem = await updateCartQuantity(req.params.id, req.body.cart_quantity)
        // if quantity is changed to 0, remove the product from cart
        if(updatedCartItem.dataValues.cart_quantity <= 0){
            await Cart.destroy({ where: {id: updatedCartItem.dataValues.id}})
            return res.send()
        }
        res.send(updatedCartItem)
    } catch(e) {
        res.status(500).send()
    }
})


module.exports = router