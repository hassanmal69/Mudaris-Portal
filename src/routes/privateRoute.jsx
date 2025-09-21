import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
const PrivateRoute = ({ children }) => {
  const location = useLocation();

  const { session } = useSelector((state) => state.auth);
  if (session === undefined) {
    return <p>loading.......</p>;
  }
  if (session) return children
  return <Navigate to="/" state={{ from: location }} replace />;
};
export default PrivateRoute;
