'use strict';
const { ObjectId } = require('mongodb');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
    async getReviews(filter, sort) {
        // =========== Start handle filter ==============
        const query = {};
        const productQuery = {}

        if(filter.slug) 
            productQuery['$expr'] = { "$eq": ["$product.slug", filter.slug] } 

        if(filter.user_ne) 
            query['user_ne'] = {
                $in: [new ObjectId(user_ne)]
            };
        // =========== End handle filter ==============
        
        // ================ Start handle sort ===================
        // If sort is passed into, add it to option variable
        // Create sortContent variable to contain sort options
        let sortContent = {
            updatedAt: -1
        };
        if (sort) {
            sortContent = {};
            // Add sort options to sortContent variable
            sort.forEach(element => {
                const [key, value] = element.split(':');
                if (value.toLowerCase() === 'asc')
                    sortContent[key] = 1;

                if (value.toLowerCase() === 'desc')
                    sortContent[key] = -1;
            });
        }


        // ================= End handle sort ====================

        const reviews = await strapi.query('review').model.aggregate([
            {
                "$match": query
            },
            {
                "$lookup": {
                    "from": "users-permissions_user",
                    "localField": "user",
                    "foreignField": "_id",
                    "as": "user"
                }
            },
            {
              "$unwind": {
                "path": "$user",
                "preserveNullAndEmptyArrays": true
              }
            },
            {
                "$lookup": {
                    "from": "products",
                    "localField": "product",
                    "foreignField": "_id",
                    "as": "product"
                }
            },
            {
              "$unwind": {
                "path": "$product",
                "preserveNullAndEmptyArrays": true
              }
            },
            {
                "$match": productQuery
            },
            {
                "$sort": sortContent
            },
        ]);
        
        return reviews;
    }
};
