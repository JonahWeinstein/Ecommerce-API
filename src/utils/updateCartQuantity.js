const Cart = require('../models/cart')



const updateCartQuantity = async (product_id, newQuantity) => {
        await Cart.update(
            {
                quantity: newQuantity
            },
            {
                where: { product_id: product_id}
            }
        )
        const updatedProduct = await Cart.findOne({where: {product_id:product_id}})
        return updatedProduct
}
module.exports = updateCartQuantity