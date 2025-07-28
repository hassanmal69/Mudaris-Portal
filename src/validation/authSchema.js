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

/// for adding students
export const channelInfoSchema = Yup.object().shape({
  name: Yup.string().required("Channel name is required"),
  description: Yup.string(),
});
export const workspaceInfoSchema = Yup.object().shape({
  name: Yup.string().required("Workspace name is required"),
  description: Yup.string(),
});

export const inviteUsersSchema = Yup.object().shape({
  users: Yup.array()
    .of(
      Yup.string()
        .email("Invalid email")
        .test("is-username-or-email", "Invalid username or email", (value) => {
          // Accepts email or username (alphanumeric, 3+ chars)
          return (
            /^[a-zA-Z0-9_]{3,}$/.test(value) ||
            /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
          );
        })
    )
    .notRequired(),
});
