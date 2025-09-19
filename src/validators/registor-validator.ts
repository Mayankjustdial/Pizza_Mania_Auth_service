import { checkSchema } from 'express-validator'

export default checkSchema({
    email: {
        trim: true,
        errorMessage: 'Email is required',
        notEmpty: true,
        isEmail: {
            errorMessage: 'Email should be a valid email',
        },
    },
    firstName: {
        errorMessage: 'First name is required',
        notEmpty: true,
        trim: true,
    },
    lastName: {
        trim: true,
        errorMessage: 'Lastname is required',
        notEmpty: true,
    },
    password: {
        errorMessage: 'Password is missing',
        notEmpty: true,
        trim: true,
        isLength: {
            options: { min: 6 },
            errorMessage: 'Password must be at least 6 characters long',
        },
    },
})
// export default [ body('email').notEmpty().withMessage("Email is required")];
