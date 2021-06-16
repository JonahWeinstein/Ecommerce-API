const express = require('express')
const Store = require('../models/store')
const auth = require('../middleware/auth')

const router = new express.Router();

router.post('/stores/add', auth, async (req, res) => {
    try{
        const store = Store.build({
            ...req.body,
            UserId: req.user.id
        })
        await store.save()
        res.status(201).send(store)
    } catch(e) {
        res.status(400).send(e)
    }
})

// get all your stores
router.get('/stores', auth, async (req, res) => {
    try{
        const allStores = await Store.findAll({where: { UserId: req.user.id }})
        res.send(allStores)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router