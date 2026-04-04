const USERNAME_REGEX = /^[A-Za-z0-9]{4,10}$/;
const PASSWORD_REGEX = /^[A-Za-z0-9@#]{4,10}$/;

function validateLoginField(input, regex, errorElement, message) {
    const value = input.val().trim();// get input value
    if (!regex.test(value)) {// check pattern
        errorElement.text(message);// show error
        return false;// invalid
    }
    errorElement.text("");// clear error
    return true;// valid
}