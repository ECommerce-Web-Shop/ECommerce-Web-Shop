import {ApolloClient, InMemoryCache, gql } from "@apollo/client";

function graphqlClient(authToken) {
    const options = {
        uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
        cache: new InMemoryCache(),
    };

    if (authToken) options.headers = {
        Authorization: `Bearer ${authToken}`
    };

    const client = new ApolloClient(options);

    return client;
}

export { graphqlClient, gql }