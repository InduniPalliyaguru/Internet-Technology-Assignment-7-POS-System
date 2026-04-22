    const DISCOUNT_MIN = 0;
    const DISCOUNT_MAX = 100;
    const CASH_MIN = 0;

    const ORDER_ID_REGEX = /^OID-[0-9]{3}$/;


export function validateCash(cash) {
    if (isNaN(cash) || cash < CASH_MIN) {
        return false;
    }
    return true;
}

export function validateDiscount(discount) {

    if (discount < DISCOUNT_MIN || discount > DISCOUNT_MAX) {
        return false;
    }
    return true;

}

export function validateQtyWhileTyping(input, errorField, errorMsg) {
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