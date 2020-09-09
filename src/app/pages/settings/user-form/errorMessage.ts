export const userFormErrorMessages = {
    email: {
        required: 'validation.email.required',
        email: 'validation.email.email',
    },
    userName: {
        required: 'validation.userName.required',
        minlength: 'validation.userName.minlength',
        maxlength: 'validation.userName.maxlength',
        // ...getLengthErrorObj('First name', 3, 50),
    },
    firstName: {
        required: 'validation.firstName.required',
        minlength: 'validation.firstName.minlength',
        maxlength: 'validation.firstName.maxlength',
        // ...getLengthErrorObj('First name', 3, 50),
    },
    lastName: {
        required: 'validation.lastName.required',
        minlength: 'validation.lastName.minlength',
        maxlength: 'validation.lastName.maxlength',
        // ...getLengthErrorObj('Last name', 3, 50),
    },
    password: {
        required: 'validation.password.required',
        minlength: 'validation.password.minlength',
        maxlength: 'validation.password.maxlength',
        pattern: 'validation.password.pattern'
    },
    confirmNewPassword: {
        required: 'validation.password.required',
        mustMatch: 'validation.confirmNewPassword.mustMatch',
    }
};

function getLengthErrorObj(entity: string, minLength: number, maxLength: number) {
    return {
        minlength: `${entity} min length is: ${minLength}`,
        maxlength: `${entity} max length is: ${maxLength}`,
    };
}
