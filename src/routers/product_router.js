const express = require('express')
const Product = require('../models/product')

const router = new express.Router();

// add a new product
router.post('/products', async (req, res) => {
    const product = Product.build(req.body)
    try{    
        await product.save()
        res.status(201).send(product)
    } catch (e) {
        res.status(400).send(e)
    }
})
// update a product by id
router.patch('/products/:id', async (req, res) => {
    try{
    const [numberOfAffectedRows, affectedRows] = await Product.update(
        req.body, 
        {
            where: { id: req.params.id}
        }
    )
    if(numberOfAffectedRows == 0){
        return res.status(404).send() 
    }
    const updatedProduct = await Product.findOne({where: {id:req.params.id}})
    res.send(updatedProduct)
    } catch (e) {
        res.status(400).send()
    }
})

// delete an existing product
router.delete('/products/:id', async (req, res) => {
    try{
        const product = await Product.findOne({id: req.params.id})
        console.log(product)
        if(!product){
            return res.status(404).send()
        }
        await Product.destroy({
            where: { id: req.params.id}
        })
        res.send(product)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router