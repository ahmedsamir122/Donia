import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
const PreventRoute = ({ children }) => {
  const token = localStorage.getItem("token") || "";

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PreventRoute;
