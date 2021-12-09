import { gql } from '@apollo/client';

export default function query() {
    const query = gql`  
    query($filter: ProductFilter!) {
        products: searchProducts(filter: $filter){
            name,
            salesPercentage,
            slug,
            regularPrice,
            finalPrice,
            id,
            thumbnail{
                url
            },
            votes
            stars
            brand{
                name
            }
        }
    }
  `
    return query;
}