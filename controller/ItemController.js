$(document).ready(function () {

    getAllItems();
    $("#btnSaveItem").prop("disabled", true);

    $("#itemId").on("keyup", function (e) {
        const valid = validateItemField($(this), ITEM_CODE_REGEX, $("#itemIdError"), "Format: I00-001");
        if (valid && e.key === "Enter") {
            $("#itemName").focus();
        }
    });

    $("#itemName").on("keyup", function (e) {
        const valid = validateItemField($(this), ITEM_NAME_REGEX, $("#itemNameError"), "Minimum 3 characters Max 20");
        if (valid && e.key === "Enter") {
            $("#quantity").focus();
        }
    });

    $("#quantity").on("keyup", function (e) {
        const valid = validateItemField($(this), ITEM_QTY_REGEX, $("#quantityError"), "Enter a valid quantity");
        if (valid && e.key === "Enter") {
            $("#unitPrice").focus();
        }
    });

    $("#unitPrice").on("keyup", function (e) {
        const valid = validateItemField($(this), ITEM_PRICE_REGEX, $("#unitPriceError"), "Format: 100 or 100.00");
        if (valid) {
            $("#btnSaveItem").prop("disabled", false);
        } else {
            $("#btnSaveItem").prop("disabled", true);
        }
    });

    $("#btnSaveItem").on("click", function (e) {
        e.preventDefault();

        const isValid =
            validateItemField($("#itemId"), ITEM_CODE_REGEX, $("#itemIdError"), "Format: I00-001") &&
            validateItemField($("#itemName"), ITEM_NAME_REGEX, $("#itemNameError"), "Minimum 3 characters Max 20") &&
            validateItemField($("#quantity"), ITEM_QTY_REGEX, $("#quantityError"), "Enter a valid quantity") &&
            validateItemField($("#unitPrice"), ITEM_PRICE_REGEX, $("#unitPriceError"), "Format: 100 or 100.00")

        if (!isValid) {
            return;
        }

        saveItems();
        resetItemForm();

    });

    $("#btnRestItemForm").on("click", function (e) {
        e.preventDefault();
        resetItemForm();
    });

    $("#btnRestFormUpdateItem").on("click", function (e) {
        e.preventDefault();
        resetUpdateItemForm();
    });

    $(document).on("click", "#btnDeleteItem", function () {
        let itemCode = $(this).closest("tr").find("td:eq(0)").text();
        deleteItem(itemCode);
    });

    $("#itemTableBody").on("dblclick", "tr", function () {
        let itemId = $(this).find("td:eq(0)").text();
        deleteItem(itemId);

    });

    $("#btnUpdateItemForm").on("click", function (e) {
        e.preventDefault();

        const isValid =
            validateItemField($("#updateItemId"), ITEM_CODE_REGEX, $("#updateItemIdError"), "Format: I00-001") &&
            validateItemField($("#updateItemName"), ITEM_NAME_REGEX, $("#updateItemNameError"), "Minimum 3 characters Max 20") &&
            validateItemField($("#updateItemQuantity"), ITEM_QTY_REGEX, $("#updateItemQuantityError"), "Enter a valid quantity") &&
            validateItemField($("#updateUnitPrice"), ITEM_PRICE_REGEX, $("#updateUnitPriceError"), "Format: 100 or 100.00")

        if (!isValid) {
            return;
        }

        updateItem();
    });

    $(document).on("click", "#btnUpdateItem", function () {
        const row = $(this).closest("tr");

        const id = row.find("td:eq(0)").text();
        const name = row.find("td:eq(1)").text();
        const qty = row.find("td:eq(2)").text();
        const price = row.find("td:eq(3)").text();

        $("#updateItemId").val(id);
        $("#updateItemName").val(name);
        $("#updateItemQuantity").val(qty);
        $("#updateUnitPrice").val(price);
    });

    $("#itemSearchButton").on("click", function (e) {
        let searchTerm = $("#form2").val().toLowerCase();

        let filteredItems = itemDB.filter(function (item) {
            return item.itemCode.toLowerCase().includes(searchTerm);
        });

        renderItemTable(filteredItems);
    });

    // Functions

    function renderItemTable(items) {
        $("#itemTableBody").empty();
        items.forEach(function (item) {
            addToItemTable(item);
        });
    }

    function addToItemTable(item) {
        const newRow = `
    <tr>
      <td>${item.itemCode}</td>
      <td>${item.itemName}</td>
      <td>${item.itemQty}</td>
      <td>${item.unitPrice}</td>
      <td>
          <button type="button" class="btn btn-primary fs-6 p-1" id="btnUpdateItem"
            data-bs-toggle="modal" 
            data-bs-target="#itemUpdateModal"> 
            Update
          </button>

          <button type="button" id="btnDeleteItem"
                class="btn btn-sm btn-danger fs-6 rounded-3"> 
                Delete 
          </button>
      </td>
    </tr>
    `;

        $("#itemTable tbody").append(newRow);

    }

    function getAllItems() {
        $("#itemTable tbody").empty();
        itemDB.forEach(addToItemTable);
    }

    function saveItems() {
        const id = $("#itemId").val();
        const name = $("#itemName").val();
        const qty = $("#quantity").val();
        const price = $("#unitPrice").val();

        if (existItem(id)) {
            alert("Item with this Code already exist!");
            return;
        }

        if (confirm('Do you really need to add this Item...?')) {
            const item = new Item(id, name, qty, price);

            itemDB.push(item);
            getAllItems();
            alert("Item Saved succeccfully!");
        }
    }

    function resetItemForm() {
        $("#itemRegistrationForm")[0].reset();
        resetItemValidation("#itemRegistrationForm");
        $("#btnSaveItem").prop("disabled", true);
    }

    function resetUpdateItemForm() {
        $("#itemUpdateForm")[0].reset();
        resetItemValidation("#itemUpdateForm");
    }

    function existItem(id) {
        return itemDB.some(function (item) {
            return item.itemCode === id;
        });
    }

    function deleteItem(id) {
        let result = confirm("Are you sure you want to remove this item?");

        if (result) {
            let index = itemDB.findIndex(function (e) {
                return e.itemCode === id;
            });

            if (index !== -1) {
                itemDB.splice(index, 1);
                alert("Item deleted successfully!");
                getAllItems();
            } else {
                alert("Item not removed");
            }
        }
    }

    function updateItem() {
        const id = $("#updateItemId").val();
        const name = $("#updateItemName").val();
        const qty = $("#updateItemQuantity").val();
        const price = $("#updateUnitPrice").val();

        const item = new Item(id, name, qty, price);

        const itemIndex = itemDB.findIndex(function (i) {
            return i.itemCode === item.itemCode;
        });

        if (itemIndex === -1) {
            alert("Item not found!", "warning");
            return;
        }

        if (confirm('Do you really need to update this Item...?')) {

            itemDB[itemIndex] = item;

            getAllItems();
            alert("Item update successfully!");
            resetUpdateItemForm();
        }
    }

});