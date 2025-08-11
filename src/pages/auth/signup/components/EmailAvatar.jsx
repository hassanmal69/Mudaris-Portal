import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "@/features/auth/signupSlice.js";
import { contactSchema } from "@/validation/authSchema";

const EmailAvatar = ({ onNext, onBack, invite }) => {
  console.log("invite", invite);
  const email = invite.email;
  console.log("email step", email);
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{ email, avatarFile: null }}
      validationSchema={contactSchema}
      onSubmit={(values) => {
        dispatch(updateField({ field: "email", value: values.email }));
        onNext({ avatarFile: values.avatarFile });
      }}
    >
      {({ setFieldValue }) => (
        <Form className="space-y-4  rounded-md">
          <h2 className="text-lg font-bold">Step 2: Contact</h2>

          <div>
            <label>Email</label>
            <Field name="email" className="w-full p-2 border rounded" />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label>Avatar (optional)</label>
            <input
              type="file"
              onChange={(event) =>
                setFieldValue("avatarFile", event.currentTarget.files[0])
              }
            />
            <ErrorMessage
              name="avatarFile"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onBack}
              className="btn btn-secondary bg-yellow-50 text-black py-1.5 px-6 rounded-2xl text-l font-semibold"
            >
              Back
            </button>
            <button
              type="submit"
              className="btn btn-primary bg-purple py-1.5 px-6 rounded-2xl text-l font-semibold"
            >
              Next
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EmailAvatar;
