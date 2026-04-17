import { itemDB, customerDB, ordersDB } from "../db/DB.js";

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
        if (cash <= total) {
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

    // Functions

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

});