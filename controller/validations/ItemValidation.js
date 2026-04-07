const ITEM_CODE_REGEX = /^(I00-)[0-9]{3}$/;
const ITEM_NAME_REGEX = /^[A-Za-z0-9 ]{3,20}$/;
const ITEM_QTY_REGEX = /^[0-9]+$/;
const ITEM_PRICE_REGEX = /^(?:\d+|\d+\.\d{2})$/;

function validateItemField(input, regex, errorElement, message) {
    const value = input.val().trim();// get input value

    if (regex.test(value)) {// check pattern
        input.removeClass("is-invalid").addClass("is-valid");
        errorElement.text("");
        return true;// valid
    } else {
        input.removeClass("is-valid").addClass("is-invalid");
        errorElement.text(message);
        return false; // invalid
    }
}

function resetValidation(formSelector) {
    $(formSelector).find(".form-control").removeClass("is-valid is-invalid");
}