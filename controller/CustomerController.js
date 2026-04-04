$(document).ready(function () {

    getAllCustomers();
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
        const valid = validateCustomerField($(this), CUS_ADDRESS_REGEX, $("#customerAddressError"), "Min 5 characters Max 20");
        if (valid && e.key === "Enter") {
            $("#customerSalary").focus();
        }
    });

    $("#customerSalary").on("keyup", function (e) {
        const valid = validateCustomerField($(this), CUS_SALARY_REGEX, $("#customerSalaryError"), "Format: 100 or 100.00");
        if (valid) {
            $("#btnSaveCustomer").prop("disabled", false);
        } else {
            $("#btnSaveCustomer").prop("disabled", true);
        }
    });

    $("#btnSaveCustomer").on("click", function (e) {
        e.preventDefault();

        const isValid =
            validateCustomerField($("#customerId"), CUS_ID_REGEX, $("#customerIdError"), "Format: C00-001") &&
            validateCustomerField($("#customerName"), CUS_NAME_REGEX, $("#customerNameError"), "Min 4 characters Max 20") &&
            validateCustomerField($("#customerAddress"), CUS_ADDRESS_REGEX, $("#customerAddressError"), "Min 5 characters Max 20") &&
            validateCustomerField($("#customerSalary"), CUS_SALARY_REGEX, $("#customerSalaryError"), "Format: 100 or 100.00")

        if (!isValid) {
            return;
        }

        saveCustomer();
        resetForm();
    });


    // Functions

    function addToTable(customerDB) {
        const newRow = `
        <tr>
          <td>${customerDB.customerId}</td>
          <td>${customerDB.customerName}</td>
          <td>${customerDB.customerAddress}</td>
          <td>${customerDB.customerSalary}</td>
          <td>
           <button type="button" class="btn btn-primary fs-6 p-1"
            id="btnUpdateCustomer" data-bs-toggle="modal"
            data-bs-target="#customerUpdateModal">Update</button>

           <button type="button" id="btnDeleteCustomer"
            class="btn btn-sm btn-danger fs-6 rounded-3">Delete</button>
          </td>
        </tr>`;
        $("#customerTable tbody").append(newRow);
    }

    function getAllCustomers() {
        $("#customerTable tbody").empty();
        customerDB.forEach(addToTable);
    }

    function saveCustomer() {
        const id = $("#customerId").val();
        const name = $("#customerName").val();
        const address = $("#customerAddress").val();
        const salary = $("#customerSalary").val();

        if (existCustomer(id)) {
            alert("Customer with this ID already exists!");
            return;
        }

        if (confirm('Do you really need to add this Customer...?')) {
            const customer = new Customer(id, name, address, salary);

            customerDB.push(customer);
            getAllCustomers();
            alert("Customer saved successfully!");
        }
    }

    function existCustomer(id) {
        return customerDB.some(function (customer) {
            return customer.customerId === id;
        });
    }

    function resetForm() {
        $("#registrationForm")[0].reset();
        resetValidation("#registrationForm");
        $("#btnSaveCustomer").prop("disabled", true);
    }

});