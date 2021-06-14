const Cart = require('../models/cart')


// returns updated cart item
const updateCartQuantity = async (product_id, newQuantity) => {   
    await Cart.update(
            { cart_quantity: newQuantity }, { where: {ProductId: product_id}}
        )
        const updatedProduct = await Cart.findOne({where: { ProductId: product_id }})
        return updatedProduct
}
module.exports = updateCartQuantity