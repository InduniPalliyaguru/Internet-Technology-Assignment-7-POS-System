const CUS_ID_REGEX = /^(C00-)[0-9]{3}$/;
const CUS_NAME_REGEX = /^[A-Za-z ]{4,20}$/;
const CUS_ADDRESS_REGEX = /^[A-Za-z0-9\s,.\-]{5,20}$/;
const CUS_SALARY_REGEX = /^(?:\d+|\d+\.\d{2})$/;

function validateCustomerField(input, regex, errorElement, message) {
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