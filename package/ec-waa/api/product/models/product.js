'use strict';
const slugify = require('slugify');
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
    lifecycles: {
        beforeCreate: async (data) => {
            if (data.name)
                data.slug = slugify(data.name, {
                    lower: true
                });

            if(data.finalPrice && data.salesPercentage) {
                if (Number(data.salesPercentage)) {
                    data.finalPrice = parseInt(Number(data.regularPrice) * (1 - Number(data.salesPercentage) / 100));
                    data.finalPrice -= data.finalPrice % 10000;
                    data.finalPrice = data.finalPrice.toString();
                } else
                    data.finalPrice = data.regularPrice;
            }
        },
        beforeUpdate: async (params, data) => {
            if (data.name)
                data.slug = slugify(data.name, {
                    lower: true
                });

            if(data.finalPrice && data.salesPercentage) {
                if (Number(data.salesPercentage)) {
                    data.finalPrice = parseInt(Number(data.regularPrice) * (1 - Number(data.salesPercentage) / 100));
                    data.finalPrice -= data.finalPrice % 10000;
                    data.finalPrice = data.finalPrice.toString();
                } else
                    data.finalPrice = data.regularPrice;
            }
        },
    },
};