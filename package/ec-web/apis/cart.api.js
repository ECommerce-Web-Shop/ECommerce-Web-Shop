
import axiosClient from "./clients/axiosClient";
import callApi from "./functions/callApi";
import {
    GET_CART,
    TOGGLE_SELECT_ITEM,
    TOGGLE_SELECT_ALL_ITEMS,
    REMOVE_SELECTED_ITEMS,
    REMOVE_ITEM,
    INCREMENT_QUANTITY,
    DECREMENT_QUANTITY,
    APPLY_COUPON,
    REMOVE_COUPON,
    CHANGE_ITEM_COLOR,
} from "../constants/graphql/cart";

class CartApi {
    getCart(cartId, options) {
        const query = `
            query($cartId: ID!) {
                cart: ${GET_CART},
            }
        `;
        const variables = {
            cartId
        };
        return callApi.query(query, variables, options);
    }
    toggleSelectItem(cartId, itemId, value, options) {
        const query = `
            mutation($cartId: ID!, $itemId: ID!, $value: Boolean!) {
                cart: ${TOGGLE_SELECT_ITEM},
            }
        `;
        const variables = {
            cartId,
            itemId,
            value
        };
        return callApi.mutate(query, variables, options);
    }
    toggleSelectAllItems(cartId, value, options) {
        const query = `
            mutation($cartId: ID!, $value: Boolean!) {
                cart: ${TOGGLE_SELECT_ALL_ITEMS},
            }
        `;
        const variables = {
            cartId,
            value
        };
        return callApi.mutate(query, variables, options);
    }
    removeSelectedItems(cartId, options) {
        const query = `
            mutation($cartId: ID!) {
                cart: ${REMOVE_SELECTED_ITEMS},
            }
        `;
        const variables = {
            cartId,
        };
        return callApi.mutate(query, variables, options);
    }
    async removeItem(cartId, itemId, options) {
        const query = `
            mutation($cartId: ID!, $itemId: ID!) {
                cart: ${REMOVE_ITEM},
            }
        `;
        const variables = {
            cartId,
            itemId,
        };
        return callApi.mutate(query, variables, options);
    }
    incrementQuantity(cartId, itemId, by, options) {
        const query = `
            mutation($cartId: ID!, $itemId: ID!, $by: Int!) {
                cart: ${INCREMENT_QUANTITY},
            }
        `;
        const variables = {
            cartId,
            itemId,
            by
        };
        return callApi.mutate(query, variables, options);
    }
    decrementQuantity(cartId, itemId, by, options) {
        const query = `
            mutation($cartId: ID!, $itemId: ID!, $by: Int!) {
                cart: ${DECREMENT_QUANTITY},
            }
        `;
        const variables = {
            cartId,
            itemId,
            by
        };
        return callApi.mutate(query, variables, options);
    }
    applyCoupon(cartId, couponCode, options) {
        const query = `
            mutation($cartId: ID!, $couponCode: String!) {
                cart: ${APPLY_COUPON},
            }
        `;
        const variables = {
            cartId,
            couponCode
        };
        return callApi.mutate(query, variables, options);
    }
    removeCoupon(cartId, options) {
        const query = `
            mutation($cartId: ID!) {
                cart: ${REMOVE_COUPON},
            }
        `;
        const variables = {
            cartId,
        };
        return callApi.mutate(query, variables, options);
    }
    changeItemColor(cartId, itemId, color, options) {
        const query = `
            mutation($cartId: ID!, $itemId: ID!, $color: String!) {
                cart: ${CHANGE_ITEM_COLOR},
            }
        `;
        const variables = {
            cartId,
            itemId,
            color
        };
        return callApi.mutate(query, variables, options);
    }
}

export default new CartApi();
