import { gql } from '@apollo/client';

export default function query() {
    const query = gql`  
        query{
            products: searchProducts {
                name,
                brand{
                    name
                },
                platformName,
                ram,
                screenSize,
                batteryCapacity,
                screenPanel
            }
        }
  `

    return query;
}