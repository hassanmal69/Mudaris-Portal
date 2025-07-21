import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const fullNameSchema = Yup.object().shape({
  fullName: Yup.string().min(3).required("Full name is required"),
});

export const contactSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  avatarFile: Yup.mixed().nullable(),
});

export const passwordSchema = Yup.object().shape({
  password: Yup.string().min(6).required("Password is required"),
});
