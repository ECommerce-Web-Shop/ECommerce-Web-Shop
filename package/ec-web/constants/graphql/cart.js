export const GET_CART = `
    getCart(cartId: $cartId) {
        _id
        items {
            _id
            product {
                name
                thumbnail {
                url
                }
                options {
                color
                quantityInStock
                }
                finalPrice
            }
            color
            qty
            amount
            selected
        }
        totalAmount
        finalAmount
        coupon {
        code
        }
        couponIsValid
    }
`;

export const TOGGLE_SELECT_ITEM = `
    toggleSelectItem(
        cartId: $cartId,
        itemId: $itemId,
        value: $value
    ) {
        _id
        items {
            _id
            product {
                name
                thumbnail {
                url
                }
                options {
                color
                quantityInStock
                }
                finalPrice
            }
            color
            qty
            amount
            selected
        }
        totalAmount
        finalAmount
        coupon {
        code
        }
        couponIsValid
    }
`;

export const TOGGLE_SELECT_ALL_ITEMS = `
    toggleSelectAll(
        cartId: $cartId,
        value: $value
    ) {
        _id
        items {
            _id
            product {
                name
                thumbnail {
                url
                }
                options {
                color
                quantityInStock
                }
                finalPrice
            }
            color
            qty
            amount
            selected
        }
        totalAmount
        finalAmount
        coupon {
        code
        }
        couponIsValid
    }
`;

export const REMOVE_SELECTED_ITEMS = `
    removeSelectedItems(
        cartId: $cartId
    ) {
        _id
        items {
            _id
            product {
                name
                thumbnail {
                url
                }
                options {
                color
                quantityInStock
                }
                finalPrice
            }
            color
            qty
            amount
            selected
        }
        totalAmount
        finalAmount
        coupon {
        code
        }
        couponIsValid
    }
`;

export const REMOVE_ITEM = `
    removeItemFromCart(
        cartId: $cartId,
        itemId: $itemId
    ) {
        _id
        items {
            _id
            product {
                name
                thumbnail {
                url
                }
                options {
                color
                quantityInStock
                }
                finalPrice
            }
            color
            qty
            amount
            selected
        }
        totalAmount
        finalAmount
        coupon {
        code
        }
        couponIsValid
    }
`;

export const INCREMENT_QUANTITY = `
    incrementItemQuantity(
        cartId: $cartId,
        itemId: $itemId,
        by: $by
    ) {
        _id
        items {
            _id
            product {
                name
                thumbnail {
                url
                }
                options {
                color
                quantityInStock
                }
                finalPrice
            }
            color
            qty
            amount
            selected
        }
        totalAmount
        finalAmount
        coupon {
        code
        }
        couponIsValid
    }
`;

export const DECREMENT_QUANTITY = `
    decrementItemQuantity(
        cartId: $cartId,
        itemId: $itemId,
        by: $by
    ) {
        _id
        items {
            _id
            product {
                name
                thumbnail {
                url
                }
                options {
                color
                quantityInStock
                }
                finalPrice
            }
            color
            qty
            amount
            selected
        }
        totalAmount
        finalAmount
        coupon {
        code
        }
        couponIsValid
    }
`;

export const APPLY_COUPON = `
    applyCoupon(
        cartId: $cartId,
        couponCode: $couponCode
    ) {
        _id
        items {
            _id
            product {
                name
                thumbnail {
                url
                }
                options {
                color
                quantityInStock
                }
                finalPrice
            }
            color
            qty
            amount
            selected
        }
        totalAmount
        finalAmount
        coupon {
        code
        }
        couponIsValid
    }
`;

export const REMOVE_COUPON = `
    removeCoupon(
        cartId: $cartId
    ) {
        _id
        items {
            _id
            product {
                name
                thumbnail {
                url
                }
                options {
                color
                quantityInStock
                }
                finalPrice
            }
            color
            qty
            amount
            selected
        }
        totalAmount
        finalAmount
        coupon {
        code
        }
        couponIsValid
    }
`;

export const CHANGE_ITEM_COLOR = `
    changeItemColor(
        cartId: $cartId,
        itemId: $itemId,
        color: $color
    ) {
        _id
        items {
            _id
            product {
                name
                thumbnail {
                url
                }
                options {
                color
                quantityInStock
                }
                finalPrice
            }
            color
            qty
            amount
            selected
        }
        totalAmount
        finalAmount
        coupon {
        code
        }
        couponIsValid
    }
`;
