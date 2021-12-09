import callApi from "./functions/callApi";
import {
    GET_PRODUCT_REVIEWS,
    CREATE_REVIEW,
    EDIT_REVIEW,
    DELETE_REVIEW,
} from "../constants/graphql/review";
class ReviewApi {
    async getProductReviews(slug, options) {
        const query = `
            query($slug: String!) {
                reviewList: ${GET_PRODUCT_REVIEWS},
            }
        `;
        const variables = {
            slug,
        };
        return callApi.query(query, variables, options);
    }
    async createReview(productSlug, comment, stars, options) {
        const query = `
            mutation($input: createProductReviewInput!) {
                newReview: ${CREATE_REVIEW},
            }
        `;
        const variables = {
            input: {
                productSlug,
                comment,
                stars
            }
        };
        return callApi.mutate(query, variables, options);
    }
    async editReview(reviewId, comment, stars, options) {
        const query = `
            mutation($reviewId: ID!, $editReviewInput: editReviewInput!) {
                review: ${EDIT_REVIEW},
            }
        `;
        // Declare variables need be used
        const editReviewInput = {};
        if (comment) editReviewInput.comment = comment;
        if (stars) editReviewInput.stars = stars;
        const variables = {
            reviewId,
            editReviewInput,
        };
        return callApi.mutate(query, variables, options);
    }
    async deleteReview(reviewId, options) {
        const query = `
            mutation($reviewId: ID!) {
                deletedReview: ${DELETE_REVIEW},
            }
        `;
        const variables = {
            reviewId,
        };
        return callApi.mutate(query, variables, options);
    }
}

export default new ReviewApi();
