"use strict";
const { ObjectID } = require("mongodb");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
    async displayCart(cartId) {
		// Using destructuring beacause the result is an array had one element
		const [ cart ] = await findCartsByAggregation({id: cartId}, 1);
		return cart;
    },

    async checkout(userId) {
        // Using destructuring because the result is an array had one element
		const [ cart ] = await findCartsByAggregation({user: userId}, 1);
		return cart;
    },

    async getCartToChangeItemQuantity(cartId, itemId) {
        const carts = await strapi.query("cart").model.aggregate([
            {
                $match: {
                    _id: new ObjectID(cartId),
                    $expr: { $in: [new ObjectID(itemId), "$items"] },
                },
            },
            {
                $lookup: {
                    from: "ordered_items",
                    let: { itemId: new ObjectID(itemId) },
                    pipeline: [
                        {
                            $match: { $expr: { $eq: ["$_id", "$$itemId"] } },
                        },
                        {
                            $lookup: {
                                from: "products",
                                let: { productId: "$product" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ["$_id", "$$productId"],
                                            },
                                        },
                                    },
                                    {
                                        $lookup: {
                                            from: "components_product_options",
                                            let: { optionIds: "$options.ref" },
                                            pipeline: [
                                                {
                                                    $match: {
                                                        $expr: {
                                                            $in: [
                                                                "$_id",
                                                                "$$optionIds",
                                                            ],
                                                        },
                                                    },
                                                },
                                            ],
                                            as: "option",
                                        },
                                    },
                                    {
                                        $unwind: {
                                            path: "$option",
                                            preserveNullAndEmptyArrays: true,
                                        },
                                    },
                                    {
                                        $project: {
                                            option: 1,
                                        },
                                    },
                                ],
                                as: "product",
                            },
                        },
                        {
                            $unwind: {
                                path: "$product",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                    ],
                    as: "item",
                },
            },
            {
                $unwind: {
                    path: "$item",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]);

        return carts.find(cart => cart.item.color === cart.item.product.option.color)
    },
};

function parseFilterForAggregation(filter) {
	if(!filter) return {};

	const result = {};
	const { id, user } = filter;

	if(id)
		result._id = { $eq: new ObjectID(id)};

	if(user)
		result.user = { $eq: new ObjectID(user)};

	return result;
}

function parseSortForAggregation(sort) {
    // Default sorting by updated date
    if(!sort) return {
        updatedAt: -1,
    };

    const result = {};
    // Sort is an array like ["price:desc", "ram:asc"]
    sort.forEach(element => {
        // Element is a string like "ram:asc"
        const [key, value] = element.split(":");

        switch (value.toLowerCase()) {
            case "asc":
                result[key] = 1;
                break;
            case "desc":
                result[key] = -1;
                break;
        }
    });

    return result;
}

