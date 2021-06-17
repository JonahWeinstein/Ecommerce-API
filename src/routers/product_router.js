const express = require('express')
const Product = require('../models/product')
const auth = require('../middleware/auth')
const Store = require('../models/store')

const router = new express.Router();

// add a product to a store
router.post('/products/:store_id', auth, async (req, res) => {
    try{   
        // see if store exists/does this user have acecss
        const store = await Store.findOne({ where: { id: req.params.store_id, UserId: req.user.id}})
        if(!store){
            return res.status(400).send({error: 'cannot find store'})
        }
        const product = Product.build({
            ...req.body,
            StoreId: req.params.store_id
        }) 
        await product.save()
        res.status(201).send(product)
    } catch (e) {
        res.status(400).send(e)
    }
})

// read all products from a store
router.get('/products/:store_id', auth, async (req, res) => {
    try{
        const products = await Product.findAll({where: {StoreId: req.params.store_id}})
        res.send(products)

    } catch(e) {
        res.status(500).send()
    }
})
// update a product by id
router.patch('/products/:id', async (req, res) => {
     //lets you throw an error when client attempts to update a nonexistent or protected (ex: id) field
     const updates = Object.keys(req.body)
     const allowedUpdates = ['name', 'description', 'quantity', 'price']
     const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
     if (!isValidUpdate){
         return res.status(400).send({ error: 'Invalid Update'})
     }
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
        const product = await Product.findOne({where: {id: req.params.id}})
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