const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const {Product, Store, Image} = require('../sequelize')
const auth = require('../middleware/auth')


const router = new express.Router();

// add a product to a store
router.post('/stores/:storeId/products/add', auth, async (req, res) => {
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
router.get('/stores/:id/products/all', async (req, res) => {
    try{
        const store = await Store.findOne({ where: { id: req.params.id}})
        if(!store){
            return res.status(400).send({error: 'cannot find store'})
        }
        const products = await Product.findAll({where: {StoreId: req.params.id},
        include: [{model: Image}]})
        res.send(products)

    } catch(e) {
        res.status(400).send(e)
    }
})
// read one product by id 

router.get('/stores/:storeId/products/:id', async (req, res) => {
    try{
        const store = await Store.findOne({ where: { id: req.params.storeId}})
        if(!store){
            return res.status(400).send({error: 'cannot find store'})
        }
        const product = await Product.findOne({where: {id: req.params.id, StoreId: req.params.storeId},
        include: [{model: Image}]})
        res.send(product)

    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }
} )
// products/update?store=9&product=11
// update a product by id using the query string
router.patch('/stores/:storeId/products/:productId/update', auth, async (req, res) => {
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
            return res.status(400).send({error: 'cannot find product'})
        }
        // make sure the store belongs to the user
        if(product.Store.UserId != req.user.id){
            return res.status(400).send({error: 'cannot find store'})
        }
        const [numberOfAffectedRows, affectdRows] = await Product.update(
            req.body, 
            { where: { id: req.params.productId, StoreID: req.params.storeId }}
    )
    if(numberOfAffectedRows == 0){
        return res.status(404).send() 
    }
    const updatedProduct = await Product.findOne({where: {id:req.params.productId}})
    res.send(updatedProduct)
    } catch (e) {
        res.status(400).send()
    }
})
// FOR USE BY END USERS OF ECOMMERCE-SITE
// change product quantity (the only thing user interaction should be allowed to change)
router.patch('/stores/:storeId/products/:productId/updateQuantity', async (req, res) => {
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
// used to define what kind of uploads are allowed
const upload = multer({
    // listing a dest field will make multer store file in that directory (but you wont have access to it in router call)
    limits: {
        // max filesize in bytes
        fileSize: 2000000
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
// add images to the product
router.post('/stores/:storeId/products/:productId/images/add', auth, upload.single('image'), async (req, res) => {
    try {
        const product = await Product.findOne({ where: { id: req.params.productId, StoreId: req.params.storeId}, include: Store})
        // make sure product exists in this store
        if(!product){
            return res.status(400).send({error: 'cannot find product'})
        }
        // make sure the store belongs to the user
        if(product.Store.UserId != req.user.id){
            return res.status(400).send({error: 'cannot find store'})
        }
        const buffer = await sharp(req.file.buffer).png().resize({ width: 250, height: 250 }).toBuffer()
        const image = await Image.create(
            {
                data: buffer,
                ProductId: req.params.productId,
                order: req.body.order
            }
        )
        res.send(image)

    } catch (e) {
        res.status(400).send(e)
    }
    
})
// delete a product image by storeid, prodictid, imageid in query string
router.delete('/stores/:storeId/products/:productId/images/:imageId/delete', auth, async (req, res) => {
    try{
        const product = await Product.findOne({ 
            where: { id: req.params.productId, StoreId: req.params.storeId}, 
            include: [{model: Store}]
        })
        if(!product){
            return res.status(400).send({error: 'cannot find product'})
        }
        // make sure the store belongs to the user
        if(product.Store.UserId != req.user.id){
            return res.status(400).send({error: 'cannot find store'})
        }
        await Image.destroy({where: {id: req.params.imageId, ProductId: req.params.productId}})
        // still need to send something back to avoid unexpected end of JSON input in client
        res.send(product)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})
//get all images for a product

router.get('/products/images', auth, async (req, res) => {
    
    const product = await Product.findOne({ 
        where: { id: req.query.product, StoreId: req.query.store}, 
        include: [{ model: Image}, {model: Store}]
    })
    // make sure product exists in this store
    if(!product){
        return res.status(400).send({error: 'cannot find product'})
    }
    // make sure the store belongs to the user
    if(product.Store.UserId != req.user.id){
        return res.status(400).send({error: 'Unauthorized'})
    }
    
    res.send(product.Images)
})


// delete an existing product with store and product in query string
router.delete('/stores/:storeId/products/:productId/delete', auth, async (req, res) => {
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