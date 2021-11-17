'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async search(ctx) {
        const {
            _filter: filter,
            _sort: sort,
            _skip: skip,
            _limit: limit,
        } = ctx.query;

        return await strapi.services.product.search(filter, limit, skip, sort);
    },

    async findSimilar(ctx) {
        const {
            _id: id,
            _sort: sort,
            _skip: skip,
            _limit: limit,
        } = ctx.query;

        // Retrieve product need to find its similars
        const {
            ram,
            screenSize,
            batteryCapacity,
        } = await strapi.query('product').findOne({id});

        // Create filter to find similar products
        const filter = {
            minRam: ram - 2,
            maxRam: ram + 2,
            minScreenSize: screenSize - 0.5,
            maxScreenSize: screenSize + 0.5,
            minBatteryCapacity: batteryCapacity - 1000,
            maxBatteryCapacity: batteryCapacity + 1000,
            id_ne: id,
        }

        // Search and return products which match filter
        return await strapi.services.product.search(filter, limit, skip, sort);
    },

    async findRelatedBySlug(ctx) {
        const {
            _slug: slug,
            _sort: sort,
            _skip: skip,
            _limit: limit,
        } = ctx.query;

        // Search and return products which match filter
        return await strapi.services.product.findRelatedBySlug(slug, limit, skip, sort);
    }
};
