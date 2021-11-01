import userApi from "../../apis/user.api";

export const LOGIN = `
    login(input: $input) {
        jwt
        user {
            username
            email
        }
    }
`;

export const REGISTER = `
    customRegister(input: $input) {
        user {
            username
        }
        jwt
    }
`;

export const FORGET_PASSWORD = `
    forgotPassword(email: $email) {
        ok
    }
`;

export const RESET_PASSWORD = `
    resetPassword(password: $password, passwordConfirmation: $passwordConfirmation, code: $code) {
        user {
            username
        }
    }
`;

export const CHANGE_PASSWORD = `
    changePassword(
        currentPassword: $currentPassword,
        newPassword: $newPassword,
        confirmNewPassword: $confirmNewPassword,
    )
`;

export const ME = `
    customMe {
        id
        username
        name
        email
        phone
        blocked
        confirmed
        role {
            name
        }
    }
`;

export const GET_USER_CART = `
    getCart(cartId: $cartId) {
        _id
        items {
            _id
            selected
        }
    }
`;

export const GET_USER_ORDERS = `
    getOrders {
        id
        orderCode
        consigneeName
        consigneePhone
        email
        addressLine1
        district
        city
        items {
            product {
            name
            thumbnail {
                url
            }
            }
            color
            qty
            unitPrice
            totalPrice
        }
        coupon {
            code
        }
        totalAmount
        finalAmount
        status
        paymentMethod
        isPaid
    }
`;

export const IS_VALID_EMAIL = `
    isValidEmail(email: $email)
`;

export const IS_VALID_USERNAME = `
    isValidUsername(username: $username)
`;

export const IS_AVAILABLE_EMAIL = `
    isAvailableEmail(email: $email)
`;

export const IS_AVAILABLE_USERNAME = `
    isAvailableUsername(username: $username)
`;
