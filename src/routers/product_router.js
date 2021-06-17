const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const Product = require('../models/product')
const Store = require('../models/store')
const auth = require('../middleware/auth')


const router = new express.Router();

// add a product to a store
router.post('/products/add', auth, async (req, res) => {
    try{   
        // see if store exists/does this user have acecss
        const store = await Store.findOne({ where: { id: req.query.store, UserId: req.user.id}})
        if(!store){
            return res.status(404).send({error: 'cannot find store'})
        }
        const product = Product.build({
            ...req.body,
            StoreId: req.query.store
        }) 
        await product.save()
        res.status(201).send(product)
    } catch (e) {
        res.status(400).send(e)
    }
})

// read one product by id 

router.get('/products', auth, async (req, res) => {
    try{
        const store = await Store.findOne({ where: { id: req.query.store, UserId: req.user.id}})
        if(!store){
            return res.status(400).send({error: 'cannot find store'})
        }
        const product = await Product.findOne({where: {id: req.query.product, StoreId: req.query.store}})
        res.send(product)

    } catch(e) {
        res.status(400).send()
    }
} )

// read all products from a store specified in the query string
router.get('/products/all', auth, async (req, res) => {
    try{
        const store = await Store.findOne({ where: { id: req.query.store, UserId: req.user.id}})
        if(!store){
            return res.status(400).send({error: 'cannot find store'})
        }
        const products = await Product.findAll({where: {StoreId: req.query.store}})
        res.send(products)

    } catch(e) {
        res.status(400).send()
    }
})
// products/update?store=9&product=11
// update a product by id using the query string
router.patch('/products/update', auth, async (req, res) => {
     //lets you throw an error when client attempts to update a nonexistent or protected (ex: id) field
     const updates = Object.keys(req.body)
     const allowedUpdates = ['name', 'description', 'quantity', 'price']
     const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
     if (!isValidUpdate){
         return res.status(400).send({ error: 'Invalid Update'})
     }
    try{
        const store = await Store.findOne({ where: { id: req.query.store, UserId: req.user.id}})
        if(!store){
            return res.status(400).send({error: 'cannot find store'})
        }
        const [numberOfAffectedRows, affectedRows] = await Product.update(
            req.body, 
            { where: { id: req.query.product, StoreID: req.query.store }}
    )
    if(numberOfAffectedRows == 0){
        return res.status(404).send() 
    }
    const updatedProduct = await Product.findOne({where: {id:req.query.product}})
    res.send(updatedProduct)
    } catch (e) {
        res.status(400).send()
    }
})

// used to define what kind of uploads are allowed
const upload = multer({
    // listing a dest field will make multer store file in that directory (but you wont have access to it in router call)
    limits: {
        // max filesize in bytes
        fileSize: 1000000
    },
    // file contsains fields relating to the uploaded file
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpeg|jpg|png)$/)){
            return cb(new Error('Please make sure filetype is jpeg, jpg, or png'))
        }
        // callback takes an error and a boolean which states whether to upload or not
        cb(undefined, true)
    }
})
// store and product specified in query string
router.post('/products/image', auth, upload.single('image'), async (req, res) => {
    try {
        const store = await Store.findOne({ where: { id: req.query.store, UserId: req.user.id}})
        if(!store){
            return res.status(400).send({error: 'cannot find store'})
        }
        console.log(store)
        const buffer = await sharp(req.file.buffer).png().resize({ width: 250, height: 250 }).toBuffer()
        const [numberOfAffectedRows, affectedRows] = await Product.update(
            {image: buffer},
            { where: { id: req.query.product, StoreID: req.query.store }}
        )
        if(numberOfAffectedRows == 0){
            return res.status(404).send() 
        }
        const updatedProduct = await Product.findOne({where: {id:req.query.product}})
        res.send(updatedProduct)

    } catch (e) {
        res.status(400).send(e)
    }
    
})


// delete an existing product with store and product in query string
router.delete('/products/delete', auth, async (req, res) => {
    try{
        const store = await Store.findOne({ where: { id: req.query.store, UserId: req.user.id}})
        if(!store){
            return res.status(400).send({error: 'cannot find store'})
        }
        const product = await Product.findOne({where: {id: req.query.product}})
        if(!product){
            return res.status(404).send()
        }
        await Product.destroy({
            where: { id: req.query.product}
        })
        res.send(product)
    } catch (e) {
        res.status(400).send()
    }
})


module.exports = router