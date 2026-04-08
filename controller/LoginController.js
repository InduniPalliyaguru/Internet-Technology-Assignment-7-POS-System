
$(document).ready(function () {

    $("#loginButton").on("click", function () {

        const username = $("#username").val().trim();
        const password = $("#password").val().trim();

        console.log(username);
        console.log(password);

        const isUserValid = validateLoginField(
            $("#username"),
            USERNAME_REGEX,
            $("#usernameError"),
            "Invalid Username"
        );

        const isPasswordValid = validateLoginField(
            $("#password"),
            PASSWORD_REGEX,
            $("#passwordError"),
            "Invalid password"
        );

        console.log("is valid user:" + isUserValid);
        console.log("is valid passwrod:" + isPasswordValid);

        if (!isUserValid || !isPasswordValid) {
            return;
        };

        if (
            username === USER.username &&
            password === USER.password
        ) {
            alert("Login Successful!");
            $(".login-page").css("display", "none");
            $(".main-App").css("display", "block");
        } else {
            $("#passwordError").text("Incorrect Usernme or Password");
        }

    });

});