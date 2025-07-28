import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "@/features/auth/signupSlice.js";
import { fullNameSchema } from "@/validation/authSchema";

const FullName = ({ onNext }) => {
  const { fullName } = useSelector((state) => state.signupForm);
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{ fullName }}
      validationSchema={fullNameSchema}
      onSubmit={(values) => {
        dispatch(updateField({ field: "fullName", value: values.fullName }));
        onNext();
      }}
    >
      {() => (
        <Form className="space-y-4 rounded-md">
          <h2 className="text-lg font-bold">Step 1: Full Name</h2>
          <div>
            <label>Full Name</label>
            <Field name="fullName" className="w-full p-2 border rounded" />
            <ErrorMessage
              name="fullName"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Next
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default FullName;
