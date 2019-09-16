const Validator = require('validator');
const isEmpty = require('is-empty');

const validateRegisterInput = (data) => {

    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.username = !isEmpty(data.username) ? data.username : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";
    data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
    data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    
    //USERNAME CHECK
    if (Validator.isEmpty(data.username)) {
        errors.username = "Username field is required";
    }

    if (Validator.isEmpty(data.firstName)) {
        errors.firstName = "First name field is required";
    }

    if (Validator.isEmpty(data.lastName)) {
        errors.lastName = "Last name field is required";
    }

    //EMAIL CHECK
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }

    //PASSWORD CHECK
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "Confirm password field is required";
    }

    if (!Validator.isLength(data.password, { min: 6, max: 30})) {
        errors.password = "Password must be at least 6 characters";
    }

    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

const validateLoginInput = (data) => {

    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.username = !isEmpty(data.username) ? data.username : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    
    // USERNAME checks
    if (Validator.isEmpty(data.username)) {
        errors.username = "Username field is required";
    } 

    // Password checks
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

const validateDashboardInput = (data) => {

    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.username = !isEmpty(data.username) ? data.username : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";
    data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
    data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    
    //USERNAME CHECK
    if (Validator.isEmpty(data.username)) {
        errors.username = "Username field is required";
    }

    if (Validator.isEmpty(data.firstName)) {
        errors.firstName = "First name field is required";
    }

    if (Validator.isEmpty(data.lastName)) {
        errors.lastName = "Last name field is required";
    }
    
    //EMAIL CHECK
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }

    //PASSWORD CHECK
    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match";
    }

    if (!Validator.isEmpty(data.password) && !Validator.isLength(data.password, { min: 6, max: 30})) {
        errors.password = "Password must be at least 6 characters";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

const validateEmailInput = data => {

    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : "";
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    };
}

const validateResetInput = data => {

    let errors = {};
    
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "Confirm password field is required";
    }

    if (!Validator.isLength(data.password, { min: 6, max: 30})) {
        errors.password = "Password must be at least 6 characters";
    }

    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}

module.exports = {
    validateDashboardInput,
    validateLoginInput,
    validateRegisterInput,
    validateEmailInput,
    validateResetInput
}