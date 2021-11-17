module.exports = {
    definition: `
        input editReviewByIdInput {
            comment: String,
            stars: Int
        }
        input createProductReviewInput {
            productSlug: String!, 
            comment: String!, 
            stars: Int!
        }
        type Overview {
            oneStar: Int,
            twoStar: Int,
            threeStar: Int,
            fourStar: Int,
            fiveStar: Int,
            total: Int,
            average: Float!
        }
        type ReviewsBySlugPayload {
            reviews: [Review]!,
            userReview: Review,
            overviews: Overview!
        }
    `,
    query: `
        getReviewsByProductSlug(slug: String!, skip: Int, limit: Int, sort: [String]): ReviewsBySlugPayload!
    `,
    mutation: `
        createReviewForProduct(createReviewInput: createProductReviewInput!): Review!
        editReviewById(reviewId: ID!, editReviewInput: editReviewInput!): Review!
        deleteReviewById(reviewId: ID!): Review!
    `,
    resolver: {
      Query: {
        getReviewsByProductSlug: {
            description: `Retrieve product's reviews by product id`,
            resolver: 'application::review.review.getReviewsByProductSlug',
        },
      },
      Mutation: {
        createReviewForProduct: {
            description: 'Add review for product by id',
            resolver: 'application::review.review.createReviewForProduct',
        },
        editReviewById: {
            description: 'Edit review by id',
            resolver: 'application::review.review.editReviewById',
        },
        deleteReviewById: {
            description: 'Delete review by id',
            resolver: 'application::review.review.deleteReviewById',
        },
      },
    },
  }