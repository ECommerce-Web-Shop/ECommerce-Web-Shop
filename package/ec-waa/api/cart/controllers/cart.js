'use strict';
const { ObjectId } = require('mongodb');
const cart = require('../services/cart');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async getCart(ctx) {
        // Get cart id from request
        const { _cartId: cartId} = ctx.request.query;

        // Retrieve cart in database
        let cart = await strapi.query('cart').model.findById(cartId);

        try {
            // If user has already logged in, return both cart and user's cart
            if(ctx.request.header && ctx.request.header.authorization) {
                // Get user's id from request header
                const { id: userId } = await strapi.plugins['users-permissions'].services.jwt.getToken(ctx);

                // If cart is belongs to user, only return this cart
                if(cart && cart.user == userId) 
                    return await strapi.services.cart.displayCart(cart._id);

                // Retrieve user's cart
                let userCart = await strapi.query('cart').model.findOne({user: userId});

                // If user's cart is not exist, create a new user's cart
                if(!userCart)
                    userCart = await strapi.query('cart').model.create({
                        user: userId,
                        items: []
                    });

                // If cart is exist, merge it to user's cart then delete it
                if(cart) {
                    userCart.items = [...userCart.items, ...cart.items];
                    userCart.coupon = cart.coupon;

                    // Save user's cart and delete cart
                    await Promise.all([userCart.save(), strapi.query('cart').model.findByIdAndDelete(cart._id)]);
                }

                // Return user's cart
                return await strapi.services.cart.displayCart(userCart._id);

            } else { // If user has not logged in, only return the cart 
                // If cart is not exist, create a new cart
                if(!cart) 
                    cart = await strapi.query('cart').create({
                        items: []
                    });
                
                // Return cart
                return await strapi.services.cart.displayCart(cart._id);
            }
            
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    async addItemToCart(ctx) {
        try {
            // Get cart id from request
            const { cartId, newItem: newItemInput } = ctx.request.body;
    
            // Find item's product in database
            const [ product ] = await strapi.query('product').model.aggregate([
                { "$match": { "_id": new ObjectId(newItemInput.product) } },
                {
                    "$lookup": {
                        "from": "components_product_options",
                        "localField": "options.ref",
                        "foreignField": "_id",
                        "as": "options"
                    }
                },
                {
                    "$project": {
                    "options": 1
                    }
                },
            ]);

            // Check color & quantity input is valid or not
            let checkColorValid = false;
            let checkQuantityValid = false;

            product.options.forEach(option => {
                if(option.color === newItemInput.color) {
                    checkColorValid = true;

                    if(newItemInput.qty > 0 && newItemInput.qty <= option.quantityInStock)
                        checkQuantityValid = true;
                }
            });

            if(!checkColorValid)
                throw new Error('Color which you choose is not valid');

            if(!checkQuantityValid)
                throw new Error('Quantity which you provide is great than stock quantity');
            
    
            // Create cart's item record
            let newItem = await strapi.query('ordered-item').model.create({
                product: newItemInput.product,
                color: newItemInput.color,
                qty: newItemInput.qty,
                selected: true,
            });

            // Find cart in database
            let cart = await strapi.query('cart').model.findById(cartId);

            // If cart is not exist, create a new cart 
            if(!cart) 
                cart = strapi.query('cart').model.create({
                    items: [ newItem._id ]
                });
            else {
                // Get old items in user's cart
                const oldItems = cart.items;

                // Add new item to user's cart
                cart.items = [ newItem._id, ...oldItems ];
                
                // Save user's cart to db
                await cart.save();
            }
            
            // Return user's cart
            return await strapi.services.cart.displayCart(cart._id);

        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    async removeItemFromCart(ctx) {
        try {
            // Get id of item need to be removed in database
            const { cartId, itemId } = ctx.request.body;
    
            // Find item need to be removed in database
            const itemNeedBeRemoved = await strapi.query('ordered-item').model.findById(itemId);
    
            // If no exist that item, throw an error
            if(!itemNeedBeRemoved)
                throw new Error(`Cannot remove item with id ${itemId} because that item is not exist`);

            // Find cart in database
            let cart = await strapi.query('cart').model.findById(cartId);
            
            // If user's cart is not exist, create a new cart for user
            if(!cart) {
                cart = await strapi.query('cart').model.create({
                    items: []
                });

                // Return user's cart
                return await strapi.services.cart.displayCart(cart._id);
            }

            // Declare new items array && boolean variable to check item is in user's cart or not
            let newItems = [];
            let itemNeedToBeRemoveIsInCart = false;

            // Delete item need be removed by creating new item array without that item
            cart.items.forEach(item => {
                if(item.toString() !== itemId) 
                    newItems.push(item);
                else
                    itemNeedToBeRemoveIsInCart = true
            });

            // If item need to be remove is not in user's cart, throw new error
            if(!itemNeedToBeRemoveIsInCart) 
                throw new Error(`Cannot remove item with id ${itemId} because that item is not in your cart`)

            // If item is in user's cart, it can be to delete in database
            await strapi.query('ordered-item').model.findByIdAndDelete(itemId);

            // Remove that item from user's cart & modify total price
            cart.items = newItems;

            // Save user's cart to db
            await cart.save();
            
            // Return user's cart
            return await strapi.services.cart.displayCart(cart._id);

        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    async incrementItemQuantity(ctx) {
        try {
            // Get id of item need to be removed in database
            const { cartId, itemId, by } = ctx.request.body;

            // If increment quantity is not valid, throw an error
            if(by < 1)
                throw new Error(`Increment quantity is not valid`);
    
            // Get cart based on cart id and item id
            const cart = await strapi.services.cart.getCartToChangeItemQuantity(cartId, itemId);

            // If cart is not exist, throw an error
            if(!cart) 
                throw new Error(`Cannot increase item quantity because the cart with ID ${cartId} or the item with ID ${itemId} is not exist`);

            // If increment quantity is greater than product's stock quantity, throw an error
            const { product } = cart.item;

            if (product.option.quantityInStock < cart.item.qty + by) 
                throw new Error(`Increment quantity is greater than product's stock quantity`);

            // Increase item quantity
            const item = await strapi.query('ordered-item').model.findById(itemId);
            item.qty += by;
            await item.save();
            
            // Return user's cart
            return await strapi.services.cart.displayCart(cartId);

        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    async decrementItemQuantity(ctx) {
        try {
            // Get id of item need to be removed in database
            const { cartId, itemId, by } = ctx.request.body;

            // If increment quantity is not valid, throw an error
            if(by < 1)
                throw new Error(`Cannot decrease item quantity because decrement quantity is not valid`);
    
            // Get cart based on cart id and item id
            const cart = await strapi.services.cart.getCartToChangeItemQuantity(cartId, itemId);

            // If cart is not exist, throw an error
            if(!cart) 
                throw new Error(`Cannot decrease item quantity because the cart with ID ${cartId} or the item with ID ${itemId} is not exist`);

            // If decrement quantity is greater than item quantity, throw an error

            if (cart.item.qty <= by) 
                throw new Error(`Cannot decrease item quantity because decrement quantity is equal or greater than item quantity`);

            // Decrease item quantity
            const item = await strapi.query('ordered-item').model.findById(itemId);
            item.qty -= by;
            await item.save();
            
            // Return user's cart
            return await strapi.services.cart.displayCart(cartId);

        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    async applyCoupon(ctx) {
        try {
            // Get cart id, coupon code from  request header
            const { cartId, couponCode } = ctx.request.body;

            // Find coupon in database
            const coupon = await strapi.query('coupon').model.findOne({ code: couponCode }).lean();

            // If coupon is not exist, throw an error
            if(!coupon)
                throw new Error(`Coupon with code ${couponCode} is not valid`);     
            
            // Find cart in database
            let cart = await strapi.query('cart').model.findById(cartId);

            // If cart is not exist, create a new cart
            if(!cart) 
                cart = await strapi.query('cart').model.create({
                    items: []
                });

            cart.coupon = coupon._id;

            await cart.save();
            
            // Return user's cart
            return await strapi.services.cart.displayCart(cart._id);

        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    async removeCoupon(ctx) {
        try {
            // Get cart id from  request header
            const { cartId } = ctx.request.body;

            // Find cart in database
            let cart = await strapi.query('cart').model.findById(cartId);

            // If user's cart is not exist, create a new cart without coupon for user
            if(!cart) 
                cart = await strapi.query('cart').model.create({
                    items: []
                });
            else {
            // Else remove coupon
                cart.coupon = undefined;
                cart.couponIsValid = true;

                await cart.save();
            }
            
            // Return user's cart
            return await strapi.services.cart.displayCart(cart._id);

        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    async toggleSelect(ctx) {
        try {
            // Get cart id, item id and value to change
            const { cartId, itemId, value } = ctx.request.body;
    
            // Find item in database
            const item = await strapi.query('ordered-item').model.findById(itemId);
    
            // If no exist that item, throw an error
            if(!item)
                throw new Error(`Cannot toggle select item with id ${itemId} because that item is not exist`);

            // Find cart in database
            let cart = await strapi.query('cart').model.findById(cartId).lean();
            
            // If user's cart is not exist, create a new cart for user
            if(!cart) {
                cart = await strapi.query('cart').model.create({
                    items: []
                }).lean();

                // Return user's cart
                return await strapi.services.cart.displayCart(cart._id);
            }

            // If item need to be toggle select is not in user's cart, throw new error
            const itemIndex = cart.items.findIndex(item => (item == itemId) ? true : false);
            if(itemIndex === -1) 
                throw new Error(`Cannot toggle select item with id ${itemId} because that item is not in your cart`);

            // If item is in user's cart, toggle select for it
            await strapi.query('ordered-item').model.findByIdAndUpdate(itemId, {
                selected: value
            });
            
            // Return user's cart
            return await strapi.services.cart.displayCart(cart._id);

        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    async toggleSelectAll(ctx) {
        try {
            // Get cart id & value to set
            const { cartId, value } = ctx.request.body;

            // Find cart in database
            let cart = await strapi.query('cart').model.findById(cartId).lean();
            
            // If user's cart is not exist, create a new cart for user
            if(!cart) {
                cart = await strapi.query('cart').model.create({
                    items: []
                }).lean();

                // Return user's cart
                return await strapi.services.cart.displayCart(cart._id);
            }

            // Select all items in cart
            await strapi.query('ordered-item').model.updateMany({ _id: { $in: cart.items }}, {
                selected: value
            });
            
            // Return user's cart
            return await strapi.services.cart.displayCart(cart._id);

        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    async removeSelectedItems(ctx) {
        try {
            // Get cart id
            const { cartId } = ctx.request.body;

            // Find cart in database
            let cart = await strapi.query('cart').model.findById(cartId);
            
            // If user's cart is not exist, create a new cart for user
            if(!cart) {
                cart = await strapi.query('cart').model.create({
                    items: []
                }).lean();

                // Return user's cart
                return await strapi.services.cart.displayCart(cart._id);
            }

            // Delete selected items
            const deletedItems = await strapi.query('ordered-item').delete({ 
                id_in: cart.items,
                selected: true
            }, []);

            console.log(deletedItems);

            // Remove deleted items from cart
            cart.items = cart.items.filter(item => {
                const index = deletedItems.findIndex(deletedItem => {
                    return deletedItem._id == item;
                });
                
                return (index === -1);
            });

            await cart.save();
            
            // Return user's cart
            return await strapi.services.cart.displayCart(cart._id);

        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    async changeItemColor(ctx) {
        try {
            // Get cart id and item id
            const { cartId, itemId, color } = ctx.request.body;
    
            // Find item need to be changed color
            const itemNeedToBeChanged = await strapi.query('ordered-item').model.findById(itemId);
    
            // If no exist that item, throw an error
            if(!itemNeedToBeChanged)
                throw new Error(`Cannot chang color of item with id ${itemId} because that item is not exist`);

            // Find cart in database
            let cart = await strapi.query('cart').model.findById(cartId);
            
            // If user's cart is not exist, create a new cart for user
            if(!cart) {
                cart = await strapi.query('cart').model.create({
                    items: []
                });

                // Return user's cart
                return await strapi.services.cart.displayCart(cart._id);
            }

            // Check item is in cart or not
            console.log(cart.items);
            const itemIndex = cart.items.findIndex(item => item == itemId);
            console.log(itemNeedToBeChanged._id)
            console.log(itemIndex);

            if(itemIndex === -1)
                throw new Error(`Cannot change color of item with id ${itemId} because that item is not in your cart`);
            
            // Retrieve item's product
            const [ product ] = await strapi.query('product').model.aggregate([
                { "$match": { "_id": new ObjectId(itemNeedToBeChanged.product) } },
                {
                    "$lookup": {
                        "from": "components_product_options",
                        "localField": "options.ref",
                        "foreignField": "_id",
                        "as": "options"
                    }
                },
                {
                    "$project": {
                    "options": 1
                    }
                },
            ]);

            // Check color input is valid or not
            const colorIsValid = product.options.some(option => option.color === color);

            if(!colorIsValid)
                throw new Error(`Cannot change color of item with id ${itemId} because the color input is not valid`);

            // Change item color
            itemNeedToBeChanged.color = color;
            await itemNeedToBeChanged.save();

            // Return user's cart
            return await strapi.services.cart.displayCart(cart._id);

        } catch (error) {
            console.log(error);
            throw error;
        }
    }
};
