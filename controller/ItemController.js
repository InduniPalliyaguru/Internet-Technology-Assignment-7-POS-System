$(document).ready(function () {
    
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

});