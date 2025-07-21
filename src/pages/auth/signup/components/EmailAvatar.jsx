import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "@/features/auth/signupSlice.js";
import { contactSchema } from "@/validation/authSchema";

const EmailAvatar = ({ onNext, onBack }) => {
  const { email } = useSelector((state) => state.signupForm);
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
        <Form className="space-y-4 bg-white p-6 rounded-md shadow-md w-[400px]">
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
              className="btn btn-secondary"
            >
              Back
            </button>
            <button type="submit" className="btn btn-primary">
              Next
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EmailAvatar;
