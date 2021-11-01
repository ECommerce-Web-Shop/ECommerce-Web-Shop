import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export default async function fetchgql(type = 'query', query, variables, options) {
    let data;
    
    const client = new ApolloClient({
        uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
        cache: new InMemoryCache(),
        ...options,
    });

    switch(type) {
        case 'query': 
            data = (await client.query({
                query: gql`${query}`,
                variables
            })).data;

            return {
                message: 'Successfully',
                ok: true,
                data,
            };
        case 'mutation':
            data = (await client.mutate({
                mutation: gql`${query}`,
                variables
            })).data;

            return {
                message: 'Successfully',
                ok: true,
                data,
            };
        default:
            return {
                message: `The type of query is not valid. Type must be "query" or "mutation"`,
                ok: false
            }
    }
}