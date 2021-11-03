'use strict';
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
    lifecycles: {
        beforeCreate: async (data) => {
            // console.log("Da tao order thanh cong");
            // console.log(data)
            await Promise.all([
                ...data.itemDetails.map(async item => {
                    const options = item.product.options.map(option => {
                        if((option.color === item.color))
                            return {
                                id: `${option._id}`,
                                quantityInStock: Number(option.quantityInStock) - Number(item.qty),
                                soldQuantity: Number(option.soldQuantity) + Number(item.qty),
                            };
                        
                        return {
                            id: `${option._id}`,
                        };
                    });

                    return await strapi.query('product').update({id: `${item.product._id}`}, {
                        options: options
                    });
                }),
                ...data.itemDetails.map(async item => {
                    return await strapi.query('ordered-item').model.findByIdAndUpdate(item._id, {
                        unitPrice: item.product.finalPrice,
                        totalPrice: item.amount,
                    }).lean();
                })
            ]);
        },
        beforeUpdate: async (params, data) => {
        },
    },
};