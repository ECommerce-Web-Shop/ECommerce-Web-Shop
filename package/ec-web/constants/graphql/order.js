export const CHECKOUT = `
    checkout(info: $info) {
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

export const CANCEL_ORDER_BY_ID = `
    cancelOrderById(orderId: $orderId) {
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
`
