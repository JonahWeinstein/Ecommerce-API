const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const {Product, Store, Image} = require('../sequelize')
const requireLogin = require('../middleware/requireLogin');

const router = new express.Router();
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
//get all images for a product

router.get('/api/products/images', requireLogin, async (req, res) => {
    
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
// store and product specified in query string
// add images to the product
router.post('/api/stores/:storeId/products/:productId/images/add', requireLogin, upload.single('image'), async (req, res) => {
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
router.delete('/api/stores/:storeId/products/:productId/images/:imageId/delete', requireLogin, async (req, res) => {
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
        res.status(400).send(e)
    }
})
// update an images order
router.patch('/api/stores/:storeId/products/:productId/images/:imageId/update', requireLogin, async (req, res) => {
    try {
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
        const [numberOfAffectedRows, affectdRows] = await Image.update(
            req.body,
            {where: {id: req.params.imageId, ProductId: req.params.productId }}
        )
        if(numberOfAffectedRows == 0){
            return res.status(404).send()
        }
        const updatedImage = await Image.findOne({where: {id:req.params.imageId}})
        res.send(updatedImage)
    } catch(e) {
        res.status(400).send(e)
    }
    

    
})


module.exports = router;