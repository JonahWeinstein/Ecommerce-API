const express = require('express')
const {Store} = require('../sequelize')
const requireLogin = require('../middleware/requireLogin');

const router = new express.Router();

router.post('/api/stores/add', requireLogin, async (req, res) => {
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
router.get('/api/stores', requireLogin, async (req, res) => {
    try{
        const allStores = await Store.findAll({where: { UserId: req.user.id }})
        
        res.send(allStores)
    } catch (e) {
        res.status(400).send(e)
    }
})

// delete a store by id
router.delete('/api/stores/:id/delete', requireLogin, async (req, res) => {
    try {
        await Store.destroy({where: {id: req.params.id, UserId: req.user.id}})
        res.send({})
    } catch (e) {
        res.status(400).send(e)
    }
})


module.exports = router