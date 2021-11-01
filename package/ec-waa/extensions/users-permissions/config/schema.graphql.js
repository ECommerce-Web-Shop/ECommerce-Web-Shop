const _ = require("lodash");

/**
 * Throws an ApolloError if context body contains a bad request
 * @param contextBody - body of the context object given to the resolver
 * @throws ApolloError if the body is a bad request
 */
function checkBadRequest(contextBody) {
    if (_.get(contextBody, "statusCode", 200) !== 200) {
        const message = _.get(contextBody, "error", "Bad Request");
        const exception = new Error(message);
        exception.code = _.get(contextBody, "statusCode", 400);
        exception.data = contextBody;
        throw exception;
    }
}

module.exports = {
    definition: `
        input CustomUsersPermissionsRegisterInput {
            username: String!
            password: String!
            name: String
            phone: String
            email: String
        }
        type CustomUsersPermissionsMe {
            id: ID!,
            _id: ID!,
            username: String!
            password: String!
            name: String
            phone: String
            email: String
            confirmed: Boolean!
            blocked: Boolean!
            role: UsersPermissionsMeRole!
        }
    `,
    query: `
        customMe: CustomUsersPermissionsMe!
        isValidEmail(email: String!): Boolean!
        isValidUsername(username: String!): Boolean!
        isAvailableEmail(email: String!): Boolean!
        isAvailableUsername(username: String!): Boolean!
    `,
    mutation: `
        customRegister(input: CustomUsersPermissionsRegisterInput!): UsersPermissionsLoginPayload!
        changePassword(currentPassword: String!, newPassword: String!, confirmNewPassword: String!): Boolean!,
    `,
    resolver: {
        Query: {
            customMe: {
                description: 'Retrieve account information, only working when use logged in before',
                resolver: 'plugins::users-permissions.user.customMe',
            },
            isValidEmail: {
                description: 'Check if email is valid or not',
                resolver: 'plugins::users-permissions.user.isValidEmail',
            },
            isValidUsername: {
                description: 'Check if username is valid or not',
                resolver: 'plugins::users-permissions.user.isValidUsername',
            },
            isAvailableEmail: {
                description: 'Check if email is available to register or not',
                resolver: 'plugins::users-permissions.user.isAvailableEmail',
            },
            isAvailableUsername: {
                description: 'Check if username is available to register or not',
                resolver: 'plugins::users-permissions.user.isAvailableUsername',
            },
        },
        Mutation: {
            changePassword: {
                description: 'Change password by enter current password and new password',
                resolver: 'plugins::users-permissions.user.changePassword',
            },
            customRegister: {
                description: "Register a user, but allow for additional User fields.",
                resolverOf: "plugins::users-permissions.auth.register",
                resolver: async (obj, options, { context }) => {
                    context.request.body = _.toPlainObject(options.input);
                    await strapi.plugins['users-permissions'].controllers.auth.register(context);
                    
                    let output = context.body.toJSON ? context.body.toJSON() : context.body;
                    console.log(output);

                    checkBadRequest(output);
                    return {
                        user: output.user || output,
                        jwt: output.jwt
                    }
                }
            }
        },
    },
};
