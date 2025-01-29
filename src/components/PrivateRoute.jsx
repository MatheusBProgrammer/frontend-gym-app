// src/components/PrivateRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    // se não estiver autenticado, redireciona para "/"
    return <Navigate to="/login" />;
  }
  return children;
}

export default PrivateRoute;
