import axiosClient from "../clients/axiosClient";
import { apolloClient, gql } from "../clients/apolloClient";


async function callByAxiosClient(type, query, variables, config) {
    if (type !== "mutation" && type !== "query")
        throw new Error("Type of request is not valid");
    try {
        const { data: responseData } = await axiosClient.post(
            `${process.env.NEXT_PUBLIC_DOMAIN}/api/graphql`,
            {
                type,
                query,
                variables,
            },
            config
        );
        const { data, errors } = responseData;
        return { data, errors };
    } catch (error) {
        return { data: null, errors: [error] };
    }
}

async function callByApolloClient(type, query, variables, jwt) {
    if (type !== "mutation" && type !== "query")
        throw new Error("Type of request is not valid");

    const headers = jwt ? { Authorization: `Bearer ${jwt}` } : undefined;

    if (type === "query") {
        try {
            const { data, errors } = await apolloClient.query({
                query: gql`
                    ${query}
                `,
                variables,
                context: {
                    headers,
                },
                errorPolicy: "all",
            });
            return { data, errors };
        } catch (error) {
            return { data: null, errors: [error] };
        }
    }

    if (type === "mutation") {
        try {
            const { data, errors } = await apolloClient.mutate({
                mutation: gql`
                    ${query}
                `,
                variables,
                context: {
                    headers,
                },
                errorPolicy: "all",
            });
            return { data, errors };
        } catch (error) {
            return { data: null, errors: [error] };
        }
    }
}

async function query(query, variables, options) {
    // Default call APIs by axios client
    options = options ? options : { useAxiosClient: true };
    const { useAxiosClient, jwt } = options;

    return useAxiosClient
        ? callByAxiosClient("query", query, variables)
        : callByApolloClient("query", query, variables, jwt);
}

function mutate(query, variables, options) {
    // Default call APIs by axios client
    options = options ? options : { useAxiosClient: true };
    const { useAxiosClient, jwt } = options;

    return useAxiosClient
        ? callByAxiosClient("mutation", query, variables)
        : callByApolloClient("mutation", query, variables, jwt);
}

export default {
    query,
    mutate,
}

