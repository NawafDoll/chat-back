"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            params: req.params,
        });
        next();
    }
    catch (error) {
        const zodErr = error;
        return res.status(400).json({
            message: zodErr.errors[0].message,
        });
    }
};
exports.default = validate;
