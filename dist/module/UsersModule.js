"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rePassword: { type: String, required: false },
    pic: { type: String, required: false },
}, {
    timestamps: true,
});
exports.user = (0, mongoose_1.model)("user", userSchema);
