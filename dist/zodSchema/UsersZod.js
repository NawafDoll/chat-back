"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPassZodSchema = exports.resetPassZodSchema = exports.loginZodSchema = exports.registerZodSchema = void 0;
const zod_1 = require("zod");
exports.registerZodSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        username: zod_1.z
            .string({ required_error: "أدخل اسم المستخدم" })
            .max(30, "يجب ان يكون النص اقل من 30")
            .min(2, "يجب ان يكون اسم المسخدم اكثر من 2"),
        email: zod_1.z
            .string({ required_error: "أدخل الايميل " })
            .email({ message: "أدخل ايميل صحيح" })
            .max(50, "يجب ان يكون الايميل أقل من 50"),
        phone: zod_1.z
            .string({ required_error: "أدخل رقم الجوال" })
            .regex(new RegExp(".*[0-9].*[0-9].*[0-9].*[0-9].*[0-9].*[0-9].*[0-9].*[0-9].*[0-9].*[0-9].*"), "رقم الجوال المدخل غير صحيح")
            .max(10, "رقم الجوال المدخل غير صحيح")
            .min(10, "رقم الجوال المدخل غير صحيح"),
        password: zod_1.z
            .string({ required_error: "أدخل الرقم السري" })
            .regex(new RegExp(".*[A-Z].*"), "يجب ان تتضمن كلمة المرور حرف كبير واحد")
            .regex(new RegExp(".*[a-z].*"), "يجب ان تتضمن كلمة المرور حرف صغير واحد")
            .regex(new RegExp(".*\\d.*"), "يجب ان تتضمن كلمة المرور رقم واحد")
            .min(6, "يجب ان يكون الرقم السري اكبر من 6")
            .max(30, "يجب ان يكون الرقم السري اقل من 30"),
        rePassword: zod_1.z.string({ required_error: "أعادة الرقم السري" }),
    })
        .refine((data) => data.password === data.rePassword, {
        message: "كلمة المرور غير متطابقة",
        path: ["rePassword"],
    }),
});
exports.loginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: "enter email" })
            .email({ message: "أدخل ايميل صحيح" })
            .max(50, "يجب ان يكون الايميل أقل من 50"),
        password: zod_1.z
            .string({ required_error: "enter password" })
            .regex(new RegExp(".*[A-Z].*"), "يجب ان تتضمن كلمة المرور حرف كبير واحد")
            .regex(new RegExp(".*[a-z].*"), "يجب ان تتضمن كلمة المرور حرف صغير واحد")
            .regex(new RegExp(".*\\d.*"), "يجب ان تتضمن كلمة المرور رقم واحد")
            .min(6, "يجب ان يكون الرقم السري اكبر من 6")
            .max(30, "يجب ان يكون الرقم السري اقل من 30"),
    }),
});
exports.resetPassZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: "enter string" })
            .email({ message: "أدخل ايميل صحيح" })
            .max(50, "يجب ان يكون الايميل أقل من 50"),
    }),
});
exports.editPassZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z
            .string({ required_error: "Enter Password" })
            .regex(new RegExp(".*[A-Z].*"), "يجب ان تتضمن كلمة المرور حرف كبير واحد")
            .regex(new RegExp(".*[a-z].*"), "يجب ان تتضمن كلمة المرور حرف صغير واحد")
            .regex(new RegExp(".*\\d.*"), "يجب ان تتضمن كلمة المرور رقم واحد")
            .min(6, "يجب ان يكون الرقم السري اكبر من 6")
            .max(30, "يجب ان يكون الرقم السري اقل من 30"),
    }),
});
