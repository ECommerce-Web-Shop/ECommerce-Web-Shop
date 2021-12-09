import axiosClient from "./clients/axiosClient";
import callApi from "./functions/callApi";
import {
    LOGIN,
    REGISTER,
    GET_USER_CART,
    ME,
    FORGET_PASSWORD,
    RESET_PASSWORD,
    CHANGE_PASSWORD,
    GET_USER_ORDERS,
    IS_VALID_EMAIL,
    IS_VALID_USERNAME,
    IS_AVAILABLE_EMAIL,
    IS_AVAILABLE_USERNAME,
} from "../constants/graphql/user";

class UserApi {
    login(username, password, options) {
        const query = `
            mutation($input: UsersPermissionsLoginInput!) {
                login: ${LOGIN},
            }
        `;
        const variables = {
            input: {
                identifier: username,
                password,
            },
        };
        return callApi.mutate(query, variables, options);
    }
    register(name, email, phone, username, password, options) {
        const query = `
            mutation($input: CustomUsersPermissionsRegisterInput!) {
                register: ${REGISTER},
            }
        `;
        const variables = {
            input: {
                username,
                email,
                password,
                name,
                phone,
            },
        };
        return callApi.mutate(query, variables, options);
    }
    forgetPassword(email, options) {
        const query = `
            mutation($email: String!) {
                ${FORGET_PASSWORD},
            }
        `;
        const variables = {
            email,
        };
        return callApi.mutate(query, variables, options);
    }
    resetPassword(password, passwordConfirmation, code, options) {
        const query = `
            mutation($password: String!, $passwordConfirmation: String!, $code: String!) {
                resetPassword: ${RESET_PASSWORD},
            }
        `;
        const variables = {
            password,
            passwordConfirmation,
            code,
        };
        return callApi.mutate(query, variables, options);
    }
    changePassword(currentPassword, newPassword, confirmNewPassword, options) {
        const query = `
            mutation($currentPassword: String!, $newPassword: String!, $confirmNewPassword: String!) {
                changePassword: ${CHANGE_PASSWORD},
            }
        `;
        const variables = {
            currentPassword,
            newPassword,
            confirmNewPassword,
        };
        return callApi.mutate(query, variables, options);
    }
    me(options) {
        const query = `
            query {
                me: ${ME},
            }
        `;
        const variables = {};
        return callApi.query(query, variables, options);
    }
    getUserCart(cartId, options) {
        const query = `
            query($cartId: ID) {
                cart: ${GET_USER_CART},
            }
        `;
        const variables = !cartId
            ? {}
            : {
                  cartId,
              };
        return callApi.query(query, variables, options);
    }
    getUserOrders(options) {
        const query = `
            query {
                orders: ${GET_USER_ORDERS},
            }
        `;
        const variables = {};
        return callApi.query(query, variables, options);
    }
    isValidEmail(email, options) {
        const query = `
            query($email: String!) {
                valid: ${IS_VALID_EMAIL},
            }
        `;
        const variables = {
            email,
        };
        return callApi.query(query, variables, options);
    }
    isValidUsername(username, options) {
        const query = `
            query($username: String!) {
                valid: ${IS_VALID_USERNAME},
            }
        `;
        const variables = {
            username,
        };
        return callApi.query(query, variables, options);
    }
    isAvailableEmail(email, options) {
        const query = `
            query($email: String!) {
                valid: ${IS_AVAILABLE_EMAIL},
            }
        `;
        const variables = {
            email,
        };
        return callApi.query(query, variables, options);
    }
    isAvailableUsername(username, options) {
        const query = `
            query($username: String!) {
                valid: ${IS_AVAILABLE_USERNAME},
            }
        `;
        const variables = {
            username,
        };
        return callApi.query(query, variables, options);
    }
    async resendConfirmedEmail(email) {
        const { status } = await axiosClient.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/send-email-confirmation`,
            {
                email, // user's email
            }
        );
        return status === 200;
    }
}

export default new UserApi();
