export const GET_PRODUCT_REVIEWS = `
    getReviewsByProductSlug(slug: $slug) {
        reviews {
            _id
            user {
                username
            }
            comment
            stars
            createdAt
        }
        userReview {
            _id
            user {
                username
            }
            comment
            stars
            createdAt
        }
        overviews {
            oneStar
            twoStar
            threeStar
            fourStar
            fiveStar
            total,
            average
        }
    }
`;

export const CREATE_REVIEW = `
    createReviewForProduct(
        createReviewInput: $input
    ) {
        _id
        user {
            username
        }
        comment
        stars
        createdAt
    }
`;

export const EDIT_REVIEW = `
    editReviewById(
        reviewId: $reviewId
        editReviewInput: $editReviewInput
    ) {
        _id
        user {
            username
        }
        comment
        stars
        createdAt
    }
`;

export const DELETE_REVIEW = `
    deleteReviewById(reviewId: $reviewId) {
        _id
        user {
            username
        }
        comment
        stars
        createdAt
    }
`;
