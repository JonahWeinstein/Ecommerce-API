const express = require('express')
const {Product, Store, Image} = require('../sequelize')
const auth = require('../middleware/auth')
const requireLogin = require('../middleware/requireLogin');




const router = new express.Router();

// add a product to a store
router.post('/api/stores/:storeId/products/add', requireLogin, async (req, res) => {
    try{   
        // see if store exists/does this user have acecss
        const store = await Store.findOne({ where: { id: req.params.storeId, UserId: req.user.id}})
        if(!store){
            return res.status(404).send({error: 'cannot find store'})
        }
        const product = Product.build({
            ...req.body,
            StoreId: req.params.storeId
        }) 
        await product.save()
        res.status(201).send(product)
    } catch (e) {
        res.status(400).send(e)
    }
})

// unauthenticated routes used both for cms users and ecommerce sites
// read all products from a store specified in the query string
router.get('/api/stores/:id/products/all', requireLogin, async (req, res) => {
    try{
        const store = await Store.findOne({ where: { id: req.params.id, UserId: req.user.id}})
        if(!store){
            return res.status(404).send({error: 'cannot find store'})
        }
        const products = await Product.findAll({where: {StoreId: req.params.id},
        include: [{model: Image}]})
        res.send(products)

    } catch(e) {
        res.status(400).send()
    }
})
// read one product by id 

router.get('/api/stores/:storeId/products/:id', requireLogin, async (req, res) => {
    if (!req.user) {
        return res.status(401).send({error: 'please authenticate'})
    }
    try{
        const store = await Store.findOne({ where: { id: req.params.storeId, UserId: req.user.id}})
        if(!store){
            return res.status(404).send({error: 'cannot find store'})
        }
        const product = await Product.findOne({where: {id: req.params.id, StoreId: req.params.storeId},
        include: [{model: Image}]})
        if(!product) {
            return res.status(404).send({error: 'cannot find product'})
        }
        res.send(product)

    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }
} )
// products/update?store=9&product=11
// update a product by id using the query string
router.patch('/api/stores/:storeId/products/:productId/update', requireLogin, async (req, res) => {
    
     //lets you throw an error when client attempts to update a nonexistent or protected (ex: id) field
     const updates = Object.keys(req.body)
     const allowedUpdates = ['name', 'description', 'quantity', 'price']
     const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
     if (!isValidUpdate){
         return res.status(400).send({ error: 'Invalid Update'})
     }
     
    try{
        const product = await Product.findOne({ where: { StoreId: req.params.storeId, id: req.params.productId}, include: Store})
        // make sure product exists in this store
        if(!product){
            return res.status(404).send({error: 'cannot find product'})
        }
        // make sure the store belongs to the user
        if(product.Store.UserId != req.user.id){
            return res.status(404).send({error: 'cannot find store'})
        }
        const [numberOfAffectedRows, affectdRows] = await Product.update(
            req.body, 
            { where: { id: req.params.productId, StoreID: req.params.storeId }}
    )
    if(numberOfAffectedRows == 0){
        return res.status(404).send() 
    }
    const updatedProduct = await Product.findOne({where: {id: req.params.productId, StoreId: req.params.storeId},
        include: [{model: Image}]})
    res.send(updatedProduct)
    } catch (e) {
        res.status(400).send(e)
    }
})
// FOR USE BY END USERS OF ECOMMERCE-SITE
// change product quantity (the only thing user interaction should be allowed to change)
router.patch('/api/stores/:storeId/products/:productId/updateQuantity', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['quantity']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidUpdate){
        return res.status(400).send({ error: 'Invalid Update'})
    }
    try {
        const product = await Product.findOne({ where: { StoreId: req.params.storeId, id: req.params.productId}, include: Store})
        // make sure product exists in this store
        if(!product){
            return res.status(400).send({error: 'cannot find product'})
        }
    } catch (e) {

    }
})




// delete an existing product with store and product in query string
router.delete('/api/stores/:storeId/products/:productId/delete', requireLogin, async (req, res) => {
    try{
        const store = await Store.findOne({ where: { id: req.params.storeId, UserId: req.user.id}})
        if(!store){
            return res.status(400).send({error: 'cannot find store'})
        }
        const product = await Product.findOne({where: {id: req.params.productId}})
        if(!product){
            return res.status(404).send()
        }
        await Product.destroy({
            where: { id: req.params.productId}
        })
        res.send(product)
    } catch (e) {
        res.status(400).send()
    }
})


module.exports = router