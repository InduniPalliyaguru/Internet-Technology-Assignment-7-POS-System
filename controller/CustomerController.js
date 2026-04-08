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

    $("#btnUpdateCustomerForm").on("click", function (e) {
        e.preventDefault();

        const isValid =
            validateCustomerField($("#updateCustomerId"), CUS_ID_REGEX, $("#updateCustomerIdError"), "Format: C00-001") &&
            validateCustomerField($("#updateCustomerName"), CUS_NAME_REGEX, $("#updateCustomerNameError"), "Min 4 characters Max 20") &&
            validateCustomerField($("#updateCustomerAddress"), CUS_ADDRESS_REGEX, $("#updateCustomerAddressError"), "Min 5 characters Max 20") &&
            validateCustomerField($("#updateCustomerSalary"), CUS_SALARY_REGEX, $("#updateCustomerSalaryError"), "Format: 100 or 100.00")

        if (!isValid) {
            return;
        }

        console.log("isvalid" + isValid);

        updateCustomer();
    });

    $(document).on("click", ".btn-delete", function () {
        let customerId = $(this).closest("tr").find("td:eq(0)").text();
        deleteCustomer(customerId);
    });

    $("#customerTableBody").on("dblclick", "tr", function () {
        let customerId = $(this).find("td:eq(0)").text();
        deleteCustomer(customerId);

    });

    $("#btnRestFormUpdate").on("click", function (e) {
        e.preventDefault();
        resetUpdateForm();
    });

    $("#btnRestForm").on("click", function (e) {
        e.preventDefault();
        resetForm();
    });

    $(document).on("click", ".btn-update", function () {
        const row = $(this).closest("tr");

        const id = row.find("td:eq(0)").text();
        const name = row.find("td:eq(1)").text();
        const address = row.find("td:eq(2)").text();
        const salary = row.find("td:eq(3)").text();

        $("#updateCustomerId").val(id);
        $("#updateCustomerName").val(name);
        $("#updateCustomerAddress").val(address);
        $("#updateCustomerSalary").val(salary);
    });

    $("#searchButton").on("click", function (e) {
        let searchTerm = $("#form1").val().toLowerCase();

        let filteredCustomers = customerDB.filter(function (customer) {
            return customer.customerId.toLowerCase().includes(searchTerm);
        });

        renderTable(filteredCustomers);
    });


    // Functions

    function renderTable(customers) {
        $("#customerTableBody").empty();
        customers.forEach(function (customer) {
            addToTable(customer);
        });
    }

    function addToTable(customer) {
        const newRow = `
    <tr>
      <td>${customer.customerId}</td>
      <td>${customer.customerName}</td>
      <td>${customer.customerAddress}</td>
      <td>${customer.customerSalary}</td>
      <td>
        <button type="button" class="btn btn-primary fs-6 p-1 btn-update"
            data-bs-toggle="modal"
            data-bs-target="#customerUpdateModal">
            Update
        </button>

        <button type="button" class="btn btn-sm btn-danger fs-6 rounded-3 btn-delete">
            Delete
        </button>
        </td>
    </tr>
    `;

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

    function updateCustomer() {
        const id = $("#updateCustomerId").val();
        const name = $("#updateCustomerName").val();
        const address = $("#updateCustomerAddress").val();
        const salary = $("#updateCustomerSalary").val();

        const customer = new Customer(id, name, address, salary);

        const customerIndex = customerDB.findIndex(function (c) {
            return c.customerId === customer.customerId;
        });

        console.log(customerIndex);
        if (customerIndex === -1) {
            alert("Customer not found!", "warning");
            return;
        }

        if (confirm('Do you really need to update this Customer...?')) {

            customerDB[customerIndex] = customer;

            getAllCustomers();
            alert("Customer update successfully!");
            resetUpdateForm();
        }
    }

    function deleteCustomer(id) {
        let result = confirm("Are you sure you want to remove this customer?");

        if (result) {
            let index = customerDB.findIndex(function (e) {
                return e.customerId === id;
            });

            if (index !== -1) {
                customerDB.splice(index, 1);
                alert("Customer deleted successfully!");
                getAllCustomers();
            } else {
                alert("Customer not removed");
            }
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

    function resetUpdateForm() {
        $("#updateForm")[0].reset();
        resetValidation("#updateForm");
    }

});