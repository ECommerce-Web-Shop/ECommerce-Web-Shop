import callApi from "./functions/callApi";
import {
    GET_NEW_ARRIVALS,
    GET_BEST_SELLERS,
    GET_HOT_SALES,
    GET_PRODUCT_DETAIL_BY_SLUG,
    GET_RELATED_PRODUCTS,
} from "../constants/graphql/product";
import { 
    GET_PRODUCT_REVIEWS,
} from "../constants/graphql/review";
class ProductApi {
    getForHome(slug, limit, options) {
        const query = `
            query($limit: Int!, $slug:String!) {
                productsBestNew: ${GET_NEW_ARRIVALS},
                productsBestSell: ${GET_BEST_SELLERS},
                productHotSale: ${GET_HOT_SALES},
                productRelated:${GET_RELATED_PRODUCTS}
            }
        `;
        const variables = {
            limit: limit || 10,
            slug:slug||'realme-c15'
        };
        return callApi.query(query, variables, options);
    }
    getForProductPage(slug, options) {
        const query = `
            query($slug: String!) {
                product: ${GET_PRODUCT_DETAIL_BY_SLUG},
                relatedProducts: ${GET_RELATED_PRODUCTS},
                reviewList: ${GET_PRODUCT_REVIEWS},
            }
        `;
        const variables = {
            slug
        };
        return callApi.query(query, variables, options);
    }
} 

export default new ProductApi();
