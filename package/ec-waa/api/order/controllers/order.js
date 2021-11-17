"use strict";
const { ObjectID } = require("mongodb");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async getOrders(ctx) {
        if (!ctx?.request?.header?.authorization)
            throw new Error("You must login before get your orders");

        const { id: userId } = await strapi.plugins[
            "users-permissions"
        ].services.jwt.getToken(ctx);

        return await strapi.query("order").find({ user: userId });
    },

    async checkout(ctx) {
        if (!ctx?.request?.header?.authorization)
            throw new Error("You must login before ordering");

        const { id: userId } = await strapi.plugins[
            "users-permissions"
        ].services.jwt.getToken(ctx);

        const {
            consigneeName,
            consigneePhone,
            email,
            addressLine1,
            district,
            city,
            paymentMethod,
        } = ctx.request.body.info;

        const userCart = await strapi.services.cart.checkout(userId);

        // If user's cart is not exist or has no items, stop
        if (!userCart || userCart.items.length === 0)
            throw new Error("Cannot checkout because your cart is empty");

        const { itemToBuy, idItemToBuy, idItemToKeep } =
            categorizeItemToBuyAndKeep(userCart);

        // If no selected items, stop
        if (idItemToBuy.length < 1)
            throw new Error(
                "Cannot checkout because no selected item in your cart"
            );

        // Create order
        const order = await strapi.query("order").create({
            consigneeName,
            consigneePhone,
            email,
            addressLine1,
            district,
            city,
            items: idItemToBuy,
            totalAmount: userCart.totalAmount,
            finalAmount: userCart.finalAmount,
            status: "Pending",
            isPaid: false,
            paymentMethod,
            user: userId,
            coupon: userCart.coupon,
            itemDetails: itemToBuy,
            orderId: Date.now(),
            orderCode: Date.now(),
        });

        // After creating order, remove items that is bought from cart
        await strapi.query("cart").model.findByIdAndUpdate(userCart._id, {
            items: idItemToKeep,
            coupon: undefined,
            couponIsValid: undefined,
        });

        // Decrease product's qty and add price information to order items
        // => This code is written in order model lifecycle
        // ../models/order.js

        // Return order
        return order;
    },

    async cancelOrderById(ctx) {
        if (!ctx?.request?.header?.authorization)
            throw new Error("You must login before cancelling orders");

        const { id: user_id } = await strapi.plugins[
            "users-permissions"
        ].services.jwt.getToken(ctx);
        const { orderId } = ctx.request.body;
        const order = await strapi.query("order").model.findById(orderId);

        // Check order can be cancelled or not
        isOrderCanBeCancelable(order);

        // Cancel order
        return await strapi.query("order").update(
            { id: orderId },
            {
                status: "Cancelled",
            }
        );
    },
};

function categorizeItemToBuyAndKeep(cart) {
    const itemToBuy = [];
    const idItemToBuy = [];
    const idItemToKeep = [];
    cart.items.forEach((item) => {
        if (!item.selected) return idItemToKeep.push(item._id);

        itemToBuy.push(item);
        idItemToBuy.push(item._id);
        // Check color & quantity input is valid or not
        let checkColorValid = false;
        let checkQuantityValid = false;
        item.product.options.forEach((option) => {
            if (option.color !== item.color) return;
            checkColorValid = true;

            if (item.qty <= 0 || item.qty > option.quantityInStock) return;
            checkQuantityValid = true;
        });

        if (!checkColorValid)
            throw new Error("Color which you want to buy is not valid");

        if (!checkQuantityValid)
            throw new Error(
                "Quantity which you want to buy is great than stock quantity"
            );
    });

    return {
        itemToBuy,
        idItemToBuy,
        idItemToKeep,
    };
}

function isOrderCanBeCancelable(order) {
    if (!order)
        throw new Error(
            `Cannot cancel order with id ${orderId} because it is not exist`
        );

    // Only pending status can be cancelled
    if (order.status !== "Pending")
        throw new Error(
            `Cannot cancel order with id ${orderId} because it has confimed by staff`
        );

    // Only cancel the order that is own by user
    if (order.user != user_id)
        throw new Error(
            `Cannot cancel order with id ${orderId} because it is not the one of your order`
        );

    return true;
}
