import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const PrivateRoute = ({ children }) => {
  const { session } = useSelector((state) => state.auth);
  if (session === undefined) {
    <p>loading.......</p>;
  }
  return (
    <>
      {" "}
      {session ? (
        <>{children}</>
      ) : (
        <>
          <Navigate to="/" />
        </>
      )}
    </>
  );
};
export default PrivateRoute;
