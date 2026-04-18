export class Order {
    constructor(orderId, orderDate, customerId, discount, totalPrice, orderDetails) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.customerId = customerId;
        this.discount = discount;
        this.totalPrice = totalPrice;
        this.orderDetails = orderDetails;
    }
}

console.log(new Order);