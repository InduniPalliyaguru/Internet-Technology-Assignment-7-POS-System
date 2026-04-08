const USER =
{
    username: "induni",
    password: "1234"
};

let customerDB = [
    {
        customerId: "C00-001",
        customerName: "Induni Palliyaguru",
        customerAddress: "Galle",
        customerSalary: "100000.00",
    },
];

let itemDB = [
    {
        itemCode: "I00-001",
        itemName: "Ice cream",
        itemQty: 50,
        unitPrice:150.00,
    },
];

let ordersDB = [
    {  
    orderId:"OID-001",
    orderDate:"2025/03/24", 
    customerId:"C00-001", 
    discount: 5, 
    totalPrice: 1800,
    orderDetails:[
        {itmCode:"I00-001", unitPrice:1200.00, qty:5},
    ]
  },
];