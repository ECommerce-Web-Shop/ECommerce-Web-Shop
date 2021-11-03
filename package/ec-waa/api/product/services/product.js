"use strict";
const { ObjectID } = require("mongodb");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
    async search(filter, limit, skip, sort) {
        return await findProductsByAggregation(filter, limit, skip, sort);
    },

    async findRelatedBySlug(slug, limit, skip, sort) {
        // Retrieve information of product that need to find its relateds
        const {
            _id,
            ram,
            finalPrice,
            batteryCapacity,
            screenPanel,
            screenSize,
            brand,
        } = await this.findProductBySlug(slug);
        
        const filter = {
            _id: { $nin: [new ObjectID(_id)] },
            $or: [
                {
                    'brand.name': brand.name,
                },
                {
                    finalPrice: {
                        $gt: finalPrice - 2000000,
                        $lt: finalPrice + 2000000,
                    },
                },
                {
                    ram: {
                        $gt: ram - 2,
                        $lt: ram + 2,
                    },
                    batteryCapacity: {
                        $gt: batteryCapacity - 1000,
                        $lt: batteryCapacity + 1000,
                    },
                    screenSize: {
                        $gt: screenSize - 0.5,
                        $lt: screenSize + 0.5,
                    },
                    screenPanel: screenPanel,
                },
            ],
        };

        return await findProductsByAggregation(filter, limit, skip, sort, {
            useParseFilter: false
        });
    },

    async findProductBySlug(slug) {
        if(!slug) throw new Error("You must pass slug parameter");

        // Using destructuring because the result is an array had one element
        const [ product ] = await findProductsByAggregation({ slug }, 1);

        return product;
    }
};

function parseFilterForAggregation(filter) {
    if (!filter) return {};

    const {
        id,
        id_ne,
        name,
        slug,
        minPrice,
        maxPrice,
        minRam,
        maxRam,
        screenPanel,
        screenResolution,
        minScreenSize,
        maxScreenSize,
        platform,
        minBatteryCapacity,
        maxBatteryCapacity,
        brand,
    } = filter;

    const result = {
        _id: {
            $eq: id ? new ObjectId(id) : undefined,
            $ne: id_ne ? new ObjectId(id_ne) : undefined,
        },
        name,
        slug,
        finalPrice: {
            $gte: minPrice ? Number(minPrice) : undefined,
            $lte: maxPrice ? Number(maxPrice) : undefined,
        },
        ram: {
            $gte: minRam ? Number(minRam) : undefined,
            $lte: maxRam ? Number(maxRam) : undefined,
        },
        screenPanel,
        screenResolution,
        screenSize: {
            $gte: minScreenSize ? Number(minScreenSize) : undefined,
            $lte: maxScreenSize ? Number(maxScreenSize) : undefined,
        },
        platformName: platform,
        batteryCapacity: {
            $gte: minBatteryCapacity ? Number(minBatteryCapacity) : undefined,
            $lte: maxBatteryCapacity ? Number(maxBatteryCapacity) : undefined,
        },
        'brand.name': brand,
    };

    return removeUndefinedFieldsFromObj(result);
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

function removeUndefinedFieldsFromObj(obj) {
    let result = obj;
    // Use JSON parse to remove fields that is undefined
    result = JSON.parse(JSON.stringify(result));
    // But maybe some fields is empty object, start removing them
    for (const key in result) {
        if (
            typeof result[key] === "object" &&
            Object.keys(result[key]).length === 0
        )
            delete result[key];
    }
    return result;
}

function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(
        /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
        " "
    );
    return str;
}

async function findProductsByAggregation(filter, limit, skip, sort, options) {
    // Split name to process later
    const name = filter ? filter.name : undefined;
    name && delete filter.name;

    // Default useParseFilter is true
    !options && (options = {
        useParseFilter: true
    });

    const {
        useParseFilter
    } = options;
    
    useParseFilter && (filter = parseFilterForAggregation(filter));
    console.log(filter);
    sort = parseSortForAggregation(sort);

    let products = await strapi.query("product").model.aggregate([
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
            $match: filter,
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
        {
            $lookup: {
                from: "components_product_options",
                let: { optionIds: "$options.ref" },
                pipeline: [
                    { $match: { $expr: { $in: ["$_id", "$$optionIds"] } } },
                    {
                        $lookup: {
                            from: "upload_file",
                            let: { imageIds: "$images" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $in: ["$_id", "$$imageIds"],
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
            $addFields: {
                total_sold: {
                    $sum: "$options.soldQuantity",
                },
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

    if (name)
        products = products.filter((product) => {
            return (
                removeVietnameseTones(product.name.toLowerCase()).indexOf(
                    removeVietnameseTones(name.toLowerCase())
                ) !== -1
            );
        });

    return products;
}