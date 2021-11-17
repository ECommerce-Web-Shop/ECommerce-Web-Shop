module.exports = {
    definition: `
        input ProductFilter {
            id: ID,
            id_ne: ID,
            name: String,
            slug: String,
            minPrice: Int,
            maxPrice: Int,
            minRam: Int,
            maxRam: Int,
            screenPanel: String,
            screenResolution: String,
            minScreenSize: Float,
            maxScreenSize: Float,
            minBatteryCapacity: Int,
            maxBatteryCapacity: Int,
            platform: String,
            brand: String,
        }
    `,
    query: `
        searchProducts(filter: ProductFilter, limit: Int, skip: Int, sort: [String]): [Product]!,
        findSimilarProducts(id: ID!, limit: Int, skip: Int, sort: [String]): [Product]!,
        findRelatedBySlug(slug: String!, limit: Int, skip: Int, sort: [String]): [Product]!,
    `,
    resolver: {
      Query: {
          searchProducts: {
            description: 'Search products which match filter',
            resolver: 'application::product.product.search',
          },
          findSimilarProducts: {
            description: 'Receiving product id, then return similar products',
            resolver: 'application::product.product.findSimilar',
          },
          findRelatedBySlug: {
            description: 'Receiving product slug, then return related products',
            resolver: 'application::product.product.findRelatedBySlug',
          },
      },
    },
  }