$(document).ready(function () {

    const today = new Date().toISOString().split('T')[0];
    $("#o_inputOrderDate").val(today);

    $("#orderId").val(getNextOrderID());

    loadCustomerDropDown();
    loadItemDropDown();

    function loadCustomerDropDown() {
        const $customerSelect = $("#orderCustomerId");
        $customerSelect.empty().append('<option value="">Select Customer</option>');
        customerDB.forEach(function (customer) {
            $customerSelect.append(`<option value="${customer.customerId}">${customer.customerId}</option>`);
        });
    }

    function loadItemDropDown() {
        const $itemSelect = $("#orderItemCode");
        $itemSelect.empty().append('<option value="">Select Item</option>');
        itemDB.forEach(function (item) {
            $itemSelect.append(`<option value="${item.itemCode}">${item.itemCode}</option>`);
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

});