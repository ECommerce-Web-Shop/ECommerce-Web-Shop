'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async getWishLists(ctx) {
        // If user has already logged in, return user's cart
        if (ctx.request.header && ctx.request.header.authorization) {
            try {
                // Get user's id from request header
                const  {
                    id: user_id,
                    // user: user_name,
                    // user_name: user_name,
                } = await strapi.plugins['users-permissions'].services.jwt.getToken(ctx);
                // await console.log(a);
                // Find user's cart in database
                let userWishLists = await strapi.query('wish-list').model.findOne({
                    user: user_id
                });

                // If user's cart is not exist, create a new cart for user
                if (!userWishLists){
                    userWishLists = await strapi.query('wish-list').create({
                        user: user_id,
                        products: [],
                    });
                    
                }

                // Return user's cart
                return await strapi.query("wish-list").findOne({
                    user: user_id
                })

            } catch (error) {
                console.log(error);
                throw error;
            }
        }
        throw new Error('You must login before getting your wishList');
    },

    async getCountUser(ctx) {
        const {
            _productId: productId
        } = ctx.request.query;

        // Find all wishlist
        let wishlists = await strapi.query('wish-list').model.find({});

        // Filter wishlists which has product want to count users
        wishlists = wishlists.filter(wishlist => {
            const tmp = wishlist.products.filter(product => {
                if (product == productId)
                    return true;
                return false;
            });
            return (tmp.length > 0) ? true : false;
        });


        return wishlists.length;
    },

    async addProductToWishList(ctx) {
        // If user has already logged in, add item to user's cart
        if (ctx.request.header && ctx.request.header.authorization) {
            try {
                // Get user's id from request header
                const {
                    id: user_id
                } = await strapi.plugins['users-permissions'].services.jwt.getToken(ctx);

                // Get item input from request
                let productId = ctx.request.body.productId;

                // Find user's cart in database
                let userWishLists = await strapi.query('wish-list').model.findOne({
                    user: user_id
                });
                console.log(userWishLists);
                // If user's cart is not exist, create a new cart for user
                if (!userWishLists)
                    userWishLists = strapi.query('wish-list').model.create({
                        user: user_id,
                        products: [productId],

                    });
                else {
                    // Get old items in user's cart
                    const oldProducts = userWishLists.products;

                    // Add new item to user's cart
                    userWishLists.products = [productId, ...oldProducts];

                    // Save user's cart to db
                    await userWishLists.save();
                }

                // Return 
                //   return await strapi.query("wish-list").find({_id:userWishLists._id}) 
                return true;
            } catch (error) {

                return false;
            }
        }
        throw new Error('You must login before adding item to your cart');
    },
    async removeItemsInWishList(ctx){
        if(ctx.request.header && ctx.request.header.authorization) {
            try {
                // Get user's id from request header
                const { id: user_id } = await strapi.plugins['users-permissions'].services.jwt.getToken(ctx);

                // Get product id input 
                let productId = ctx.request.body.productId;
                console.log(productId);
                // Find wish list of user
                let userWishLists = await strapi.query('wish-list').model.findOne({
                    user: user_id
                });
                
                const m = userWishLists.products.filter((product) => product != productId);
                console.log(m);
                userWishLists.products = m;
                await userWishLists.save();
                return await strapi.query("wish-list").findOne({
                    user: user_id
                })
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    },
    async checkProductInWishList(ctx) {
        // If user has already logged in, remove item from user's cart
        if(ctx.request.header && ctx.request.header.authorization) {
            try {
                // Get user's id from request header
                const { id: user_id } = await strapi.plugins['users-permissions'].services.jwt.getToken(ctx);

                // Get product id input 
                const {
                    _productId: productId
                } = ctx.request.query;
                console.log(productId);
                // Find wish list of user
                let userWishLists = await strapi.query('wish-list').model.findOne({
                    user: user_id
                });

                    console.log(userWishLists);
                if(userWishLists == null)
                    return false;
                else 
                   {
                    const m = userWishLists.products.filter((product) => product == productId);
                    console.log(m);
                    if(m.length == 0)
                        return false;
                    else
                        return true ;
                   }

            } catch (error) {
                console.log(error);
                throw error;
            }
        }
        throw new Error('You must login before removing product from your wish list ');
    },

    
};