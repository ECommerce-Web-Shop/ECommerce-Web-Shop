
import callApi from "./functions/callApi";
import {
    CHECKOUT,
    CANCEL_ORDER_BY_ID,
} from "../constants/graphql/order";

class OrderApi {
    checkout(consigneeName, consigneePhone, email, addressLine1, district, city, paymentMethod, options) {
        const query = `
            mutation($info: OrderInfo!) {
                order: ${CHECKOUT},
            }
        `;
        const variables = {
            info: {
                consigneeName,
                consigneePhone,
                email,
                addressLine1,
                district,
                city,
                paymentMethod,
            }
        };
        return callApi.mutate(query, variables, options);
    }
    cancelOrderById(orderId) {
        const query = `
            mutation($orderId: ID!) {
                cancelledOrder: ${CANCEL_ORDER_BY_ID},
            }
        `;
        const variables = {
            orderId
        };
        return callApi.mutate(query, variables, options);
    }
}

export default new OrderApi();
