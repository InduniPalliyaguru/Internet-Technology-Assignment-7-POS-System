import { customerDB, ordersDB, itemDB } from "../db/DB.js";

export function updateDashboardMetrics() {
    let totalSales = ordersDB.reduce((sum, order) => sum + parseFloat(order.totalPrice), 0);

    let totalOrders = ordersDB.length;

    let totalCustomers = customerDB.length;

    let inventoryStatus = itemDB.some(item => item.itemQty < 30) ? "Low Stock" : "Sufficient Stock";

    $("#totalSalesMetric").text(`Rs.${totalSales}`);
    $("#totalOrdersMetric").text(totalOrders);
    $("#allCustomersMetric").text(totalCustomers);
    $("#inventoryMetric").text(inventoryStatus);
}

$(document).ready(function () {
    updateDashboardMetrics();

    $("#logout-button").on("click", function () {
        $(".login-page").css("display", "block");
        $(".main-App").css("display", "none");
    });
});