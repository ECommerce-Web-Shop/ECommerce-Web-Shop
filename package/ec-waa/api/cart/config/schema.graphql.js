module.exports = {
    definition: `
        input CartItemInput {
            product: ID!,
            color: String!,
            qty: Int! 
        },

        type ProductOption {
            color: String!,
            quantityInStock: Int!,
            soldQuantity: Int!,
        }

        type ProductItem {
            _id: ID!,
            name: String!,
            slug: String!,
            regularPrice: Long!,
            finalPrice: Long!,
            thumbnail: UploadFile!,
            brand: Brand!,
            options: [ProductOption]!,
        }

        type CartItem {
            _id: ID!,
            product: ProductItem!,
            color: String!,
            qty: Int!,
            amount: Long!,
            selected: Boolean!
        },

        type UserCart {
            _id: ID!,
            coupon: Coupon,
            items: [CartItem]!,
            couponIsValid: Boolean!,
            totalAmount: Long!,
            finalAmount: Long!,
        }
    `,
    query: `
        getCart(cartId: ID): UserCart!,
    `,
    mutation: `
        addItemToCart(cartId: ID!, newItem: CartItemInput!): UserCart!,
        removeItemFromCart(cartId: ID!, itemId: ID!): UserCart!,
        changeItemColor(cartId: ID!, itemId: ID!, color: String!): UserCart!,
        removeSelectedItems(cartId: ID!): UserCart!,
        toggleSelectItem(cartId: ID!, itemId: ID!, value: Boolean!): UserCart!,
        toggleSelectAll(cartId: ID!, value: Boolean!): UserCart!,
        incrementItemQuantity(cartId: ID!, itemId: ID!, by: Int!): UserCart!,
        decrementItemQuantity(cartId: ID!, itemId: ID!, by: Int!): UserCart!,
        applyCoupon(cartId: ID!, couponCode: String!): UserCart!,
        removeCoupon(cartId: ID!): UserCart!,
    `,
    resolver: {
        Query: {
            getCart : {
                description: 'Get user cart',
                resolver: 'application::cart.cart.getCart',
            },
        },
        Mutation: {
            addItemToCart: {
                description: 'Add an item to user cart',
                resolver: 'application::cart.cart.addItemToCart',
            },
            removeItemFromCart: {
                description: 'Remove an item to user cart',
                resolver: 'application::cart.cart.removeItemFromCart',
            },
            removeSelectedItems: {
                description: 'Remove selected items to user cart',
                resolver: 'application::cart.cart.removeSelectedItems',
            },
            changeItemColor: {
                description: 'Change item color by item and cart id',
                resolver: 'application::cart.cart.changeItemColor',
            },
            toggleSelectItem: {
                description: 'Toggle select item in user cart',
                resolver: 'application::cart.cart.toggleSelect',
            },
            toggleSelectAll: {
                description: 'Toggle select all items in user cart',
                resolver: 'application::cart.cart.toggleSelectAll',
            },
            incrementItemQuantity: {
                description: 'Increment quantity item',
                resolver: 'application::cart.cart.incrementItemQuantity',
            },
            decrementItemQuantity: {
                description: 'Decrement quantity item',
                resolver: 'application::cart.cart.decrementItemQuantity',
            },
            applyCoupon: {
                description: 'Apply a coupon to user cart',
                resolver: 'application::cart.cart.applyCoupon',
            },
            removeCoupon: {
                description: 'Remove a coupon to user cart',
                resolver: 'application::cart.cart.removeCoupon',
            },
      },
    },
  }