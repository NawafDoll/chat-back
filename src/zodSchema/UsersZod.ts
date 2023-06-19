import { z } from "zod";

export const registerZodSchema = z.object({
  body: z
    .object({
      username: z
        .string({ required_error: "أدخل اسم المستخدم" })
        .max(30, "يجب ان يكون النص اقل من 30")
        .min(2, "يجب ان يكون اسم المسخدم اكثر من 2"),
      email: z
        .string({ required_error: "أدخل الايميل " })
        .email({ message: "أدخل ايميل صحيح" })
        .max(50, "يجب ان يكون الايميل أقل من 50"),
      phone: z
        .string({ required_error: "أدخل رقم الجوال" })
        .regex(
          new RegExp(
            ".*[0-9].*[0-9].*[0-9].*[0-9].*[0-9].*[0-9].*[0-9].*[0-9].*[0-9].*[0-9].*"
          ),
          "رقم الجوال المدخل غير صحيح"
        )
        .max(10, "رقم الجوال المدخل غير صحيح")
        .min(10, "رقم الجوال المدخل غير صحيح"),
      password: z
        .string({ required_error: "أدخل الرقم السري" })
        .regex(
          new RegExp(".*[A-Z].*"),
          "يجب ان تتضمن كلمة المرور حرف كبير واحد"
        )
        .regex(
          new RegExp(".*[a-z].*"),
          "يجب ان تتضمن كلمة المرور حرف صغير واحد"
        )
        .regex(new RegExp(".*\\d.*"), "يجب ان تتضمن كلمة المرور رقم واحد")
        .min(6, "يجب ان يكون الرقم السري اكبر من 6")
        .max(30, "يجب ان يكون الرقم السري اقل من 30"),
      rePassword: z.string({ required_error: "أعادة الرقم السري" }),
    })
    .refine((data) => data.password === data.rePassword, {
      message: "كلمة المرور غير متطابقة",
      path: ["rePassword"],
    }),
});

export const loginZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "enter email" })
      .email({ message: "أدخل ايميل صحيح" })
      .max(50, "يجب ان يكون الايميل أقل من 50"),
    password: z
      .string({ required_error: "enter password" })
      .regex(new RegExp(".*[A-Z].*"), "يجب ان تتضمن كلمة المرور حرف كبير واحد")
      .regex(new RegExp(".*[a-z].*"), "يجب ان تتضمن كلمة المرور حرف صغير واحد")
      .regex(new RegExp(".*\\d.*"), "يجب ان تتضمن كلمة المرور رقم واحد")
      .min(6, "يجب ان يكون الرقم السري اكبر من 6")
      .max(30, "يجب ان يكون الرقم السري اقل من 30"),
  }),
});

export const resetPassZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "enter string" })
      .email({ message: "أدخل ايميل صحيح" })
      .max(50, "يجب ان يكون الايميل أقل من 50"),
  }),
});

export const editPassZodSchema = z.object({
  body: z.object({
    password: z
      .string({ required_error: "Enter Password" })
      .regex(new RegExp(".*[A-Z].*"), "يجب ان تتضمن كلمة المرور حرف كبير واحد")
      .regex(new RegExp(".*[a-z].*"), "يجب ان تتضمن كلمة المرور حرف صغير واحد")
      .regex(new RegExp(".*\\d.*"), "يجب ان تتضمن كلمة المرور رقم واحد")
      .min(6, "يجب ان يكون الرقم السري اكبر من 6")
      .max(30, "يجب ان يكون الرقم السري اقل من 30"),
  }),
});
