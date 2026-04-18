import { itemDB, customerDB, ordersDB } from "../db/DB.js";
import { Order } from "../modal/Orders.js";
import { updateDashboardMetrics } from "./DashboardController.js";

export function loadCustomerDropDown() {
    const $customerSelect = $("#orderCustomerId");
    $customerSelect.empty().append('<option value="">Select Customer</option>');
    customerDB.forEach(function (customer) {
        $customerSelect.append(`<option value="${customer.customerId}">${customer.customerId}</option>`);
    });
}

export function loadItemDropDown() {
    const $itemSelect = $("#orderItemCode");
    $itemSelect.empty().append('<option value="">Select Item</option>');
    itemDB.forEach(function (item) {
        $itemSelect.append(`<option value="${item.itemCode}">${item.itemCode}</option>`);
    });
}

$(document).ready(function () {

    const today = new Date().toISOString().split('T')[0];
    $("#o_inputOrderDate").val(today);

    $("#orderId").val(getNextOrderID());

    getAllOrders();
    loadCustomerDropDown();
    loadItemDropDown();


    $("#orderItemCode").on("change", function () {
        console.log("value changed");
        const selectedID = $(this).val();
        const item = itemDB.find(function (items) {
            return items.itemCode === selectedID;
        });

        if (item) {
            $("#orderItemName").val(item.itemName);
            $("#orderItemQty").val(item.itemQty);
            $("#orderItemPrice").val(item.unitPrice);
        } else {
            $("#orderItemName").val("");
            $("#orderItemQty").val("");
            $("#orderItemPrice").val("");
        }
    });

    $("#orderCustomerId").on("change", function () {
        console.log("value changed");
        const selectedID = $(this).val();
        const customer = customerDB.find(function (customers) {
            return customers.customerId === selectedID;
        });

        if (customer) {
            $("#orderCustomerName").val(customer.customerName);
            $("#orderCustomerAddress").val(customer.customerAddress);
        } else {
            $("#orderCustomerName").val("");
            $("#orderCustomerAddress").val("");
        }
    });

    $("#btnAddToCart").on("click", function () {
        const itemCode = $("#orderItemCode").val();
        const itemName = $("#orderItemName").val();
        const unitPrice = $("#orderItemPrice").val();
        const orderedQty = parseInt($("#orderQty").val(), 10);

        if (!itemCode) {
            alert("Please select an item.");
            return;
        }

        if (isNaN(orderedQty) || orderedQty <= 0) {
            alert("Please enter a valid ordered quantity.");
            return;
        }

        const availableQty = parseInt($("#orderItemQty").val(), 10);
        if (orderedQty > availableQty) {
            alert("Ordered quantity exceeds available quantity.");
            return;
        }

        const total = unitPrice * orderedQty;

        let itemExists = false;

        $("#placeOrderTableBody tr").each(function () {
            const existingItemCode = $(this).find("td:eq(0)").text();

            if (existingItemCode === itemCode) {
                const existingQty = parseInt($(this).find("td:eq(3)").text(), 10);
                console.log(orderedQty);
                console.log(existingQty);
                const newQty = (existingQty + orderedQty);
                console.log(newQty);
                const newTotal = unitPrice * newQty;

                $(this).find("td:eq(3)").text(newQty);
                $(this).find("td:eq(4)").text(newTotal.toFixed(2));

                itemExists = true;
                return false; // after the update loop is stop
            }
        });

        if (!itemExists) {
            const newRow = `
          <tr>
            <td>${itemCode}</td>
            <td>${itemName}</td>
            <td>${unitPrice}</td>
            <td>${orderedQty}</td>
            <td>${total.toFixed(2)}</td>
          </tr>
        `;
            $("#placeOrderTableBody").append(newRow);
        }

        const item = itemDB.find(function (item) {
            return item.itemCode === itemCode;
        });
        if (item) {
            item.itemQty -= orderedQty;
        }

        $("#orderItemQty").val(item ? item.itemQty : "");

        updateTotals();
    });

    $("#discountInput").on("keyup change", function () {
        const value = $(this).val().trim();
        if (validateDiscount(value)) {
            $(this).removeClass("is-invalid").addClass("is-valid");
            $("#discountError").text("");
        } else {
            $(this).removeClass("is-valid").addClass("is-invalid");
            $("#discountError").text("Enter a valid discount (0 - 100)");
        }
        updateBalance();
    });

    $("#cashInput").on("keyup change", function () {
        const value = $(this).val().trim();
        const total = parseFloat($("#totalPrice").text()) || 0;
        const cash = parseFloat(value);

        if (validateCash(cash)) {
            if (cash < total) {
                $(this).removeClass("is-valid").addClass("is-invalid");
                $("#cashError").text("Insufficient cash. Must be greater than total.");
            } else {
                $(this).removeClass("is-invalid").addClass("is-valid");
                $("#cashError").text("");
            }
        } else {
            $(this).removeClass("is-valid").addClass("is-invalid");
            $("#cashError").text("Enter a valid cash amount");
        }
        updateBalance();
    });

    $("#orderQty").on("keyup", function () {
        validateQtyWhileTyping(
            $(this),
            $("#itemQtyError"),
            "Please enter a valid ordered quantity."
        );
    });

    $("#btnPlaceOrder").on("click", function () {
        const discount = parseFloat($("#discountInput").val());
        const cash = parseFloat($("#cashInput").val());
        const total = parseFloat($("#totalPrice").text());

        let hasError = false;

        if (!validateDiscount(discount)) {
            $("#discountError").text("Enter a valid discount (0 - 100)");
            hasError = true;
        } else {
            $("#discountError").text("");
        }

        if (!validateCash(cash)) {
            $("#cashError").text("Enter a valid cash amount");
            hasError = true;
        } else if (cash < total) {
            $("#cashError").text("Insufficient cash. Must be greater than total.");
            hasError = true;
        } else {
            $("#cashError").text("");
        }

        if (hasError) return;

        const balance = cash - total;
        $("#balanceInput").val(balance.toFixed(2));

        saveOrder();
        getAllOrders();
    });

    $(document).on("click", ".btn-view", function () {
        const row = $(this).closest("tr");

        const id = row.find("td:eq(0)").text();
        console.log(id);

        const order = ordersDB.find(function (orders) {
            return orders.orderId === id;
        });

        fillOrderFormAtView(order);
    });

    $("#btnRestFormOrderDetails").on("click", function () {
        clearOrderForm();
    });

    $(document).on("click", "#btnDeletteOrderDetails", function () {
        let orderId = $(this).closest("tr").find("td:eq(0)").text();
        deleteOrder(orderId);
    });

    $("#orderSearchButton").on("click", function (e) {
        let searchTerm = $("#form3").val().toLowerCase();

        let filteredOrders = ordersDB.filter(function (order) {
            return order.orderId.toLowerCase().includes(searchTerm);
        });

        renderOrderTable(filteredOrders);
    });

    // Functions

    function renderOrderTable(order) {
        $("#orderDetailsTableBody").empty();
        order.forEach(function (orders) {
            addToTable(orders);
        });
    }

    function getNextOrderID() {
        if (ordersDB.length === 0) return "OID-001";

        let maxID = 0;

        ordersDB.forEach(function (order) {
            const parts = order.orderId.split("-");
            if (parts.length === 2) {
                const num = parseInt(parts[1], 10);
                if (num > maxID) {
                    maxID = num;
                }
            }
        });
        const nextNumber = maxID + 1;
        return `OID-${nextNumber.toString().padStart(3, "0")}`;
    }

    function updateTotals() {
        let subTotal = 0;
        $("#placeOrderTableBody tr").each(function () {
            const rowTotal = parseFloat($(this).find("td:eq(4)").text());
            subTotal += rowTotal;
        });
        $("#subTotalPrice").text(subTotal.toFixed(2));
        $("#discountAmount").text("0.00");
        $("#totalPrice").text(subTotal.toFixed(2));
    }

    function validateDiscount(discount) {

        if (discount < 0 || discount > 100) {
            return false;
        }
        return true;

    }

    function updateBalance() {
        let subTotal = parseFloat($("#subTotalPrice").text());
        let discount = parseFloat($("#discountInput").val()) || 0;
        let cash = parseFloat($("#cashInput").val()) || 0;

        const discountAmount = subTotal * (discount / 100);
        const finalTotal = subTotal - discountAmount;
        const balance = cash - finalTotal;

        $("#discountAmount").text(discountAmount.toFixed(2));
        $("#totalPrice").text(finalTotal.toFixed(2));
        $("#balanceInput").val(balance.toFixed(2));
    }

    function validateCash(cash) {
        if (isNaN(cash) || cash < 0) {
            return false;
        }
        return true;
    }

    function validateQtyWhileTyping(input, errorField, errorMsg) {
        const value = parseFloat(input.val());
        if (isNaN(value) || value <= 0) {
            errorField.text(errorMsg);
            input.addClass("is-invalid");
            return false;
        } else {
            errorField.text("");
            input.removeClass("is-invalid");
            return true;
        }
    }

    function saveOrder() {
        const orderId = $("#orderId").val();
        const orderDate = $("#o_inputOrderDate").val();
        const customerId = $('#orderCustomerId').val();
        const discount = $("#discountInput").val();
        const totalPrice = parseFloat($("#totalPrice").text());

        const orderDetails = [];

        $("#placeOrderTableBody tr").each(function () {
            const itmCode = $(this).find("td:eq(0)").text();
            const unitPrice = parseFloat($(this).find("td:eq(2)").text());
            const qty = parseInt($(this).find("td:eq(3)").text(), 10);

            orderDetails.push({ itmCode, unitPrice, qty });
        });

        if (confirm("Do you really want to place this order?")) {
            const order = new Order(orderId, orderDate, customerId, discount, totalPrice, orderDetails);
            ordersDB.push(order);
            console.log(order);
            alert("Order placed successfully!");

            clearOrderForm();
        }
        getAllOrders();
        updateDashboardMetrics();
    }

    function getAllOrders() {
        $("#orderDetailsTableBody").empty();
        ordersDB.forEach(addToTable);
    }

    function addToTable(order) {
        const newRow = `
    <tr>
      <td>${order.orderId}</td>
      <td>${order.customerId}</td>
      <td>${order.orderDate}</td>
      <td>${order.totalPrice}</td>
      <td>
        <button type="button" id="btnViewOrderDetails"
        class="btn btn-sm btn-view fs-6 rounded-3"> View
        </button>

        <button type="button" id="btnDeletteOrderDetails" 
        class="btn btn-sm btn-danger fs-6 rounded-3 ">
            Delete
        </button>
        </td>
    </tr>
    `;

        $("#orderDetailsTableBody").append(newRow);
    }

    function clearOrderForm() {

        setOrderFormReadonly(false);

        $("#orderCustomerId").val("");
        $("#orderCustomerName").val("");
        $("#orderCustomerAddress").val("");
        $("#orderItemCode").val("");
        $("#orderItemName").val("");
        $("#orderItemQty").val("");
        $("#orderItemPrice").val("");
        $("#orderQty").val("");

        $("#placeOrderTableBody").empty();

        $("#subTotalPrice").text("0.00");
        $("#discountInput").val("");
        $("#discountAmount").text("0.00");
        $("#totalPrice").text("0.00");
        $("#cashInput").val("");
        $("#balanceInput").val("");

        $("#orderId").val(getNextOrderID());

    }

    function fillOrderFormAtView(order) {
        $("#orderCustomerId").val(order.customerId);
        const customer = customerDB.find(function (customers) {
            return customers.customerId === order.customerId;
        });

        if (customer) {
            $("#orderCustomerName").val(customer.customerName);
            $("#orderCustomerAddress").val(customer.customerAddress);
        } else {
            $("#orderCustomerName").val("");
            $("#orderCustomerAddress").val("");
        }

        $("#orderItemCode").val();
        $("#orderItemName").val("");
        $("#orderItemQty").val("");
        $("#orderItemPrice").val("");
        $("#orderQty").val("");

        $("#placeOrderTableBody").empty();
        const orderDetails = order.orderDetails;
        orderDetails.forEach(function (details) {

            console.log(details);
            const item = itemDB.find(function (items) {
                return items.itemCode === details.itmCode;
            });

            if (!item) {
                console.error("Item not found:", details.itmCode);
                return;
            }

            const qty = details.qty || details.orderedQty;

            const newRow = `
        <tr>
            <td>${details.itmCode}</td>
            <td>${item.itemName}</td>
            <td>${item.unitPrice}</td>
            <td>${qty}</td>
            <td>${(item.unitPrice * qty).toFixed(2)}</td>
        </tr>
        `;

            $("#placeOrderTableBody").append(newRow);
        });

        $("#subTotalPrice").text(order.totalPrice);
        $("#discountInput").val(order.discount);
        $("#discountAmount").text("");
        $("#totalPrice").text(order.totalPrice);
        $("#cashInput").val("");
        $("#balanceInput").val("");

        $("#orderId").val(order.orderId);

        setOrderFormReadonly(true);
    }

    function setOrderFormReadonly(isReadonly) {

        $("#orderCustomerId").prop("disabled", isReadonly);
        $("#orderCustomerName").prop("readonly", isReadonly);
        $("#orderCustomerAddress").prop("readonly", isReadonly);

        $("#orderItemCode").prop("disabled", isReadonly);
        $("#orderItemName").prop("readonly", isReadonly);
        $("#orderItemQty").prop("readonly", isReadonly);
        $("#orderItemPrice").prop("readonly", isReadonly);

        $("#orderQty").prop("readonly", isReadonly);

        $("#discountInput").prop("readonly", isReadonly);
        $("#cashInput").prop("readonly", isReadonly);
    }

    function deleteOrder(id) {
        let result = confirm("Are you sure you want to remove this order Details?");

        if (result) {
            let index = ordersDB.findIndex(function (e) {
                return e.orderId === id;
            });

            if (index !== -1) {
                ordersDB.splice(index, 1);
                alert("Order details deleted successfully!");
                getAllOrders();
            } else {
                alert("Order details not removed");
            }
        }
        updateDashboardMetrics();
    }

});