async function findCartsByAggregation(filter, limit, skip, sort) {
	filter = parseFilterForAggregation(filter);
	sort = parseSortForAggregation(sort);

    const carts = await strapi.query("cart").model.aggregate([
        { $match: filter },

        // Get cart's coupon information by joining with coupons table
        {
            $lookup: {
                from: "coupons",
                localField: "coupon",
                foreignField: "_id",
                as: "coupon",
            },
        },
        {
            $unwind: {
                path: "$coupon",
                preserveNullAndEmptyArrays: true,
            },
        },

        // Get cart's items information by joining with order-items table
        {
            $lookup: {
                from: "ordered_items",
                let: { itemIds: "$items" },
                pipeline: [
                    { $match: { $expr: { $in: ["$_id", "$$itemIds"] } } },

                    // Get cart's items product information by joining with order-items table
                    {
                        $lookup: {
                            from: "products",
                            let: { productId: "$product" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$_id", "$$productId"],
                                        },
                                    },
                                },
                                {
                                    $project: {
                                        fullDesc: 0,
                                        inclusionBox: 0,
                                        shortDesc: 0,
                                        condition: 0,
                                        warranty: 0,
                                        platformVersion: 0,
                                    },
                                },
                                {
                                    $lookup: {
                                        from: "components_product_options",
                                        let: { optionIds: "$options.ref" },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: {
                                                        $in: [
                                                            "$_id",
                                                            "$$optionIds",
                                                        ],
                                                    },
                                                },
                                            },
                                            {
                                                $lookup: {
                                                    from: "upload_file",
                                                    let: {
                                                        imageIds: "$images",
                                                    },
                                                    pipeline: [
                                                        {
                                                            $match: {
                                                                $expr: {
                                                                    $in: [
                                                                        "$_id",
                                                                        "$$imageIds",
                                                                    ],
                                                                },
                                                            },
                                                        },
                                                    ],
                                                    as: "images",
                                                },
                                            },
                                        ],
                                        as: "options",
                                    },
                                },
                                {
                                    $lookup: {
                                        from: "brands",
                                        localField: "brand",
                                        foreignField: "_id",
                                        as: "brand",
                                    },
                                },
                                {
                                    $unwind: {
                                        path: "$brand",
                                        preserveNullAndEmptyArrays: true,
                                    },
                                },
                                {
                                    $lookup: {
                                        from: "upload_file",
                                        localField: "thumbnail",
                                        foreignField: "_id",
                                        as: "thumbnail",
                                    },
                                },
                                {
                                    $unwind: {
                                        path: "$thumbnail",
                                        preserveNullAndEmptyArrays: true,
                                    },
                                },
                            ],
                            as: "product",
                        },
                    },
                    {
                        $unwind: {
                            path: "$product",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $addFields: {
                            amount: {
                                $cond: [
                                    { $eq: ["$selected", true] },
                                    {
                                        $multiply: [
                                            "$product.finalPrice",
                                            "$qty",
                                        ],
                                    },
                                    0,
                                ],
                            },
                        },
                    },
                ],
                as: "items",
            },
        },
        {
            $addFields: {
                totalAmount: { $sum: "$items.amount" },
            },
        },
        {
            $sort: sort,
        },
        {
            $skip: Number(skip) || 0,
        },
        {
            $limit: Number(limit) || 100,
        },
    ]);

	carts.forEach(cart => {
		// Calc final price of user's cart
		cart.finalAmount = cart.totalAmount;
	
		// If cart has no coupon, only return cart
		cart.couponIsValid = true;
		if (!cart.coupon) return cart;
	
		// If coupon is expiry, set coupon valid status to false and return user's cart
		if (Number(cart.coupon.expiryDate) < Date.now()) {
			cart.couponIsValid = false;
			return cart;
		}
	
		// Else, calculate final price with coupon discount
		if (cart.coupon.discountPercentage)
			cart.finalAmount *= 1 - cart.coupon.discountPercentage / 100;
	
		if (cart.coupon.discountAmount)
			cart.finalAmount -= cart.coupon.discountAmount;
	
		if (cart.finalAmount < 0) cart.finalAmount = 0;
	
		return cart;
	})

	return carts;
}

	// let [cart] = await strapi.query("cart").model.aggregate([
	//     // Filter cart which is user's cart
	//     { $match: { user: new ObjectID(userId) } },

	//     // Get cart's coupon information by joining with coupons table
	//     {
	//         $lookup: {
	//             from: "coupons",
	//             localField: "coupon",
	//             foreignField: "_id",
	//             as: "coupon",
	//         },
	//     },
	//     {
	//         $unwind: {
	//             path: "$coupon",
	//             preserveNullAndEmptyArrays: true,
	//         },
	//     },

	//     // Get cart's items information by joining with order-items table
	//     {
	//         $lookup: {
	//             from: "ordered_items",
	//             let: { itemIds: "$items" },
	//             pipeline: [
	//                 { $match: { $expr: { $in: ["$_id", "$$itemIds"] } } },
	//                 // Get cart's items product information by joining with order-items table
	//                 {
	//                     $lookup: {
	//                         from: "products",
	//                         let: { productId: "$product" },
	//                         pipeline: [
	//                             {
	//                                 $match: {
	//                                     $expr: {
	//                                         $eq: ["$_id", "$$productId"],
	//                                     },
	//                                 },
	//                             },
	//                             {
	//                                 $project: {
	//                                     fullDesc: 0,
	//                                     inclusionBox: 0,
	//                                     shortDesc: 0,
	//                                     condition: 0,
	//                                     warranty: 0,
	//                                     platformVersion: 0,
	//                                 },
	//                             },
	//                             {
	//                                 $lookup: {
	//                                     from: "components_product_options",
	//                                     let: { optionIds: "$options.ref" },
	//                                     pipeline: [
	//                                         {
	//                                             $match: {
	//                                                 $expr: {
	//                                                     $in: [
	//                                                         "$_id",
	//                                                         "$$optionIds",
	//                                                     ],
	//                                                 },
	//                                             },
	//                                         },
	//                                         {
	//                                             $lookup: {
	//                                                 from: "upload_file",
	//                                                 let: {
	//                                                     imageIds: "$images",
	//                                                 },
	//                                                 pipeline: [
	//                                                     {
	//                                                         $match: {
	//                                                             $expr: {
	//                                                                 $in: [
	//                                                                     "$_id",
	//                                                                     "$$imageIds",
	//                                                                 ],
	//                                                             },
	//                                                         },
	//                                                     },
	//                                                 ],
	//                                                 as: "images",
	//                                             },
	//                                         },
	//                                     ],
	//                                     as: "options",
	//                                 },
	//                             },
	//                             {
	//                                 $lookup: {
	//                                     from: "brands",
	//                                     localField: "brand",
	//                                     foreignField: "_id",
	//                                     as: "brand",
	//                                 },
	//                             },
	//                             {
	//                                 $unwind: {
	//                                     path: "$brand",
	//                                     preserveNullAndEmptyArrays: true,
	//                                 },
	//                             },
	//                             {
	//                                 $lookup: {
	//                                     from: "upload_file",
	//                                     localField: "thumbnail",
	//                                     foreignField: "_id",
	//                                     as: "thumbnail",
	//                                 },
	//                             },
	//                             {
	//                                 $unwind: {
	//                                     path: "$thumbnail",
	//                                     preserveNullAndEmptyArrays: true,
	//                                 },
	//                             },
	//                         ],
	//                         as: "product",
	//                     },
	//                 },
	//                 {
	//                     $unwind: {
	//                         path: "$product",
	//                         preserveNullAndEmptyArrays: true,
	//                     },
	//                 },
	//                 {
	//                     $addFields: {
	//                         amount: {
	//                             $cond: [
	//                                 { $eq: ["$selected", true] },
	//                                 {
	//                                     $multiply: [
	//                                         "$product.finalPrice",
	//                                         "$qty",
	//                                     ],
	//                                 },
	//                                 0,
	//                             ],
	//                         },
	//                     },
	//                 },
	//             ],
	//             as: "items",
	//         },
	//     },
	//     {
	//         $addFields: {
	//             totalAmount: { $sum: "$items.amount" },
	//         },
	//     },
	// ]);

	// // Calc final price of user's cart
	// cart.finalAmount = cart.totalAmount;

	// // If cart has no coupon, only return cart
	// cart.couponIsValid = true;
	// if (!cart.coupon) return cart;

	// // If coupon is expiry, set coupon valid status to false and return user's cart
	// if (Number(cart.coupon.expiryDate) < Date.now()) {
	//     cart.couponIsValid = false;
	//     return cart;
	// }

	// // Else, calculate final price with coupon discount
	// if (cart.coupon.discountPercentage)
	//     cart.finalAmount *= 1 - cart.coupon.discountPercentage / 100;

	// if (cart.coupon.discountAmount)
	//     cart.finalAmount -= cart.coupon.discountAmount;

	// if (cart.finalAmount < 0) cart.finalAmount = 0;

	// return cart