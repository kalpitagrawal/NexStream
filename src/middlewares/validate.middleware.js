import { ApiError } from "../utils/ApiError.js";

/**
 * Middleware factory that validates req.body against a Zod schema.
 * Returns a 400 error with detailed validation messages on failure.
 * @param {import("zod").ZodSchema} schema - The Zod schema to validate against
 */
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        const errorMessages = result.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message
        }));

        throw new ApiError(400, "Validation failed", errorMessages);
    }

    // Replace body with parsed (cleaned/trimmed) data
    req.body = result.data;
    next();
};

export { validate };
