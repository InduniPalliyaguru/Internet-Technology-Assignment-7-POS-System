$(document).ready(function () {

    $("#btnSaveCustomer").prop("disabled", true);

    $("#customerId").on("keyup", function (e) {
        const valid = validateCustomerField($(this), CUS_ID_REGEX, $("#customerIdError"), "Format: C00-001");
        if (valid && e.key === "Enter") {
            $("#customerName").focus();
        }
    });

    $("#customerName").on("keyup", function (e) {
        const valid = validateCustomerField($(this), CUS_NAME_REGEX, $("#customerNameError"), "Min 4 characters Max 20");
        if (valid && e.key === "Enter") {
            $("#customerAddress").focus();
        }
    });

    $("#customerAddress").on("keyup", function (e) {
        const valid = validateCustomerField($(this), CUS_NAME_REGEX, $("#customerAddressError"), "Min 5 characters Max 20");
        if (valid && e.key === "Enter") {
            $("#customerSalary").focus();
        }
    });

    $("#customerSalary").on("keyup", function (e) {
        const valid = validateCustomerField($(this), CUS_NAME_REGEX, $("#customerSalaryError"), "Format: 100 or 100.00");
        if (valid) {
            $("#btnSaveCustomer").prop("disabled", false);
        } else {
            $("#btnSaveCustomer").prop("disabled", true);
        }
    });

    $("#registrationForm").submit(function (e) {
        e.preventDefault();

        const isValid = 
        validateCustomerField($("#customerId"), CUS_ID_REGEX, $("#customerIdError"), "Format: C00-001") &&
        validateCustomerField($("#customerName"), CUS_NAME_REGEX, $("#customerNameError"), "Min 4 characters Max 20") &&
        validateCustomerField($("#customerAddress"), CUS_NAME_REGEX, $("#customerAddressError"), "Min 5 characters Max 20") &&
        validateCustomerField($("#customerSalary"), CUS_NAME_REGEX, $("#customerSalaryError"), "Format: 100 or 100.00")

        if(!isValid) {
            return;
        }

        saveCustomer();
    });

    function saveCustomer() {

    }

});