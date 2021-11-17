

module.exports = {
    query: `
    getWishLists: WishList!,
    checkProductInWishList(productId: ID!): Boolean!,
    getCountUser(productId: ID!): Int!,
   
    `,
    mutation: `
    addProductToWishList(productId: ID!): Boolean!,
    removeItemsInWishList(productId: ID!):  WishList!,
    `,
    resolver: {
        Query: {
            getWishLists: {
                description: 'Get user wish list',
                resolver: 'application::wish-list.wish-list.getWishLists',
            },
            getCountUser: {
                description: 'Get count user cart',
                resolver: 'application::wish-list.wish-list.getCountUser',
            },
            checkProductInWishList: {
                description: 'check product yes or no ',
                resolver: 'application::wish-list.wish-list.checkProductInWishList',
            },
        },
        Mutation: {
            addProductToWishList: {
                description: 'add product to wish list ',
                resolver: 'application::wish-list.wish-list.addProductToWishList',
            },
            removeItemsInWishList: {
                description: 'Delete product to wish list ',
                resolver: 'application::wish-list.wish-list.removeItemsInWishList',
            },

        }

    },
}