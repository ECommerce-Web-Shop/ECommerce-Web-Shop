import { gql } from '@apollo/client';

export default function query() {
    const query = gql`  
        query{ 
            products: searchProducts {
                name,
                slug,
                salesPercentage,
                regularPrice,
                finalPrice,
                id,
                thumbnail{
                    url
                },
                ram,
                rom,
                votes,
                stars,
                brand{
                    name,
                    slug
                }
                screenSize
                screenPanel
                screenResolution
                cpu
                gpu
                updatedAt
            }
            productsBestSell: searchProducts(sort:["total_sold:desc"],
            limit:10
            )
            {
              name
              slug
              regularPrice
              salesPercentage
              finalPrice
              votes
              stars
              thumbnail{
                url
              }
            }
            productsBestNew:searchProducts(sort:["createAt:desc"],
            limit:10
            ){
              name
              slug
              regularPrice
              salesPercentage
              finalPrice
              votes
              stars
              thumbnail{
                url
              }
            }
        }
  `

    return query;
}